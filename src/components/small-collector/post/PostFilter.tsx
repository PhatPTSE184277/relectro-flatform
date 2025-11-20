import { IoFilterOutline } from 'react-icons/io5';
import React from 'react';
import { PostStatus } from '@/enums/PostStatus';

interface PostFilterProps {
    status: PostStatus;
    stats: {
        total: number;
        approved: number;
        rejected: number;
        pending: number;
    };
    onFilterChange: (status: PostStatus) => void;
}

const PostFilter: React.FC<PostFilterProps> = ({
    status,
    stats,
    onFilterChange
}) => {
    return (
        <div className='bg-white rounded-2xl shadow-xl border border-gray-100 p-4 mb-6'>
            <div className='flex items-center gap-2 mb-4'>
                <IoFilterOutline className='text-gray-500' />
                <h3 className='text-gray-900 font-medium'>Lọc bài đăng</h3>
            </div>

            <div className='flex flex-wrap gap-2'>
                <button
                    onClick={() => onFilterChange(PostStatus.Pending)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        status === PostStatus.Pending
                            ? 'bg-yellow-100 text-yellow-700 shadow'
                            : 'bg-gray-100 text-gray-600'
                    }`}
                >
                    Chờ Duyệt ({stats.pending})
                </button>

                <button
                    onClick={() => onFilterChange(PostStatus.Approved)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        status === PostStatus.Approved
                            ? 'bg-green-100 text-green-700 shadow'
                            : 'bg-gray-100 text-gray-600'
                    }`}
                >
                    Đã duyệt ({stats.approved})
                </button>

                <button
                    onClick={() => onFilterChange(PostStatus.Rejected)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        status === PostStatus.Rejected
                            ? 'bg-red-100 text-red-700 shadow'
                            : 'bg-gray-100 text-gray-600'
                    }`}
                >
                    Đã Từ Chối ({stats.rejected})
                </button>
            </div>
        </div>
    );
};

export default PostFilter;