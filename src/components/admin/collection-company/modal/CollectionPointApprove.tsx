import React from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';

interface CollectionPointApproveProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading?: boolean;
}

const CollectionPointApprove: React.FC<CollectionPointApproveProps> = ({ open, onClose, onConfirm, loading }) => {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

            <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 animate-fadeIn">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-linear-to-r from-green-50 to-primary-100">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <CheckCircle size={22} className="text-green-500" />
                        Xác nhận duyệt điểm thu gom
                    </h2>
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="text-gray-400 hover:text-primary-600 text-3xl font-light cursor-pointer disabled:opacity-40"
                    >
                        &times;
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 bg-gray-50">
                    <p className="text-gray-700 text-base">
                        Bạn có chắc chắn muốn <span className="font-semibold text-green-600">duyệt</span> điểm thu gom này không?
                    </p>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-5 border-t border-gray-100 bg-gray-50">
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        className="px-5 py-2 rounded-lg font-medium text-white cursor-pointer shadow-md transition-all duration-200 bg-primary-600 hover:bg-primary-700 flex items-center gap-2 disabled:opacity-40"
                    >
                        {loading ? <Loader2 size={16} className="animate-spin" /> : 'Xác nhận'}
                    </button>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: scale(0.96) translateY(10px); }
                    to   { opacity: 1; transform: scale(1) translateY(0); }
                }
                .animate-fadeIn { animation: fadeIn 0.25s ease-out; }
            `}</style>
        </div>
    );
};

export default CollectionPointApprove;
