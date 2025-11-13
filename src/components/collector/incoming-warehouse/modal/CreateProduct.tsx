/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, ScanLine, Plus, Upload, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

interface CreateProductProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (productData: {
        senderId: string;
        description: string;
        images: string[];
        parentCategoryId: string;
        subCategoryId: string;
        brandId: string;
        qrCode: string;
        point: number;
    }) => void;
}

const CreateProduct: React.FC<CreateProductProps> = ({
    open,
    onClose,
    onConfirm
}) => {
    const [senderId, setSenderId] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [parentCategoryId, setParentCategoryId] = useState('');
    const [subCategoryId, setSubCategoryId] = useState('');
    const [brandId, setBrandId] = useState('');
    const [qrCode, setQrCode] = useState('');
    const [point, setPoint] = useState(0);
    
    const senderInputRef = useRef<HTMLInputElement>(null);
    const qrInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (open) {
            // Auto focus on sender QR input when modal opens
            setTimeout(() => senderInputRef.current?.focus(), 100);
        }
    }, [open]);

    // Auto focus lại sau khi quét sender ID
    useEffect(() => {
        if (senderId && qrInputRef.current) {
            qrInputRef.current.focus();
        }
    }, [senderId]);

    const handleScanSender = (e: React.FormEvent) => {
        e.preventDefault();
        const scannedSenderId = senderId.trim();
        
        if (!scannedSenderId) {
            toast.warning('Vui lòng quét mã QR người gửi');
            return;
        }

        toast.success('Đã quét mã người gửi');
        // Auto focus to product QR input
        setTimeout(() => qrInputRef.current?.focus(), 100);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        // Convert files to base64 or URLs
        Array.from(files).forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImages((prev) => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const handleRemoveImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        // Validation
        if (!senderId.trim()) {
            toast.warning('Vui lòng quét mã người gửi');
            senderInputRef.current?.focus();
            return;
        }

        if (!qrCode.trim()) {
            toast.warning('Vui lòng nhập mã QR sản phẩm');
            qrInputRef.current?.focus();
            return;
        }

        if (!parentCategoryId.trim()) {
            toast.warning('Vui lòng nhập danh mục cha');
            return;
        }

        if (!subCategoryId.trim()) {
            toast.warning('Vui lòng nhập danh mục con');
            return;
        }

        if (!brandId.trim()) {
            toast.warning('Vui lòng nhập thương hiệu');
            return;
        }

        if (images.length === 0) {
            toast.warning('Vui lòng thêm ít nhất một ảnh sản phẩm');
            return;
        }

        onConfirm({
            senderId: senderId.trim(),
            description: description.trim(),
            images,
            parentCategoryId: parentCategoryId.trim(),
            subCategoryId: subCategoryId.trim(),
            brandId: brandId.trim(),
            qrCode: qrCode.trim(),
            point
        });
        
        handleClose();
    };

    const handleClose = () => {
        setSenderId('');
        setDescription('');
        setImages([]);
        setParentCategoryId('');
        setSubCategoryId('');
        setBrandId('');
        setQrCode('');
        setPoint(0);
        onClose();
    };

    if (!open) return null;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
            {/* Overlay */}
            <div
                className='absolute inset-0 bg-black/30 backdrop-blur-sm'
                onClick={handleClose}
            ></div>

            {/* Modal container */}
            <div className='relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[90vh] animate-fadeIn'>
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b border-gray-100 bg-linear-to-r from-blue-50 to-blue-100'>
                    <div className='flex items-center gap-3'>
                        <div>
                            <h2 className='text-2xl font-bold text-gray-900'>Tạo Sản Phẩm Mới</h2>
                            <p className='text-sm text-gray-500 mt-1'>Nhận hàng từ người gửi tại kho</p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className='text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer transition'
                    >
                        <X size={28} />
                    </button>
                </div>

                {/* Body */}
                <div className='flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50'>
                    {/* Sender QR Scanner */}
                    <div className='bg-white rounded-xl p-4 shadow-sm border border-blue-100'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Mã Người Gửi <span className='text-red-500'>*</span>
                        </label>
                        <form onSubmit={handleScanSender} className='flex gap-2'>
                            <div className='relative flex-1'>
                                <input
                                    ref={senderInputRef}
                                    type='text'
                                    value={senderId}
                                    onChange={(e) => setSenderId(e.target.value)}
                                    placeholder='Quét mã QR người gửi...'
                                    className='w-full pl-10 pr-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 disabled:bg-gray-100'
                                    autoComplete='off'
                                />
                                <ScanLine
                                    className='absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400'
                                    size={18}
                                />
                            </div>
                            <button
                                type='submit'
                                className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2 cursor-pointer'
                            >
                                <Plus size={18} />
                                Quét
                            </button>
                        </form>
                    </div>

                    {/* Product QR Code */}
                    <div className='bg-white rounded-xl p-4 shadow-sm border border-gray-100'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Mã QR Sản Phẩm <span className='text-red-500'>*</span>
                        </label>
                        <div className='relative'>
                            <input
                                ref={qrInputRef}
                                type='text'
                                value={qrCode}
                                onChange={(e) => setQrCode(e.target.value)}
                                placeholder='Quét hoặc nhập mã QR sản phẩm...'
                                className='w-full pl-10 pr-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 disabled:bg-gray-100'
                                autoComplete='off'
                            />
                            <ScanLine
                                className='absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400'
                                size={18}
                            />
                        </div>
                    </div>

                    {/* Category & Brand Info */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div className='bg-white rounded-xl p-4 shadow-sm border border-gray-100'>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Danh Mục Cha <span className='text-red-500'>*</span>
                            </label>
                            <input
                                type='text'
                                value={parentCategoryId}
                                onChange={(e) => setParentCategoryId(e.target.value)}
                                placeholder='Nhập ID danh mục cha...'
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900'
                            />
                        </div>

                        <div className='bg-white rounded-xl p-4 shadow-sm border border-gray-100'>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Danh Mục Con <span className='text-red-500'>*</span>
                            </label>
                            <input
                                type='text'
                                value={subCategoryId}
                                onChange={(e) => setSubCategoryId(e.target.value)}
                                placeholder='Nhập ID danh mục con...'
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900'
                            />
                        </div>

                        <div className='bg-white rounded-xl p-4 shadow-sm border border-gray-100'>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Thương Hiệu <span className='text-red-500'>*</span>
                            </label>
                            <input
                                type='text'
                                value={brandId}
                                onChange={(e) => setBrandId(e.target.value)}
                                placeholder='Nhập ID thương hiệu...'
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900'
                            />
                        </div>

                        <div className='bg-white rounded-xl p-4 shadow-sm border border-gray-100'>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Điểm
                            </label>
                            <input
                                type='number'
                                value={point}
                                onChange={(e) => setPoint(parseInt(e.target.value) || 0)}
                                placeholder='Nhập điểm...'
                                className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900'
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div className='bg-white rounded-xl p-4 shadow-sm border border-gray-100'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Mô Tả
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder='Nhập mô tả sản phẩm...'
                            rows={3}
                            className='w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 resize-none'
                        />
                    </div>

                    {/* Image Upload */}
                    <div className='bg-white rounded-xl p-4 shadow-sm border border-gray-100'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Hình Ảnh Sản Phẩm <span className='text-red-500'>*</span>
                        </label>
                        
                        <div className='flex gap-4 items-start'>
                            <label className='cursor-pointer flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition'>
                                <Upload className='text-gray-400' size={32} />
                                <span className='text-xs text-gray-500 mt-2'>Thêm ảnh</span>
                                <input
                                    type='file'
                                    accept='image/*'
                                    multiple
                                    onChange={handleImageUpload}
                                    className='hidden'
                                />
                            </label>

                            <div className='flex-1 grid grid-cols-4 gap-3'>
                                {images.map((img, index) => (
                                    <div key={index} className='relative group'>
                                        <img
                                            src={img}
                                            alt={`Product ${index + 1}`}
                                            className='w-full h-32 object-cover rounded-lg border border-gray-200'
                                        />
                                        <button
                                            onClick={() => handleRemoveImage(index)}
                                            className='absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition cursor-pointer'
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className='flex justify-between items-center gap-3 p-5 border-t border-gray-100 bg-white'>
                    <div className='text-sm text-gray-600'>
                        <span className='font-semibold'>{images.length}</span> ảnh đã thêm
                    </div>
                    <div className='flex gap-3'>
                        <button
                            onClick={handleClose}
                            className='px-5 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 font-medium transition cursor-pointer'
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleSubmit}
                            className='px-5 py-2 rounded-lg font-medium text-white cursor-pointer shadow-md transition-all duration-200 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2'
                        >
                            Tạo Sản Phẩm
                        </button>
                    </div>
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

export default CreateProduct;
