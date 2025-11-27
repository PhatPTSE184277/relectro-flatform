/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
    getBrandsBySubCategory,
    Brand
} from '@/services/small-collector/BrandService';
import { X, ScanLine, Upload, Trash2, User } from 'lucide-react';
import { toast } from 'react-toastify';
import { useCategoryContext } from '@/contexts/small-collector/CategoryContext';
import { useUserContext } from '@/contexts/UserContext';
import CustomSelect from '@/components/ui/CustomSelect';
import { uploadToCloudinary } from '@/utils/Cloudinary';
import SearchableSelect from '@/components/ui/SearchableSelect';
import CustomNumberInput from '@/components/ui/CustomNumberInput';
import type { CreateProductPayload } from '@/types/Product';

interface CreateProductProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (productData: CreateProductPayload) => void;
}

const CreateProduct: React.FC<CreateProductProps> = ({
    open,
    onClose,
    onConfirm
}) => {
    const [phone, setPhone] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const [parentCategoryId, setParentCategoryId] = useState('');
    const [subCategoryId, setSubCategoryId] = useState('');
    const [brandId, setBrandId] = useState('');
    const [brands, setBrands] = useState<Brand[]>([]);
    const [brandLoading, setBrandLoading] = useState(false);
    const [qrCode, setQrCode] = useState('');
    const [point, setPoint] = useState(0);

    const phoneInputRef = useRef<HTMLInputElement>(null);
    const qrInputRef = useRef<HTMLInputElement>(null);

    // Category context
    const {
        parentCategories,
        subCategories,
        setSelectedParentId,
        loading: categoryLoading
    } = useCategoryContext();

    // User context
    const { user, fetchUserByPhone, setUser } = useUserContext();

    const playStoreUrl = process.env.NEXT_PUBLIC_PLAY_STORE_URL;
    const appStoreUrl = process.env.NEXT_PUBLIC_APP_STORE_URL;

    useEffect(() => {
        if (open) {
            setUser(null);
            setTimeout(() => phoneInputRef.current?.focus(), 100);
        }
    }, [open, setUser]);

    useEffect(() => {
        if (user && qrInputRef.current) {
            qrInputRef.current.focus();
        }
    }, [user]);

    const handleSearchUser = async (e: React.FormEvent) => {
        e.preventDefault();
        const phoneNumber = phone.trim();

        if (!phoneNumber) {
            toast.warning('Vui lòng nhập số điện thoại');
            return;
        }

        await fetchUserByPhone(phoneNumber);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        // Validate số lượng ảnh
        if (images.length + files.length > 5) {
            toast.warning('Tối đa 5 ảnh/video cho sản phẩm!');
            return;
        }

        const validFiles: File[] = [];
        const previews: string[] = [];

        Array.from(files).forEach((file) => {
            // Validate dung lượng từng file
            if (file.size > 10 * 1024 * 1024) {
                toast.warning(`File ${file.name} quá lớn! Tối đa 10MB.`);
                return;
            }

            validFiles.push(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                previews.push(reader.result as string);
                if (previews.length === validFiles.length) {
                    setImages((prev) => [...prev, ...previews]);
                    setImageFiles((prev) => [...prev, ...validFiles]);
                }
            };
            reader.readAsDataURL(file);
        });
    };

    const handleRemoveImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
        setImageFiles((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!user) {
            toast.warning('Vui lòng tìm người gửi trước');
            phoneInputRef.current?.focus();
            return;
        }

        if (!(qrCode || '').trim()) {
            toast.warning('Vui lòng nhập mã QR sản phẩm');
            qrInputRef.current?.focus();
            return;
        }

        if (!(parentCategoryId || '').trim()) {
            toast.warning('Vui lòng chọn danh mục cha');
            return;
        }

        if (!(subCategoryId || '').trim()) {
            toast.warning('Vui lòng chọn danh mục con');
            return;
        }

        if (!(brandId || '').trim()) {
            toast.warning('Vui lòng chọn thương hiệu');
            return;
        }

        if (imageFiles.length === 0) {
            toast.warning('Vui lòng thêm ít nhất một ảnh sản phẩm');
            return;
        }

        if (imageFiles.length > 5) {
            toast.warning('Tối đa 5 ảnh/video cho sản phẩm!');
            return;
        }

        setUploading(true);
        try {
            // Upload all images to Cloudinary
            const uploadPromises = imageFiles.map((file) =>
                uploadToCloudinary(file)
            );
            const uploadedUrls = await Promise.all(uploadPromises);

            onConfirm({
                senderId: user.userId,
                description: (description || '').trim(),
                smallCollectionPointId: 1,
                images: uploadedUrls,
                parentCategoryId: (parentCategoryId || '').trim(),
                subCategoryId: (subCategoryId || '').trim(),
                brandId: (brandId || '').trim(),
                qrCode: (qrCode || '').trim(),
                point
            });

            handleClose();
        } catch (error) {
            toast.error('Lỗi khi upload ảnh lên Cloudinary');
            console.error('Upload error:', error);
        } finally {
            setUploading(false);
        }
    };

    const handleClose = () => {
        setPhone('');
        setUser(null);
        setDescription('');
        setImages([]);
        setImageFiles([]);
        setParentCategoryId('');
        setSubCategoryId('');
        setBrandId('');
        setQrCode('');
        setPoint(0);
        onClose();
    };

    useEffect(() => {
        if (parentCategoryId) {
            setSelectedParentId(parentCategoryId);
        }
    }, [parentCategoryId, setSelectedParentId]);

    useEffect(() => {
        let isMounted = true;
        const fetchBrands = async () => {
            if (subCategoryId) {
                setBrandLoading(true);
                try {
                    const data = await getBrandsBySubCategory(subCategoryId);
                    if (isMounted) setBrands(data);
                } catch {
                    if (isMounted) setBrands([]);
                } finally {
                    if (isMounted) setBrandLoading(false);
                }
                setBrandId('');
            } else {
                setBrands([]);
                setBrandId('');
            }
        };
        fetchBrands();
        return () => {
            isMounted = false;
        };
    }, [subCategoryId]);

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
                            <h2 className='text-2xl font-bold text-gray-900'>
                                Tạo Sản Phẩm Mới
                            </h2>
                            <p className='text-sm text-gray-500 mt-1'>
                                Nhận hàng từ người gửi tại kho
                            </p>
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
                    {/* Phone Search */}
                    <div className='bg-white rounded-xl p-4 shadow-sm border border-blue-100'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Số Điện Thoại Người Gửi{' '}
                            <span className='text-red-500'>*</span>
                        </label>
                        <form
                            onSubmit={handleSearchUser}
                            className='flex gap-2'
                        >
                            <div className='relative flex-1'>
                                <input
                                    ref={phoneInputRef}
                                    type='text'
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    placeholder='Nhập số điện thoại...'
                                    className='w-full pl-10 pr-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400 disabled:bg-gray-100'
                                    autoComplete='off'
                                />
                                <User
                                    className='absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400'
                                    size={18}
                                />
                            </div>
                            <button
                                type='submit'
                                className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2 cursor-pointer'
                            >
                                <ScanLine size={18} />
                                Tìm
                            </button>
                        </form>
                        {user && (
                            <div className='mt-3 p-3 bg-green-50 border border-green-200 rounded-lg'>
                                <div className='flex items-center gap-2 mb-2'>
                                    <div className='w-8 h-8 rounded-full bg-green-500 flex items-center justify-center'>
                                        <User
                                            className='text-white'
                                            size={16}
                                        />
                                    </div>
                                    <span className='font-semibold text-green-900'>
                                        {user.name}
                                    </span>
                                </div>
                                <div className='text-sm text-green-700 space-y-1'>
                                    {user.email && (
                                        <p>
                                            <span className='font-medium'>
                                                Email:
                                            </span>{' '}
                                            {user.email}
                                        </p>
                                    )}
                                    {user.address && (
                                        <p>
                                            <span className='font-medium'>
                                                Địa chỉ:
                                            </span>{' '}
                                            {user.address}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                        {!user && phone.trim() && (
                            <div className='mt-4 flex flex-col items-center gap-2'>
                                <div className='text-sm text-gray-600 mb-2'>
                                    Không tìm thấy người gửi? Tải app để đăng ký tài khoản:
                                </div>
                                <div className='flex gap-6'>
                                    <div className='flex flex-col items-center'>
                                        <img
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${playStoreUrl}`}
                                            alt='QR tải app CH Play'
                                            className='w-20 h-20 rounded border border-gray-200 bg-white mb-1'
                                        />
                                        <span className='text-xs text-gray-500'>Tải trên CH Play</span>
                                    </div>
                                    <div className='flex flex-col items-center'>
                                        <img
                                            src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${appStoreUrl}`}
                                            alt='QR tải app App Store'
                                            className='w-20 h-20 rounded border border-gray-200 bg-white mb-1'
                                        />
                                        <span className='text-xs text-gray-500'>Tải trên App Store</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Product QR Code */}
                    <div className='bg-white rounded-xl p-4 shadow-sm border border-gray-100'>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Mã QR Sản Phẩm{' '}
                            <span className='text-red-500'>*</span>
                        </label>
                        <div className='flex gap-2 items-center'>
                            <div className='relative flex-1'>
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
                            <button
                                type='button'
                                className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center gap-2 cursor-pointer'
                                onClick={() => {
                                    /* Mở modal quét QR ở đây */
                                }}
                            >
                                <ScanLine size={18} />
                                Quét
                            </button>
                        </div>
                    </div>

                    {/* Category & Brand Info */}
                    <div className='space-y-4'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            {/* Danh Mục Cha */}
                            <div className='bg-white rounded-xl p-4 shadow-sm border border-gray-100'>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    Danh Mục Cha{' '}
                                    <span className='text-red-500'>*</span>
                                </label>
                                <CustomSelect
                                    options={parentCategories}
                                    value={parentCategoryId}
                                    onChange={(val) => {
                                        setParentCategoryId(val);
                                        setSubCategoryId('');
                                    }}
                                    getLabel={(cat) => cat.name}
                                    getValue={(cat) => cat.id}
                                    placeholder='Chọn danh mục cha...'
                                    disabled={categoryLoading}
                                />
                            </div>

                            {/* Danh Mục Con */}
                            <div className='bg-white rounded-xl p-4 shadow-sm border border-gray-100'>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    Danh Mục Con{' '}
                                    <span className='text-red-500'>*</span>
                                </label>
                                {parentCategoryId ? (
                                    <SearchableSelect
                                        options={subCategories}
                                        value={subCategoryId}
                                        onChange={setSubCategoryId}
                                        getLabel={(cat) => cat.name}
                                        getValue={(cat) => cat.id}
                                        placeholder='Chọn danh mục con...'
                                        disabled={categoryLoading}
                                    />
                                ) : (
                                    <div className='px-4 py-2 text-gray-400 bg-gray-50 rounded-lg border border-gray-200'>
                                        Chọn danh mục cha trước
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            <div className='bg-white rounded-xl p-4 shadow-sm border border-gray-100'>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    Thương Hiệu{' '}
                                    <span className='text-red-500'>*</span>
                                </label>
                                {subCategoryId ? (
                                    <CustomSelect
                                        options={brands}
                                        value={brandId}
                                        onChange={setBrandId}
                                        getLabel={(brand) => brand.name}
                                        getValue={(brand) => brand.brandId} // Đổi từ brand.id thành brand.brandId
                                        placeholder={
                                            brandLoading
                                                ? 'Đang tải...'
                                                : 'Chọn thương hiệu...'
                                        }
                                        disabled={brandLoading}
                                    />
                                ) : (
                                    <div className='px-4 py-2 text-gray-400 bg-gray-50 rounded-lg border border-gray-200'>
                                        Chọn danh mục con trước
                                    </div>
                                )}
                            </div>

                            <div className='bg-white rounded-xl p-4 shadow-sm border border-gray-100'>
                                <label className='block text-sm font-medium text-gray-700 mb-2'>
                                    Điểm
                                </label>
                                <CustomNumberInput
                                    value={point}
                                    onChange={setPoint}
                                    placeholder='Nhập điểm...'
                                    min={0}
                                    className='w-full px-4 py-2 border border-blue-300 rounded-lg text-gray-900 placeholder-gray-400 placeholder-font-medium font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                />
                            </div>
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
                            Hình ảnh / Video về sản phẩm{' '}
                            <span className='text-red-500'>*</span>
                        </label>
                        <p className='text-xs text-gray-500 mb-3'>
                            Tối đa 5 ảnh/video, mỗi file không quá 10MB
                        </p>
                        <div className='flex gap-4 items-start'>
                            <label className='cursor-pointer flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition'>
                                <Upload className='text-gray-400' size={32} />
                                <span className='text-xs text-gray-500 mt-2'>
                                    Thêm ảnh
                                </span>
                                <input
                                    type='file'
                                    accept='image/*'
                                    multiple
                                    onChange={handleImageUpload}
                                    className='hidden'
                                    disabled={uploading}
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
                                            onClick={() =>
                                                handleRemoveImage(index)
                                            }
                                            className='absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition cursor-pointer'
                                            disabled={uploading}
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
                        <span className='font-semibold'>{images.length}</span>{' '}
                        ảnh đã thêm
                    </div>
                    <div className='flex gap-3'>
                        <button
                            onClick={handleSubmit}
                            disabled={uploading}
                            className='px-5 py-2 rounded-lg font-medium text-white cursor-pointer shadow-md transition-all duration-200 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2'
                        >
                            {uploading ? (
                                <>
                                    <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                                    Đang upload...
                                </>
                            ) : (
                                'Tạo Sản Phẩm'
                            )}
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
