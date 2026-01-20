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
        <div className="bg-white rounded-2xl shadow border border-gray-100 px-3 py-2 mb-6">
            <div className="flex items-center gap-2 flex-wrap min-h-9">
                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary-100 border border-primary-200">
                    <IoFilterOutline className="text-primary-600" size={16} />
                </span>
                <button
                    onClick={() => onFilterChange(PostStatus.Pending)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer min-w-[110px] ${
                        status === PostStatus.Pending
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    Chờ duyệt ({stats.pending})
                </button>
                <button
                    onClick={() => onFilterChange(PostStatus.Approved)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer min-w-[110px] ${
                        status === PostStatus.Approved
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    Đã duyệt ({stats.approved})
                </button>
                <button
                    onClick={() => onFilterChange(PostStatus.Rejected)}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors cursor-pointer min-w-[110px] ${
                        status === PostStatus.Rejected
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    Đã từ chối ({stats.rejected})
                </button>
            </div>
        </div>
    );
};

export default PostFilter;