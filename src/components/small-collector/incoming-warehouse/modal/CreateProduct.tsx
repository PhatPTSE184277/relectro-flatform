/* eslint-disable @next/next/no-img-element */
'use client';
import { isValidSystemQRCode } from '@/utils/qr';

import React, { useState, useRef, useEffect } from 'react';
import {
    getBrandsBySubCategory,
    Brand
} from '@/services/small-collector/BrandService';
import { X, ScanLine, Upload, Trash2, User } from 'lucide-react';
import { useCategoryContext } from '@/contexts/small-collector/CategoryContext';
import { useUserContext } from '@/contexts/UserContext';
import { useAuth } from '@/hooks/useAuth';
import CustomSelect from '@/components/ui/CustomSelect';
import { uploadToCloudinary } from '@/utils/Cloudinary';
import SearchableSelect from '@/components/ui/SearchableSelect';
import CustomNumberInput from '@/components/ui/CustomNumberInput';
import type { CreateProductPayload } from '@/types/Product';
import UserInfo from '@/components/ui/UserInfo';

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
    const [userInfoInput, setUserInfoInput] = useState('');
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
    const [qrError, setQrError] = useState('');
    const [point, setPoint] = useState(0);
    const [searchClicked, setSearchClicked] = useState(false);
    const [loadingUser, setLoadingUser] = useState(false);

    const userInfoInputRef = useRef<HTMLInputElement>(null);
    const qrInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    // Category context
    const {
        parentCategories,
        subCategories,
        setSelectedParentId,
        loading: categoryLoading
    } = useCategoryContext();

    // User context
    const { user, fetchUserByInformation, setUser } = useUserContext();
    const currentUser = useAuth();

    const playStoreUrl = process.env.NEXT_PUBLIC_PLAY_STORE_URL;
    const appStoreUrl = process.env.NEXT_PUBLIC_APP_STORE_URL;

    useEffect(() => {
        if (open) {
            setUser(null);
            setTimeout(() => userInfoInputRef.current?.focus(), 100);
        }
    }, [open, setUser]);

    useEffect(() => {
        if (user && qrInputRef.current) {
            qrInputRef.current.focus();
        }
    }, [user]);

    const handleSearchUser = async (e: React.FormEvent) => {
        e.preventDefault();
        const info = userInfoInput.trim();
        if (!info) {
            return;
        }
        setSearchClicked(true);
        setLoadingUser(true);
        await fetchUserByInformation(info);
        setLoadingUser(false);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        // Validate số lượng ảnh
        if (images.length + files.length > 5) {
            return;
        }

        const validFiles: File[] = [];
        const previews: string[] = [];

        Array.from(files).forEach((file) => {
            // Validate dung lượng từng file
            if (file.size > 10 * 1024 * 1024) {
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
        // Reset input file để có thể chọn lại cùng file
        if (imageInputRef.current) {
            imageInputRef.current.value = '';
        }
    };

    // Đã import isValidSystemQRCode từ utils/qr

    const handleSubmit = async () => {

        if (!user) {
            return;
        }

        const qr = (qrCode || '').trim();
        if (!qr) {
            setQrError('Vui lòng nhập mã QR sản phẩm!');
            return;
        }
        if (!isValidSystemQRCode(qr)) {
            setQrError('Chỉ được sử dụng mã QR do hệ thống tạo ra!');
            return;
        }

        if (!(parentCategoryId || '').trim()) {
            return;
        }

        if (!(subCategoryId || '').trim()) {
            return;
        }

        if (!(brandId || '').trim()) {
            return;
        }

        if (!description.trim()) {
            alert('Vui lòng nhập mô tả sản phẩm!');
            return;
        }

        if (imageFiles.length === 0) {
            return;
        }

        if (imageFiles.length > 5) {
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
                smallCollectionPointId: currentUser.user?.smallCollectionPointId || "1",
                images: uploadedUrls,
                parentCategoryId: (parentCategoryId || '').trim(),
                subCategoryId: (subCategoryId || '').trim(),
                brandId: (brandId || '').trim(),
                qrCode: qr,
                point
            });

            handleClose();
        } catch (error) {
            console.error('Upload error:', error);
        } finally {
            setUploading(false);
        }
    };

    const handleClose = () => {
        setUserInfoInput('');
        setUser(null);
        setDescription('');
        setImages([]);
        setImageFiles([]);
        setParentCategoryId('');
        setSubCategoryId('');
        setBrandId('');
        setQrCode('');
        setPoint(0);
        setSearchClicked(false);
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

    // Add a state to track form validity
    const [isFormValid, setIsFormValid] = useState(false);

    // Add a useEffect to validate the form whenever dependencies change
    useEffect(() => {
        let error = '';
        const qr = qrCode.trim();
        if (qr) {
            if (!/^[0-9]{13}$/.test(qr)) {
                error = 'Mã QR phải là số gồm 13 ký tự (mã hệ thống tạo ra)!';
            } else if (!isValidSystemQRCode(qr)) {
                error = 'Chỉ được sử dụng mã QR do hệ thống tạo ra trong hôm qua hoặc hôm nay!';
            }
        }
        setQrError(error);
        const isValid = !!(
            user &&
            qr &&
            /^[0-9]{13}$/.test(qr) &&
            isValidSystemQRCode(qr) &&
            parentCategoryId.trim() &&
            subCategoryId.trim() &&
            brandId.trim() &&
            description.trim() &&
            imageFiles.length > 0 &&
            imageFiles.length <= 5
        );
        setIsFormValid(isValid);
    }, [user, qrCode, parentCategoryId, subCategoryId, brandId, description, imageFiles]);

    if (!open) return null;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
            {/* Overlay */}
            <div
                className='absolute inset-0 bg-black/30 backdrop-blur-sm'
            ></div>

            {/* Modal container */}
            <div className='relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[90vh] animate-fadeIn'>
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b bg-linear-to-r from-primary-50 to-primary-100'>
                    <div className='flex items-center gap-3'>
                        <div>
                            <h2 className='text-2xl font-bold text-gray-800'>
                                Nhận hàng từ người dùng
                            </h2>
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
                <div className='flex-1 overflow-y-auto p-6 space-y-4 bg-white'>
                    {/* User Info Search (Phone or Email) */}
                    <div className='bg-white rounded-lg p-3 shadow-sm border border-primary-100'>
                        <form
                            onSubmit={handleSearchUser}
                            className='flex items-center gap-3'
                        >
                            <label className='text-sm font-medium text-gray-700 whitespace-nowrap min-w-[180px]'>
                                Số Điện Thoại hoặc Email{' '}
                                <span className='text-red-500'>*</span>
                            </label>
                            <div className='relative flex-1'>
                                <input
                                    ref={userInfoInputRef}
                                    type='text'
                                    value={userInfoInput}
                                    onChange={(e) => setUserInfoInput(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            handleSearchUser(e);
                                        }
                                    }}
                                    placeholder='Nhập số điện thoại hoặc email...'
                                    className='w-full pl-10 pr-4 py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-400 disabled:bg-gray-100'
                                    autoComplete='off'
                                />
                                <User
                                    className='absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400'
                                    size={18}
                                />
                            </div>
                        </form>
                        {user && (
                            <div className='mt-3'>
                                <UserInfo user={user} />
                            </div>
                        )}
                        {!user && userInfoInput.trim() && searchClicked && !loadingUser && (
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
                        {loadingUser && userInfoInput.trim() && searchClicked && (
                            <div className="mt-4 w-full flex justify-center">
                                <div className="w-6 h-6 border-2 border-primary-400 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        )}
                    </div>

                    {/* Product QR Code - always show */}
                    <div className='bg-white rounded-lg p-3 shadow-sm border border-primary-100'>
                        <div className='flex items-center gap-3'>
                            <label className='text-sm font-medium text-gray-700 whitespace-nowrap min-w-[180px]'>
                                Mã QR Sản Phẩm{' '}
                                <span className='text-red-500'>*</span>
                            </label>
                            <div className='flex-1'>
                                <div className='relative'>
                                    <input
                                        ref={qrInputRef}
                                        type='text'
                                        value={qrCode}
                                        onChange={(e) => setQrCode(e.target.value)}
                                        placeholder='Quét hoặc nhập mã QR sản phẩm...'
                                        className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-400 disabled:bg-gray-100 ${qrError ? 'border-red-500' : 'border-primary-300'}`}
                                        autoComplete='off'
                                    />
                                    <ScanLine
                                        className='absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400'
                                        size={18}
                                    />
                                </div>
                                {qrError && (
                                    <div className='mt-2 text-xs text-red-600'>{qrError}</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Category & Brand Info */}
                    <div className='space-y-3'>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                            {/* Danh Mục Cha */}
                            <div className='bg-white rounded-lg p-3 shadow-sm border border-primary-100'>
                                <div className='flex items-center gap-3'>
                                    <label className='text-sm font-medium text-gray-700 whitespace-nowrap min-w-[120px]'>
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
                                    className='w-full' // Đảm bảo chiều rộng bằng với các ô khác
                                    />
                                </div>
                            </div>

                            {/* Danh Mục Con */}
                            <div className='bg-white rounded-lg p-3 shadow-sm border border-primary-100'>
                                <div className='flex items-center gap-3'>
                                    <label className='text-sm font-medium text-gray-700 whitespace-nowrap min-w-[120px]'>
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
                                        className='w-full' // Đảm bảo chiều rộng bằng các ô khác
                                    />
                                    ) : (
                                        <div className='px-4 py-2 text-gray-400 bg-gray-50 rounded-lg border border-gray-200 flex-1'>
                                            Chọn danh mục cha trước
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                            <div className='bg-white rounded-lg p-3 shadow-sm border border-gray-100'>
                                <div className='flex items-center gap-3'>
                                    <label className='text-sm font-medium text-gray-700 whitespace-nowrap min-w-[120px]'>
                                        Thương Hiệu{' '}
                                        <span className='text-red-500'>*</span>
                                    </label>
                                    {subCategoryId ? (
                                    <SearchableSelect
                                        options={brands}
                                        value={brandId}
                                        onChange={setBrandId}
                                        getLabel={(brand) => brand.name}
                                        getValue={(brand) => brand.brandId}
                                        placeholder={
                                            brandLoading
                                                ? 'Đang tải...'
                                                : 'Chọn thương hiệu...'
                                        }
                                        disabled={brandLoading}
                                        className='w-full' // Đảm bảo chiều rộng bằng các ô khác
                                    />
                                    ) : (
                                        <div className='px-4 py-2 text-gray-400 bg-gray-50 rounded-lg border border-gray-200 flex-1'>
                                            Chọn danh mục con trước
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className='bg-white rounded-lg p-3 shadow-sm border border-gray-100'>
                                <div className='flex items-center gap-3'>
                                    <label className='text-sm font-medium text-gray-700 whitespace-nowrap min-w-[120px]'>
                                        Điểm
                                    </label>
                                    <CustomNumberInput
                                    value={point}
                                    onChange={setPoint}
                                    placeholder='Nhập điểm...'
                                    min={0}
                                    className='flex-1 px-4 py-2 border border-primary-300 rounded-lg text-gray-900 placeholder-gray-400 placeholder-font-medium font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className='bg-white rounded-lg p-3 shadow-sm border border-primary-100'>
                        <div className='flex items-start gap-3 w-full'>
                            <label className='block text-sm font-medium text-gray-700 mb-2 min-w-[120px]'>
                                Mô Tả
                            </label>
                            <div className='w-full'>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder='Nhập mô tả sản phẩm...'
                                    rows={3}
                                    className='px-3 py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 resize-none w-full'
                                />
                            </div>
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div className='bg-white rounded-lg p-3 shadow-sm border border-primary-100'>
                        <div className='flex items-start gap-3'>
                            <div className='min-w-[180px]'>
                                <label className='text-sm font-medium text-gray-700 whitespace-nowrap'>
                                    Hình ảnh{' '}
                                    <span className='text-red-500'>*</span>
                                </label>
                                <p className='text-xs text-gray-500 mt-0.5'>
                                    (Tối đa 5 ảnh)
                                </p>
                            </div>
                            <div className='flex-1 flex gap-3 items-start'>
                            <label className='cursor-pointer flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-primary-300 rounded-lg hover:border-primary-400 hover:bg-primary-50 transition'>
                                <Upload className='text-primary-400' size={32} />
                                <span className='text-xs text-gray-500 mt-2'>
                                    Thêm ảnh
                                </span>
                                <input
                                    ref={imageInputRef}
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
                                            className='w-full h-32 object-cover rounded-lg border border-primary-200'
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
                            </div>                            </div>                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className='flex justify-between items-center gap-3 p-5 border-t border-primary-100 bg-white'>
                    <div className='text-sm text-gray-600'>
                        <span className='font-semibold'>{images.length}</span>{' '}
                        ảnh đã thêm
                    </div>
                    <div className='flex gap-3'>
                        <button
                            onClick={handleSubmit}
                            disabled={!isFormValid || uploading}
                            className='px-5 py-2 rounded-lg font-medium text-white cursor-pointer shadow-md transition-all duration-200 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2'
                        >
                            {uploading ? (
                                <>
                                    <div className='w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                                    Đang upload...
                                </>
                            ) : (
                                'Nhận hàng'
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
