import React from 'react';

interface ConfirmCloseModalProps {
    open: boolean;
    count: number;
    isAlreadyUsed: boolean;
    onConfirm: () => void;
    onClose: () => void;
}

const ConfirmCloseModal: React.FC<ConfirmCloseModalProps> = ({
    open,
    count,
    isAlreadyUsed,
    onConfirm,
    onClose
}) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 animate-fadeIn">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-linear-to-r from-primary-50 to-primary-100">
                    <h2 className="text-2xl font-bold text-gray-900">Xác nhận đóng</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer"
                        aria-label="Đóng"
                    >
                        &times;
                    </button>
                </div>

                <div className="p-6 flex-1 overflow-y-auto bg-gray-50 text-sm text-gray-700 space-y-2">
                    {!isAlreadyUsed ? (
                        <p>
                            Có <span className="font-bold text-primary-600">{count}</span> kiện hàng chưa xác nhận giao.<br/>
                            Bạn có chắc chắn muốn đóng màn hình này không?
                        </p>
                    ) : (
                        <p>
                            Mã QR này chỉ được sử dụng một lần để xác nhận giao hàng.<br/>
                            Bạn không thể dùng mã này được nữa.
                        </p>
                    )}
                </div>

                <div className="flex justify-end gap-3 p-5 border-t border-gray-100 bg-gray-50">
                    <button
                        onClick={onConfirm}
                        className="px-5 py-2 rounded-lg font-medium text-white bg-primary-700 hover:bg-primary-800 transition cursor-pointer"
                    >
                        Xác nhận
                    </button>
                </div>

                <style jsx>{`
                    @keyframes fadeIn {
                        from { opacity: 0; transform: scale(0.96) translateY(10px); }
                        to { opacity: 1; transform: scale(1) translateY(0); }
                    }
                    .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
                `}</style>
            </div>
        </div>
    );
};

export default ConfirmCloseModal;
