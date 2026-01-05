"use client";
import React, { useRef, useState, useEffect } from "react";
import QRCodeSheet from "@/components/small-collector/qrcode/QRCodeSheet";
import { QrCode, Download } from "lucide-react";
import jsPDF from "jspdf";

const QR_LABELS_PER_ROW = 5;
const QR_SIZE = 90;
const LABEL_WIDTH = 105;
const LABEL_HEIGHT = 110;

const QRCodePage: React.FC = () => {
  const qrRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [timestamps, setTimestamps] = useState<string[]>([]);

  // Function to generate new timestamps
  const generateTimestamps = () => {
    const now = Date.now();
    return Array.from({ length: 35 }, (_, i) => (now + i).toString());
  };

  // Generate timestamps once when component mounts
  useEffect(() => {
    setTimestamps(generateTimestamps());
  }, []);

  // Download PDF handler - converts SVG to canvas manually
  const handleDownloadPDF = async () => {
    const doc = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
    const marginX = 30;
    const marginY = 30;
    const gapX = 8;
    const gapY = 5; // Giảm khoảng cách dọc
    let x = marginX;
    let y = marginY;

    for (let i = 0; i < timestamps.length; i++) {
      const ref = qrRefs.current[i];
      if (!ref) continue;
      // Get SVG element
      const svg = ref.querySelector("svg");
      if (!svg) continue;
      // Convert SVG to image data URL
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
      const svgUrl = URL.createObjectURL(svgBlob);
      // Create image and canvas
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = svgUrl;
      });
      const canvas = document.createElement("canvas");
      canvas.width = QR_SIZE * 2;
      canvas.height = QR_SIZE * 2;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }
      URL.revokeObjectURL(svgUrl);
      const imgData = canvas.toDataURL("image/png");
      doc.addImage(imgData, "PNG", x, y, QR_SIZE, QR_SIZE);
      doc.setFontSize(8);
      doc.text(timestamps[i], x + QR_SIZE / 2, y + QR_SIZE + 12, { align: "center" });
      x += LABEL_WIDTH + gapX;
      if ((i + 1) % QR_LABELS_PER_ROW === 0) {
        x = marginX;
        y += LABEL_HEIGHT + gapY;
      }
    }
    doc.save("qr-labels.pdf");
    // Regenerate QR codes after download
    setTimestamps(generateTimestamps());
  };

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-8 justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center border border-primary-200">
            <QrCode className="text-white" size={20} />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Tạo tem QR Code
          </h1>
        </div>
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium cursor-pointer shadow-md border border-primary-200"
        >
          <Download size={20} />
          Tải PDF
        </button>
      </div>
      {/* QR Code Sheet Component */}
      <QRCodeSheet timestamps={timestamps} qrRefs={qrRefs} />
    </div>
  );
};

export default QRCodePage;
