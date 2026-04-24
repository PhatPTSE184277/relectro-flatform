/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useContext, useEffect, useRef, useState } from 'react';
import { X, Upload, Trash2, Loader2, Camera, Edit3 } from 'lucide-react';
import type { Product } from '@/types/Product';
import Toast from '@/components/ui/Toast';
import CustomSelect from '@/components/ui/CustomSelect';
import SearchableSelect from '@/components/ui/SearchableSelect';
import CategoryContext from '@/contexts/collection-point/CategoryContext';
import { getBrandsBySubCategory, type Brand } from '@/services/collection-point/BrandService';
import { getParentCategories, getSubCategories, type Category } from '@/services/collection-point/CategoryService';
import { updateProductInfo } from '@/services/collection-point/IWProductService';
import { uploadToCloudinary } from '@/utils/Cloudinary';

interface EditProductModalProps {
    open: boolean;
    product: Product | null;
    loading: boolean;
    onClose: () => void;
    onSaved: (productId: string) => Promise<void> | void;
}

const EditProductModal: React.FC<EditProductModalProps> = ({
    open,
    product,
    loading,
    onClose,
    onSaved
}) => {
    const categoryCtx = useContext(CategoryContext);
    const [editParentCategoryId, setEditParentCategoryId] = useState('');
    const [editSubCategoryId, setEditSubCategoryId] = useState('');
    const [editBrandId, setEditBrandId] = useState('');
    const [localParentCategories, setLocalParentCategories] = useState<Category[]>([]);
    const [localSubCategories, setLocalSubCategories] = useState<Category[]>([]);
    const [localCategoryLoading, setLocalCategoryLoading] = useState(false);
    const [brands, setBrands] = useState<Brand[]>([]);
    const [brandLoading, setBrandLoading] = useState(false);
    const [images, setImages] = useState<string[]>([]);
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [saving, setSaving] = useState(false);
    const [resolvingCategory, setResolvingCategory] = useState(false);
    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('error');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const parentCategories = categoryCtx?.parentCategories ?? localParentCategories;
    const subCategories = categoryCtx?.subCategories ?? localSubCategories;
    const categoryLoading = categoryCtx?.loading ?? localCategoryLoading;

    const selectParentCategory = async (parentId: string | null) => {
        if (categoryCtx) {
            categoryCtx.setSelectedParentId(parentId);
            return;
        }

        if (!parentId) {
            setLocalSubCategories([]);
            return;
        }

        setLocalCategoryLoading(true);
        try {
            const data = await getSubCategories(parentId);
            setLocalSubCategories(data || []);
        } catch {
            setLocalSubCategories([]);
        } finally {
            setLocalCategoryLoading(false);
        }
    };

    const normalizeText = (value?: string | null) => (value || '').trim().toLowerCase();

    useEffect(() => {
        if (categoryCtx) return;

        let mounted = true;
        const loadParents = async () => {
            setLocalCategoryLoading(true);
            try {
                const data = await getParentCategories();
                if (mounted) setLocalParentCategories(data || []);
            } catch {
                if (mounted) setLocalParentCategories([]);
            } finally {
                if (mounted) setLocalCategoryLoading(false);
            }
        };

        void loadParents();
        return () => {
            mounted = false;
        };
    }, [categoryCtx]);

    useEffect(() => {
        if (!open || !product) return;
        setEditParentCategoryId('');
        setEditSubCategoryId('');
        setEditBrandId('');
        setImages(product.productImages ?? []);
        setImageFiles([]);
    }, [open, product]);

    useEffect(() => {
        let mounted = true;

        const resolveParentCategory = async () => {
            if (!open || !product || parentCategories.length === 0) return;
            setResolvingCategory(true);

            try {
                let matchedParentId = '';
                let matchedSubCategoryId = '';
                const productCategoryId = product.categoryId || '';
                const productCategoryName = normalizeText(product.categoryName);

                // Some API responses may return parent category id in `categoryId`,
                // so keep a direct parent fallback and still try to resolve subcategory by name.
                const directParent = parentCategories.find((parent) => parent.id === productCategoryId);
                if (directParent) {
                    matchedParentId = directParent.id;
                }

                for (const parent of parentCategories) {
                    const children = await getSubCategories(parent.id);

                    const exactChild = children.find((child) => child.id === productCategoryId);
                    if (exactChild) {
                        matchedParentId = parent.id;
                        matchedSubCategoryId = exactChild.id;
                        break;
                    }

                    if (!matchedSubCategoryId && productCategoryName) {
                        const nameMatchedChild = children.find(
                            (child) => normalizeText(child.name) === productCategoryName
                        );
                        if (nameMatchedChild) {
                            matchedParentId = parent.id;
                            matchedSubCategoryId = nameMatchedChild.id;
                            break;
                        }
                    }

                    if (matchedParentId && !matchedSubCategoryId && productCategoryName) {
                        const fallbackByName = children.find(
                            (child) => normalizeText(child.name) === productCategoryName
                        );
                        if (fallbackByName) {
                            matchedSubCategoryId = fallbackByName.id;
                            break;
                        }
                    }
                }

                if (!mounted) return;

                if (matchedParentId) {
                    setEditParentCategoryId(matchedParentId);
                    await selectParentCategory(matchedParentId);
                    setEditSubCategoryId(matchedSubCategoryId || productCategoryId || '');
                } else {
                    setEditParentCategoryId('');
                    await selectParentCategory(null);
                }
            } catch {
                if (!mounted) return;
                setEditParentCategoryId('');
                await selectParentCategory(null);
            } finally {
                if (mounted) setResolvingCategory(false);
            }
        };

        void resolveParentCategory();

        return () => {
            mounted = false;
        };
    }, [open, product, parentCategories]);

    useEffect(() => {
        let mounted = true;
        const run = async () => {
            if (!editSubCategoryId) {
                setBrands([]);
                return;
            }
            setBrandLoading(true);
            try {
                const data = await getBrandsBySubCategory(editSubCategoryId);
                if (!mounted) return;

                const nextBrands = data || [];
                setBrands(nextBrands);

                const initialBrandId = product?.brandId || '';
                const initialBrandName = (product?.brandName || '').trim().toLowerCase();

                setEditBrandId((currentBrandId) => {
                    if (currentBrandId && nextBrands.some((b) => b.brandId === currentBrandId)) {
                        return currentBrandId;
                    }

                    const matchedById = nextBrands.find((b) => b.brandId === initialBrandId);
                    if (matchedById) return matchedById.brandId;

                    const matchedByName = nextBrands.find(
                        (b) => b.name.trim().toLowerCase() === initialBrandName
                    );
                    if (matchedByName) return matchedByName.brandId;

                    return currentBrandId;
                });
            } finally {
                if (mounted) setBrandLoading(false);
            }
        };
        void run();
        return () => {
            mounted = false;
        };
    }, [editSubCategoryId, product?.brandId, product?.brandName, product?.categoryId]);

    const showToast = (message: string, type: 'success' | 'error' = 'error') => {
        setToastMessage(message);
        setToastType(type);
        setToastOpen(true);
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;
        if (images.length + files.length > 5) {
            showToast('Tối đa 5 ảnh', 'error');
            return;
        }
        const validFiles: File[] = [];
        const previews: string[] = [];
        files.forEach((file) => {
            if (file.size > 10 * 1024 * 1024) return;
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
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSave = async () => {
        if (!product) return;
        if (!editSubCategoryId || !editBrandId) {
            showToast('Vui lòng chọn danh mục nhỏ và thương hiệu', 'error');
            return;
        }
        setSaving(true);
        try {
            const newUrls = imageFiles.length
                ? await Promise.all(imageFiles.map((file) => uploadToCloudinary(file)))
                : [];
            const existingImages = images.filter((img) => !img.startsWith('data:'));
            await updateProductInfo(product.productId, {
                categoryId: editSubCategoryId,
                brandId: editBrandId,
                image: [...existingImages, ...newUrls]
            });
            showToast('Cập nhật sản phẩm thành công', 'success');
            await onSaved(product.productId);
            onClose();
        } catch (error: any) {
            showToast(error?.response?.data?.message || error?.message || 'Lỗi khi cập nhật sản phẩm', 'error');
        } finally {
            setSaving(false);
        }
    };

    if (!open) return null;

    return (
        <div className='fixed inset-0 z-60 flex items-center justify-center p-4'>
            <div className='absolute inset-0 bg-black/60 backdrop-blur-sm' onClick={onClose} />
            <div className='relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[92vh] flex flex-col'>
                <div className='flex justify-between items-center p-6 border-b border-gray-100 bg-linear-to-r from-primary-50 to-primary-100'>
                    <div className='flex items-center gap-3'>
                        <Edit3 className='text-primary-600' size={22} />
                        <h2 className='text-2xl font-bold text-gray-800'>Chỉnh sửa sản phẩm</h2>
                    </div>
                    <button onClick={onClose} className='text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer transition'>
                        <X size={28} />
                    </button>
                </div>

                <div className='flex-1 overflow-y-auto p-6 space-y-4 bg-white'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <div className='bg-white rounded-lg p-3 shadow-sm border border-primary-100'>
                            <div className='flex items-center gap-3'>
                                <label className='text-sm font-medium text-gray-700 whitespace-nowrap min-w-[120px]'>Danh mục lớn</label>
                                <CustomSelect
                                    options={parentCategories}
                                    value={editParentCategoryId}
                                    onChange={(val) => {
                                        setEditParentCategoryId(val);
                                        void selectParentCategory(val || null);
                                        setEditSubCategoryId('');
                                        setEditBrandId('');
                                    }}
                                    getLabel={(cat) => cat.name}
                                    getValue={(cat) => cat.id}
                                    placeholder='Chọn Danh mục lớn...'
                                    disabled={categoryLoading}
                                    className='w-full'
                                />
                            </div>
                        </div>

                        <div className='bg-white rounded-lg p-3 shadow-sm border border-primary-100'>
                            <div className='flex items-center gap-3'>
                                <label className='text-sm font-medium text-gray-700 whitespace-nowrap min-w-[120px]'>Danh mục nhỏ</label>
                                {editParentCategoryId ? (
                                    <SearchableSelect
                                        options={subCategories}
                                        value={editSubCategoryId}
                                        onChange={(val) => {
                                            setEditSubCategoryId(val);
                                            setEditBrandId('');
                                        }}
                                        getLabel={(cat) => cat.name}
                                        getValue={(cat) => cat.id}
                                        placeholder={resolvingCategory ? 'Đang đồng bộ danh mục...' : 'Chọn Danh mục nhỏ...'}
                                        disabled={categoryLoading || resolvingCategory}
                                        className='w-full'
                                    />
                                ) : (
                                    <div className='px-4 py-2 text-gray-400 bg-gray-50 rounded-lg border border-gray-200 flex-1'>
                                        Chọn Danh mục lớn trước
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className='bg-white rounded-lg p-3 shadow-sm border border-primary-100'>
                        <div className='flex items-center gap-3'>
                            <label className='text-sm font-medium text-gray-700 whitespace-nowrap min-w-[180px]'>Thương hiệu</label>
                            {editSubCategoryId ? (
                                <SearchableSelect
                                    options={brands}
                                    value={editBrandId}
                                    onChange={setEditBrandId}
                                    getLabel={(brand) => brand.name}
                                    getValue={(brand) => brand.brandId}
                                    placeholder={brandLoading ? 'Đang tải...' : 'Chọn thương hiệu...'}
                                    disabled={brandLoading}
                                    className='w-full'
                                />
                            ) : (
                                <div className='px-4 py-2 text-gray-400 bg-gray-50 rounded-lg border border-gray-200 flex-1'>
                                    Chọn Danh mục nhỏ trước
                                </div>
                            )}
                        </div>
                    </div>

                    <div className='bg-white rounded-lg p-3 shadow-sm border border-primary-100'>
                        <div className='flex items-start gap-3'>
                            <div className='min-w-[180px]'>
                                <label className='text-sm font-medium text-gray-700 whitespace-nowrap'>Hình ảnh</label>
                                <p className='text-xs text-gray-500 mt-0.5'>(Tối đa 5 ảnh)</p>
                            </div>
                            <div className='flex-1 flex flex-wrap gap-3 items-start'>
                                <label className='cursor-pointer flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-primary-300 rounded-lg hover:border-primary-400 hover:bg-primary-50 transition'>
                                    <Upload className='text-primary-400' size={32} />
                                    <span className='text-xs text-gray-500 mt-2'>Tải ảnh lên</span>
                                    <input ref={fileInputRef} type='file' accept='image/*' multiple onChange={handleImageUpload} className='hidden' />
                                </label>
                                <button type='button' className='cursor-pointer flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-green-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition'>
                                    <Camera className='text-green-400' size={32} />
                                    <span className='text-xs text-gray-500 mt-2'>Chụp ảnh</span>
                                </button>
                                {images.map((img, index) => (
                                    <div key={index} className='relative group w-32 h-32'>
                                        <img src={img} alt={`Product ${index + 1}`} className='w-full h-full object-cover rounded-lg border border-primary-200' />
                                        <button type='button' onClick={() => handleRemoveImage(index)} className='absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition cursor-pointer'>
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className='flex justify-between items-center gap-3 p-5 border-t border-primary-100 bg-white'>
                    <div className='text-sm text-gray-600'><span className='font-semibold'>{images.length}</span> ảnh đã thêm</div>
                    <button onClick={handleSave} disabled={saving || loading || !product} className='px-5 py-2 rounded-lg font-medium text-white cursor-pointer shadow-md transition-all duration-200 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2'>
                        {saving ? <Loader2 className='animate-spin' size={16} /> : null}
                        Lưu thay đổi
                    </button>
                </div>
            </div>
            <Toast open={toastOpen} type={toastType} message={toastMessage} onClose={() => setToastOpen(false)} />
        </div>
    );
};

export default EditProductModal;
