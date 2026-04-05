import React from 'react';

interface ConfirmCloseModalProps {
    open: boolean;
    deadlineUnassignedCount: number;
    onConfirm: () => void;
    onClose: () => void;
    title?: string;
    description?: string;
    confirmText?: string;
}

const ConfirmCloseModal: React.FC<ConfirmCloseModalProps> = ({
    open,
    deadlineUnassignedCount,
    onConfirm,
    onClose,
    title,
    description,
    confirmText
}) => {
    if (!open) return null;

    const modalTitle = title || 'Xác nhận đóng';
    const modalConfirmText = confirmText || 'Xác nhận';

    const modalDescriptionRaw =
        description ||
        `Hiện tại có ${deadlineUnassignedCount} sản phẩm hạn chót chưa được phân chia.\nBạn có chắc chắn muốn đóng màn hình này không?`;

    // Support both actual newlines and escaped '\n' sequences coming from callers.
    const modalDescription = String(modalDescriptionRaw).replace(/\\n/g, '\n');
    const lines = modalDescription.split('\n');

    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose}></div>

            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 animate-fadeIn">
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-linear-to-r from-red-50 to-primary-100">
                    <h2 className="text-2xl font-bold text-gray-900">{modalTitle}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer"
                        aria-label="Đóng"
                    >
                        &times;
                    </button>
                </div>

                    <div className="p-6 flex-1 overflow-y-auto bg-gray-50 text-sm text-gray-700 space-y-2">
                        {lines.map((line, idx) => (
                            <p key={idx}>{line}</p>
                        ))}
                </div>

                <div className="flex justify-end gap-3 p-5 border-t border-gray-100 bg-gray-50">
                    <button
                        onClick={onConfirm}
                        className="px-5 py-2 rounded-lg font-medium text-white bg-primary-700 hover:bg-primary-800 transition cursor-pointer"
                    >
                        {modalConfirmText}
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