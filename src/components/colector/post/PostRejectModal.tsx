import React, { useState } from "react";
import { X } from "lucide-react";

interface PostRejectModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

const PostRejectModal: React.FC<PostRejectModalProps> = ({
  open,
  onClose,
  onConfirm,
}) => {
  const [reason, setReason] = useState("");

  const handleClose = () => {
    setReason("");
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={handleClose}
      ></div>

      {/* Modal container */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gradient-to-r from-red-50 to-pink-50">
          <h2 className="text-2xl font-bold text-gray-800">Từ chối bài đăng</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 overflow-y-auto bg-gray-50 space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Lý do từ chối <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full border border-gray-200 rounded-xl p-3 text-gray-800 placeholder-gray-400 focus:border-red-400 focus:ring-2 focus:ring-red-100 outline-none resize-none transition-all duration-200 bg-white"
              rows={6}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Nhập lý do từ chối bài đăng..."
            />
          </div>

          <div className="bg-white rounded-xl p-4 border border-gray-100 text-gray-600 text-sm shadow-inner">
            <p>
              Vui lòng mô tả chi tiết lý do để người đăng có thể chỉnh sửa và gửi lại
              bài phù hợp hơn. Ví dụ:
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1 text-gray-500">
              <li>Ảnh sản phẩm không rõ ràng</li>
              <li>Mô tả thiếu thông tin liên hệ</li>
              <li>Nội dung không phù hợp quy định</li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-5 border-t border-gray-100 bg-gray-50">
          <button
            onClick={handleClose}
            className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium transition cursor-pointer"
          >
            Hủy
          </button>
          <button
            disabled={!reason.trim()}
            onClick={() => {
              onConfirm(reason);
              setReason("");
            }}
            className={`px-5 py-2 rounded-lg font-medium text-white cursor-pointer shadow-md transition-all duration-200 ${
              reason.trim()
                ? "bg-red-500 hover:bg-red-600"
                : "bg-red-300 cursor-not-allowed"
            }`}
          >
            Xác nhận từ chối
          </button>
        </div>
      </div>

      {/* Animation */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.96) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default PostRejectModal;