import React from "react";

interface UserBanProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
  isActive: boolean;
}

const UserBan: React.FC<UserBanProps> = ({
  open,
  onClose,
  onConfirm,
  userName,
  isActive,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 animate-fadeIn">
        <div className={`flex justify-between items-center p-6 border-b border-gray-100 ${
          isActive ? 'bg-linear-to-r from-red-50 to-primary-100' : 'bg-linear-to-r from-green-50 to-primary-100'
        }`}>
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            {isActive ? 'Xác nhận cấm người dùng' : 'Xác nhận mở cấm người dùng'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-primary-500 text-3xl font-light cursor-pointer"
          >
            &times;
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 overflow-y-auto bg-gray-50 space-y-5">
          <div className="text-gray-700 text-base">
            {isActive ? (
              <>
                Bạn có chắc chắn muốn <span className="font-semibold text-red-600">cấm</span> người dùng{' '}
                <span className="font-semibold">{userName}</span> không?
              </>
            ) : (
              <>
                Bạn có chắc chắn muốn <span className="font-semibold text-green-600">mở cấm</span> người dùng{' '}
                <span className="font-semibold">{userName}</span> không?
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-5 border-t border-gray-100 bg-gray-50">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium transition cursor-pointer"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className={`px-5 py-2 rounded-lg font-medium text-white cursor-pointer shadow-md transition-all duration-200 ${
              isActive 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-green-500 hover:bg-green-600'
            }`}
          >
            {isActive ? 'Xác nhận cấm' : 'Xác nhận mở cấm'}
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

export default UserBan;
