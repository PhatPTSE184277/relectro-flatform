"use client";

import React, { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";

const QR_LABELS_PER_ROW = 5;
const QR_LABELS_PER_COL = 5;
const QR_SIZE = 150;
const LABEL_WIDTH = 180;
const LABEL_HEIGHT = 160;

interface QRCodeSheetProps {
  timestamps?: string[];
  qrRefs?: React.MutableRefObject<(HTMLDivElement | null)[]>;
}

const QRCodeSheet: React.FC<QRCodeSheetProps> = ({ timestamps: propTimestamps, qrRefs }) => {
  // Use passed ref or create local
  const localRefs = useRef<(HTMLDivElement | null)[]>([]);
  const refs = qrRefs || localRefs;

  const [timestamps, setTimestamps] = useState<string[]>([]);

  useEffect(() => {
    if (propTimestamps && propTimestamps.length > 0) {
      setTimestamps(propTimestamps);
    } else {
      const now = Date.now();
      const generatedTimestamps = Array.from(
        { length: QR_LABELS_PER_ROW * QR_LABELS_PER_COL },
        (_, i) => (now + i).toString()
      );
      setTimestamps(generatedTimestamps);
    }
  }, [propTimestamps]);

  const assignRef = (el: HTMLDivElement | null, idx: number) => {
    refs.current[idx] = el;
  };

  return (
    <div className="w-full max-w-[1800px] mx-auto mt-8">
      {/* QR Code Grid */}
      <div className="bg-white rounded-2xl shadow-2xl p-8">
        <div
          className="grid mx-auto"
          style={{
            gridTemplateColumns: `repeat(${QR_LABELS_PER_ROW}, ${LABEL_WIDTH}px)`,
            gap: "24px",
            justifyContent: "center",
          }}
        >
          {timestamps.map((ts, idx) => (
            <div
              key={ts}
              ref={(el) => assignRef(el, idx)}
              className="flex flex-col items-center border border-gray-200 rounded-lg p-2 bg-white"
              style={{ width: LABEL_WIDTH, height: LABEL_HEIGHT }}
            >
              <QRCode value={ts} size={QR_SIZE} />
              <span className="mt-1 text-xs text-gray-600 text-center">{ts}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QRCodeSheet;
