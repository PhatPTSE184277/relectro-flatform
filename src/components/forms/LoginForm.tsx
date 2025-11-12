import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    IoPersonOutline,
    IoLockClosedOutline,
    IoEyeOffOutline,
    IoEyeOutline
} from 'react-icons/io5';
import { toast } from 'react-toastify';
import { login } from '@/services/AuthService'; // Thêm import này

const LoginForm = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.username || !formData.password) {
            toast.error('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        setLoading(true);
        try {
            const res = await login(formData.username);

            localStorage.setItem('token', res.token);

            toast.success('Đăng nhập thành công!');
            if (formData.username === 'adminthugomnho@gmail.com') {
                router.push('/collector/dashboard');
            } else {
                router.push('/admin/dashboard');
            }
        } catch (error: any) {
            toast.error(error?.message || 'Đăng nhập thất bại!');
        } finally {
            setLoading(false);
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
                        <input
                            id='username'
                            name='username'
                            type='text'
                            autoComplete='username'
                            required
                            className='block w-full rounded-lg border border-gray-200 py-2 pl-10 pr-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition'
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
                        <input
                            id='password'
                            name='password'
                            type={isPasswordVisible ? 'text' : 'password'}
                            autoComplete='current-password'
                            className='block w-full rounded-lg border border-gray-200 py-2 pl-10 pr-10 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition'
                            placeholder='Nhập mật khẩu'
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <button
                            type='button'
                            onClick={togglePasswordVisibility}
                            className='absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors cursor-pointer'
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

                <button
                    type='submit'
                    disabled={loading}
                    className={`w-full bg-linear-to-r from-blue-500 to-blue-400 text-white font-semibold py-2 rounded-lg shadow hover:from-blue-600 hover:to-blue-600 transition-all flex items-center cursor-pointer justify-center gap-2 ${
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
        </div>
    );
};

export default LoginForm;
