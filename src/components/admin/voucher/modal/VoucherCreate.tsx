'use client';

/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react';
import CustomTextarea from '@/components/ui/CustomTextarea';
import CustomNumberInput from '@/components/ui/CustomNumberInput';
import CustomDatePicker from '@/components/ui/CustomDatePicker';
import { Upload, Trash2 } from 'lucide-react';
import { uploadToCloudinary } from '@/utils/Cloudinary';

interface VoucherCreateProps {
    open: boolean;
    creating?: boolean;
    onClose: () => void;
    onCreate: (payload: any) => Promise<boolean>;
}

interface VoucherFormState {
    code: string;
    name: string;
    description: string;
    startAt: string;
    endAt: string;
    value: number;
    pointsToRedeem: number;
}

const getTodayDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const toDatePayload = (dateStr: string) => {
    const date = new Date(`${dateStr}T00:00:00`);
    return {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
        dayOfWeek: date.getDay(),
    };
};

const defaultFormState: VoucherFormState = {
    code: '',
    name: '',
    description: '',
    startAt: getTodayDateString(),
    endAt: getTodayDateString(),
    value: 0,
    pointsToRedeem: 0,
};

const VoucherCreate: React.FC<VoucherCreateProps> = ({
    open,
    creating = false,
    onClose,
    onCreate,
}) => {
    const [form, setForm] = useState<VoucherFormState>(defaultFormState);
    const [error, setError] = useState<string>('');
    const [imagePreview, setImagePreview] = useState<string>('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    if (!open) return null;

    const updateField = <K extends keyof VoucherFormState>(field: K, value: VoucherFormState[K]) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const file = files[0];
        if (file.size > 10 * 1024 * 1024) {
            setError('Kích thước ảnh tối đa là 10MB');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview((reader.result as string) || '');
            setImageFile(file);
            setError('');
        };
        reader.readAsDataURL(file);

        e.target.value = '';
    };

    const handleRemoveImage = () => {
        setImagePreview('');
        setImageFile(null);
    };

    const validateForm = () => {
        if (!form.code.trim()) return 'Vui lòng nhập mã voucher';
        if (!form.name.trim()) return 'Vui lòng nhập tên voucher';
        if (!form.startAt) return 'Vui lòng chọn ngày bắt đầu';
        if (!form.endAt) return 'Vui lòng chọn ngày kết thúc';
        if (form.value <= 0) return 'Giá trị voucher phải lớn hơn 0';
        if (form.pointsToRedeem <= 0) return 'Điểm đổi phải lớn hơn 0';
        if (form.endAt < form.startAt) return 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu';
        if (!imageFile) return 'Vui lòng chọn ảnh voucher';
        return '';
    };

    const handleSubmit = async () => {
        const validation = validateForm();
        if (validation) {
            setError(validation);
            return;
        }

        setError('');
        setUploadingImage(true);
        try {
            const uploadedImageUrl = imageFile ? await uploadToCloudinary(imageFile) : '';

            const payload = {
                code: form.code.trim(),
                name: form.name.trim(),
                imageUrl: uploadedImageUrl,
                description: form.description.trim(),
                startAt: toDatePayload(form.startAt),
                endAt: toDatePayload(form.endAt),
                value: Number(form.value || 0),
                pointsToRedeem: Number(form.pointsToRedeem || 0),
            };

            const ok = await onCreate(payload);
            if (ok) {
                setForm(defaultFormState);
                setImagePreview('');
                setImageFile(null);
                setError('');
                onClose();
            }
        } catch {
            setError('Không thể tải ảnh lên. Vui lòng thử lại.');
        } finally {
            setUploadingImage(false);
        }
    };

    const handleClose = () => {
        if (creating || uploadingImage) return;
        setForm(defaultFormState);
        setImagePreview('');
        setImageFile(null);
        setError('');
        onClose();
    };

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
            <div className='absolute inset-0 bg-black/30 backdrop-blur-sm'></div>

            <div className='relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[90vh] animate-fadeIn'>
                <div className='flex justify-between items-center p-6 border-b border-gray-100 bg-linear-to-r from-primary-50 to-primary-100'>
                    <div>
                        <h2 className='text-2xl font-bold text-gray-800'>Tạo voucher</h2>
                    </div>
                    <button
                        type='button'
                        onClick={handleClose}
                        className='text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer transition'
                        aria-label='Đóng'
                    >
                        &times;
                    </button>
                </div>

                <div className='flex-1 overflow-y-auto p-6 space-y-4 bg-white'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                        <div className='bg-white rounded-lg p-3 shadow-sm border border-primary-100 flex flex-col'>
                            <div className='flex items-center gap-3 w-full'>
                                <label className='text-sm font-medium text-gray-700 whitespace-nowrap min-w-[120px]'>
                                    Mã voucher <span className='text-red-500'>*</span>
                                </label>
                                <input
                                    value={form.code}
                                    onChange={(e) => updateField('code', e.target.value)}
                                    placeholder='Nhập mã voucher...'
                                    className='w-full px-4 py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-400'
                                    disabled={creating || uploadingImage}
                                />
                            </div>
                        </div>
                        <div className='bg-white rounded-lg p-3 shadow-sm border border-primary-100 flex flex-col'>
                            <div className='flex items-center gap-3 w-full'>
                                <label className='text-sm font-medium text-gray-700 whitespace-nowrap min-w-[120px]'>
                                    Tên voucher <span className='text-red-500'>*</span>
                                </label>
                                <input
                                    value={form.name}
                                    onChange={(e) => updateField('name', e.target.value)}
                                    placeholder='Nhập tên voucher...'
                                    className='w-full px-4 py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-400'
                                    disabled={creating || uploadingImage}
                                />
                            </div>
                        </div>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                        <div className='bg-white rounded-lg p-3 shadow-sm border border-primary-100'>
                            <div className='flex items-center gap-3'>
                                <label className='text-sm font-medium text-gray-700 whitespace-nowrap min-w-[120px]'>
                                    Ngày bắt đầu <span className='text-red-500'>*</span>
                                </label>
                                <div className='flex-1'>
                                    <CustomDatePicker
                                        value={form.startAt}
                                        onChange={(value) => updateField('startAt', value)}
                                        placeholder='Chọn ngày bắt đầu'
                                        disabled={creating || uploadingImage}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className='bg-white rounded-lg p-3 shadow-sm border border-primary-100'>
                            <div className='flex items-center gap-3'>
                                <label className='text-sm font-medium text-gray-700 whitespace-nowrap min-w-[120px]'>
                                    Ngày kết thúc <span className='text-red-500'>*</span>
                                </label>
                                <div className='flex-1'>
                                    <CustomDatePicker
                                        value={form.endAt}
                                        onChange={(value) => updateField('endAt', value)}
                                        placeholder='Chọn ngày kết thúc'
                                        disabled={creating || uploadingImage}
                                        dropdownAlign='right'
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
                        <div className='bg-white rounded-lg p-3 shadow-sm border border-primary-100'>
                            <div className='flex items-center gap-3'>
                                <label className='text-sm font-medium text-gray-700 whitespace-nowrap min-w-[120px]'>
                                    Giá trị <span className='text-red-500'>*</span>
                                </label>
                                <CustomNumberInput
                                    value={form.value}
                                    onChange={(value) => updateField('value', value)}
                                    placeholder='Nhập giá trị...'
                                    min={0}
                                    className='flex-1 px-4 py-2 border border-primary-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                                />
                            </div>
                        </div>

                        <div className='bg-white rounded-lg p-3 shadow-sm border border-primary-100'>
                            <div className='flex items-center gap-3'>
                                <label className='text-sm font-medium text-gray-700 whitespace-nowrap min-w-[120px]'>
                                    Điểm đổi <span className='text-red-500'>*</span>
                                </label>
                                <CustomNumberInput
                                    value={form.pointsToRedeem}
                                    onChange={(value) => updateField('pointsToRedeem', value)}
                                    placeholder='Nhập điểm đổi...'
                                    min={0}
                                    className='flex-1 px-4 py-2 border border-primary-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                                />
                            </div>
                        </div>
                    </div>

                    <div className='bg-white rounded-lg p-3 shadow-sm border border-primary-100'>
                        <div className='flex items-start gap-3'>
                            <div className='min-w-[180px]'>
                                <label className='text-sm font-medium text-gray-700 whitespace-nowrap'>
                                    Hình ảnh <span className='text-red-500'>*</span>
                                </label>
                                <p className='text-xs text-gray-500 mt-0.5'>(Tối đa 1 ảnh)</p>
                            </div>
                            <div className='flex-1 flex flex-wrap gap-3 items-start'>
                                {!imagePreview && (
                                    <label className='cursor-pointer flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-primary-300 rounded-lg hover:border-primary-400 hover:bg-primary-50 transition'>
                                        <Upload className='text-primary-400' size={28} />
                                        <span className='text-xs text-gray-500 mt-2'>Tải ảnh lên</span>
                                        <input
                                            type='file'
                                            accept='image/*'
                                            onChange={handleImageUpload}
                                            className='hidden'
                                            disabled={creating || uploadingImage}
                                        />
                                    </label>
                                )}
                                {imagePreview && (
                                    <div className='relative group w-32 h-32'>
                                        <img
                                            src={imagePreview}
                                            alt='Ảnh voucher'
                                            className='w-full h-full object-cover rounded-lg border border-primary-200'
                                        />
                                        <button
                                            type='button'
                                            onClick={handleRemoveImage}
                                            className='absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition cursor-pointer'
                                            disabled={creating || uploadingImage}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className='bg-white rounded-lg p-3 shadow-sm border border-primary-100'>
                        <div className='flex items-start gap-3 w-full'>
                            <label className='block text-sm font-medium text-gray-700 min-w-[120px] mt-2'>
                                Mô tả
                            </label>
                            <div className='w-full'>
                                <CustomTextarea
                                    value={form.description}
                                    onChange={(value) => updateField('description', value)}
                                    rows={4}
                                    placeholder='Nhập mô tả voucher...'
                                />
                            </div>
                        </div>
                    </div>

                    {error && (
                        <p className='text-sm text-red-600 font-medium'>{error}</p>
                    )}

                </div>

                <div className='flex justify-end items-center gap-3 p-5 border-t border-primary-100 bg-white'>
                    <div className='flex gap-3'>
                        <button
                            type='button'
                            onClick={handleSubmit}
                            className='px-5 py-2 rounded-lg bg-primary-600 text-white hover:bg-primary-700 transition font-medium shadow-sm cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed'
                            disabled={creating || uploadingImage}
                        >
                            {creating || uploadingImage ? 'Đang tạo...' : 'Tạo voucher'}
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: scale(0.96) translateY(8px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
            `}</style>
        </div>
    );
};

export default VoucherCreate;
