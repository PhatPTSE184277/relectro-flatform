    import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
    IoPersonOutline,
    IoLockClosedOutline,
    IoEyeOffOutline,
    IoEyeOutline
} from 'react-icons/io5';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { login, clearError } from '@/redux/reducers/authReducer';
import FirstLoginChangePasswordModal from './FirstLoginChangePasswordModal';
import { changePasswordFirstLogin } from '@/services/AuthService';

const LoginForm = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [showFirstLoginChangePassword, setShowFirstLoginChangePassword] = useState(false);
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { loading, error, isAuthenticated, user } = useAppSelector((state) => state.auth);

    useEffect(() => {
        if (error) {
            dispatch(clearError());
        }
    }, [error, dispatch]);

    useEffect(() => {
        if (isAuthenticated && user) {
            // Check if first login
            if (user.isFirstLogin) {
                setTimeout(() => setShowFirstLoginChangePassword(true), 0);
                return;
            }
            // Route based on user role (backend enum)
            switch (user.role) {
                case 'AdminWarehouse':
                    router.push('/small-collector/dashboard');
                    break;
                case 'Admin':
                    router.push('/admin/dashboard');
                    break;
                case 'AdminCompany':
                    router.push('/company/small-collection');
                    break;
                case 'RecyclingCompany':
                    router.push('/recycle/package');
                    break;
                default:
                    router.push('/admin/dashboard');
            }
        }
    }, [isAuthenticated, user, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.username || !formData.password) {
            return;
        }

        dispatch(login({ username: formData.username, password: formData.password }));
    };

    const handleChangePasswordFirstLogin = async (oldPassword: string, newPassword: string, confirmPassword: string) => {
        await changePasswordFirstLogin(oldPassword, newPassword, confirmPassword);
        setShowFirstLoginChangePassword(false);
        
        // Redirect based on role after password change
        if (user) {
            switch (user.role) {
                case 'AdminWarehouse':
                    router.push('/small-collector/dashboard');
                    break;
                case 'Admin':
                    router.push('/admin/dashboard');
                    break;
                case 'AdminCompany':
                    router.push('/company/dashboard');
                    break;
                case 'Shipper':
                    router.push('/shipper/package');
                    break;
                case 'RecyclingCompany':
                    router.push('/recycle/package');
                    break;
                default:
                    router.push('/');
            }
        }
    };

    return (
        <div className='bg-white rounded-2xl shadow-xl p-8 animate-slide-in-right border border-gray-100'>

            <form onSubmit={handleSubmit} className='space-y-6'>
                <div>
                    <label
                        htmlFor='username'
                        className='block text-sm font-medium text-gray-700 mb-2'
                    >
                        Tên đăng nhập
                    </label>
                    <div className='relative'>
                        <IoPersonOutline className='absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400 text-lg' />
                        <IoPersonOutline className='absolute top-1/2 left-3 transform -translate-y-1/2 text-primary-400 text-lg' />
                        <input
                            id='username'
                            name='username'
                            type='text'
                            autoComplete='username'
                            required
                            className='w-full pl-10 pr-4 py-2 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-400 disabled:bg-gray-100 transition'
                            placeholder='Nhập tên đăng nhập'
                            value={formData.username}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div>
                    <label
                        htmlFor='password'
                        className='block text-sm font-medium text-gray-700 mb-2'
                    >
                        Mật khẩu
                    </label>
                    <div className='relative'>
                        <IoLockClosedOutline className='absolute top-1/2 left-3 transform -translate-y-1/2 text-gray-400 text-lg' />
                        <IoLockClosedOutline className='absolute top-1/2 left-3 transform -translate-y-1/2 text-primary-400 text-lg' />
                        <input
                            id='password'
                            name='password'
                            type={isPasswordVisible ? 'text' : 'password'}
                            autoComplete='current-password'
                            className='w-full pl-10 pr-10 py-2 border border-primary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-400 disabled:bg-gray-100 transition'
                            placeholder='Nhập mật khẩu'
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <button
                            type='button'
                            onClick={togglePasswordVisibility}
                            className='absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-primary-500 transition-colors cursor-pointer'
                            tabIndex={-1}
                        >
                            {isPasswordVisible ? (
                                <IoEyeOffOutline />
                            ) : (
                                <IoEyeOutline />
                            )}
                        </button>
                    </div>
                </div>

                <div className='flex justify-end mb-2'>
                    <button
                        type='button'
                        onClick={() => router.push('/forgot-password')}
                        className='text-primary-600 hover:text-primary-700 font-medium transition cursor-pointer text-sm'
                    >
                        Quên mật khẩu?
                    </button>
                </div>

                <button
                    type='submit'
                    disabled={loading}
                    className={`w-full bg-linear-to-r from-primary-500 to-primary-400 text-white font-semibold py-2 rounded-lg shadow hover:from-primary-600 hover:to-primary-600 transition-all flex items-center cursor-pointer justify-center gap-2 ${
                        loading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                >
                    {loading ? (
                        <svg
                            className='animate-spin h-5 w-5 text-white'
                            xmlns='http://www.w3.org/2000/svg'
                            fill='none'
                            viewBox='0 0 24 24'
                        >
                            <circle
                                className='opacity-25'
                                cx='12'
                                cy='12'
                                r='10'
                                stroke='currentColor'
                                strokeWidth='4'
                            ></circle>
                            <path
                                className='opacity-75'
                                fill='currentColor'
                                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                            ></path>
                        </svg>
                    ) : (
                        'Đăng nhập'
                    )}
                </button>
            </form>

            <div className='mt-6 text-center'>
                <p className='text-gray-400'>
                    Chưa có tài khoản?{' '}
                    <span className='text-gray-300'>
                        Liên hệ quản lý để được tạo tài khoản
                    </span>
                </p>
            </div>

            {/* First Login Change Password Modal */}
            <FirstLoginChangePasswordModal
                open={showFirstLoginChangePassword}
                onConfirm={handleChangePasswordFirstLogin}
            />
        </div>
    );
};

export default LoginForm;
