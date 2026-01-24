import React, { useState } from "react";

interface RequestRejectProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  showTags?: boolean;
}

const RequestReject: React.FC<RequestRejectProps> = ({
  open,
  onClose,
  onConfirm,
  showTags = true,
}) => {

  const REASON_TAGS = [
    "Ảnh sản phẩm không rõ ràng",
    "Mô tả thiếu thông tin liên hệ",
    "Nội dung không phù hợp quy định",
    "Khác"
  ];
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customReason, setCustomReason] = useState("");

  const handleClose = () => {
    setSelectedTags([]);
    setCustomReason("");
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
      ></div>

      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 animate-fadeIn">
        
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-linear-to-r from-red-50 to-primary-100">
          <h2 className="text-2xl font-bold text-gray-800">Từ chối yêu cầu</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer"
          >
            &times;
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto bg-gray-50 space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Lý do từ chối <span className="text-red-500">*</span>
            </label>
            {showTags ? (
            <>
            <div className="flex flex-wrap gap-2 mb-2 items-center">
              {/* 3 tag đầu cùng hàng label */}
              {REASON_TAGS.slice(0, 3).map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    className={`px-3 py-1 rounded-full border text-sm font-medium transition-colors cursor-pointer
                      ${isSelected ? "bg-primary-100 border-primary-500 text-primary-700" : "bg-gray-100 border-gray-200 text-gray-600 hover:bg-primary-50"}`}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedTags(selectedTags.filter(t => t !== tag));
                      } else {
                        setSelectedTags([...selectedTags, tag]);
                      }
                    }}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
            {/* Tag 'Khác' xuống dòng dưới */}
            <div className="flex gap-2 mb-2">
              {(() => {
                const tag = REASON_TAGS[3];
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    type="button"
                    key={tag}
                    className={`px-3 py-1 rounded-full border text-sm font-medium transition-colors cursor-pointer
                      ${isSelected ? "bg-primary-100 border-primary-500 text-primary-700" : "bg-gray-100 border-gray-200 text-gray-600 hover:bg-primary-50"}`}
                    onClick={() => {
                      if (isSelected) {
                        setSelectedTags(selectedTags.filter(t => t !== tag));
                        setCustomReason("");
                      } else {
                        setSelectedTags([...selectedTags, tag]);
                      }
                    }}
                  >
                    {tag}
                  </button>
                );
              })()}
            </div>
            {selectedTags.includes("Khác") && (
              <textarea
                className="w-full border border-gray-200 rounded-xl p-3 text-gray-800 placeholder-gray-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none resize-none transition-all duration-200 bg-white"
                rows={4}
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Nhập lý do từ chối bài đăng..."
              />
            )}
            </>
            ) : (
              <textarea
                className="w-full border border-gray-200 rounded-xl p-3 text-gray-800 placeholder-gray-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none resize-none transition-all duration-200 bg-white"
                rows={4}
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Nhập lý do từ chối yêu cầu..."
              />
            )}
          </div>

          {/* Đã xoá hướng dẫn mô tả lý do từ chối */}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-5 border-t border-gray-100 bg-gray-50">
          <button
            disabled={
              showTags 
                ? (selectedTags.length === 0 || (selectedTags.includes("Khác") && !customReason.trim()))
                : !customReason.trim()
            }
            onClick={() => {
              if (showTags) {
                const reasons = selectedTags.filter(t => t !== "Khác");
                if (selectedTags.includes("Khác")) {
                  if (customReason.trim()) reasons.push(customReason.trim());
                }
                onConfirm(reasons.join("; "));
              } else {
                onConfirm(customReason.trim());
              }
              setSelectedTags([]);
              setCustomReason("");
            }}
            className={`px-5 py-2 rounded-lg font-medium text-white cursor-pointer shadow-md transition-all duration-200
              ${(showTags 
                  ? (selectedTags.length === 0 || (selectedTags.includes("Khác") && !customReason.trim()))
                  : !customReason.trim())
                ? "bg-primary-300 cursor-not-allowed"
                : "bg-primary-500 hover:bg-primary-600"}
            `}
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

export default RequestReject;