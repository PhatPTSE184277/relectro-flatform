'use client';

import React, { useState } from 'react';
import { X, FileText } from 'lucide-react';

interface ImportExcelModalProps {
    open: boolean;
    onClose: () => void;
    onImport: (file: File) => void;
}

const ImportExcelModal: React.FC<ImportExcelModalProps> = ({ open, onClose, onImport }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const validTypes = [
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];

        if (!validTypes.includes(file.type)) {
            e.target.value = '';
            return;
        }

        setSelectedFile(file);
    };

    const handleImport = async () => {
        if (!selectedFile) {
            return;
        }
        setUploading(true);
        try {
            await onImport(selectedFile);
            setSelectedFile(null);
            onClose();
        } finally {
            setUploading(false);
        }
    };

    const handleClose = () => {
        setSelectedFile(null);
        onClose();
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            ></div>

            {/* Modal container */}
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[90vh] animate-fadeIn">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b bg-linear-to-r from-primary-50 to-primary-100">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Nhập File Excel</h2>
                        <p className="text-sm text-gray-600 mt-1">Chọn file Excel để nhập dữ liệu công ty</p>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer transition"
                    >
                        <X size={28} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white">
                    <div className="bg-white rounded-xl p-4 shadow-sm border border-primary-100 flex flex-col items-center gap-4">
                        <label className="cursor-pointer flex flex-col items-center justify-center w-40 h-40 border-2 border-dashed border-primary-300 rounded-lg hover:border-primary-400 hover:bg-primary-50 transition">
                            <FileText className="text-primary-400" size={40} />
                            <span className="text-sm text-gray-500 mt-2">Chọn file Excel</span>
                            <input
                                type="file"
                                accept=".xls,.xlsx"
                                onChange={handleFileChange}
                                className="hidden"
                                disabled={uploading}
                            />
                        </label>
                        {selectedFile && (
                            <div className="flex flex-col items-center gap-2 mt-2">
                                <span className="text-sm text-primary-700 font-medium">File đã chọn:</span>
                                <span className="text-xs text-gray-700 bg-primary-50 px-3 py-1 rounded-lg border border-primary-200">{selectedFile.name}</span>
                            </div>
                        )}
                        <p className="text-xs text-gray-400 mt-2">Chỉ hỗ trợ file .xls hoặc .xlsx, dung lượng tối đa 10MB</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end items-center gap-3 p-5 border-t border-primary-100 bg-white">
                    <button
                        onClick={handleImport}
                        disabled={uploading}
                        className="px-6 py-2 rounded-lg font-medium text-white cursor-pointer shadow-md transition-all duration-200 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                        {uploading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Đang nhập...
                            </>
                        ) : (
                            'Xác nhận'
                        )}
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

export default ImportExcelModal;