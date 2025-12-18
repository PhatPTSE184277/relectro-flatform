import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { toast } from 'react-toastify';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';

interface FirstLoginChangePasswordModalProps {
    open: boolean;
    onConfirm: (oldPassword: string, newPassword: string, confirmPassword: string) => Promise<void>;
}

const FirstLoginChangePasswordModal: React.FC<FirstLoginChangePasswordModalProps> = ({ open, onConfirm }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            toast.error('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        if (newPassword.length < 6) {
            toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error('Mật khẩu xác nhận không khớp');
            return;
        }

        if (oldPassword === newPassword) {
            toast.error('Mật khẩu mới không được trùng với mật khẩu cũ');
            return;
        }

        setLoading(true);
        try {
            await onConfirm(oldPassword, newPassword, confirmPassword);
            toast.success('Đổi mật khẩu thành công');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Không thể đổi mật khẩu');
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
            <div 
                className='bg-white rounded-2xl shadow-2xl max-w-md w-full'
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className='p-6 border-b border-gray-200'>
                    <h2 className='text-2xl font-bold text-gray-900'>Đổi mật khẩu bắt buộc</h2>
                    <p className='text-sm text-gray-600 mt-2'>
                        Đây là lần đăng nhập đầu tiên. Vui lòng đổi mật khẩu để tiếp tục.
                    </p>
                </div>

                {/* Body */}
                <div className='p-6 space-y-4'>
                    <div>
                        <label htmlFor='oldPassword' className='block text-sm font-medium text-gray-700 mb-2'>
                            Mật khẩu hiện tại
                        </label>
                        <div className='relative'>
                            <Lock className='absolute top-1/2 left-3 transform -translate-y-1/2 text-primary-400' size={18} />
                            <input
                                id='oldPassword'
                                type={showOldPassword ? 'text' : 'password'}
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                placeholder='Nhập mật khẩu hiện tại'
                                className='w-full pl-10 pr-10 py-2 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-400'
                            />
                            <button
                                type='button'
                                onClick={() => setShowOldPassword(!showOldPassword)}
                                className='absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-primary-500 transition cursor-pointer'
                            >
                                {showOldPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label htmlFor='newPassword' className='block text-sm font-medium text-gray-700 mb-2'>
                            Mật khẩu mới
                        </label>
                        <div className='relative'>
                            <Lock className='absolute top-1/2 left-3 transform -translate-y-1/2 text-primary-400' size={18} />
                            <input
                                id='newPassword'
                                type={showNewPassword ? 'text' : 'password'}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder='Nhập mật khẩu mới'
                                className='w-full pl-10 pr-10 py-2 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-400'
                            />
                            <button
                                type='button'
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className='absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-primary-500 transition cursor-pointer'
                            >
                                {showNewPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label htmlFor='confirmPassword' className='block text-sm font-medium text-gray-700 mb-2'>
                            Xác nhận mật khẩu mới
                        </label>
                        <div className='relative'>
                            <Lock className='absolute top-1/2 left-3 transform -translate-y-1/2 text-primary-400' size={18} />
                            <input
                                id='confirmPassword'
                                type={showConfirmPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder='Xác nhận mật khẩu mới'
                                className='w-full pl-10 pr-10 py-2 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-400'
                            />
                            <button
                                type='button'
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className='absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-primary-500 transition cursor-pointer'
                            >
                                {showConfirmPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className='w-full bg-primary-600 text-white font-semibold py-2 rounded-lg hover:bg-primary-700 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        {loading ? 'Đang đổi mật khẩu...' : 'Đổi mật khẩu'}
                    </button>

                    <p className='text-xs text-gray-500 text-center'>
                        Mật khẩu mới phải có ít nhất 6 ký tự
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FirstLoginChangePasswordModal;
