/* eslint-disable @next/next/no-img-element */
import { Eye, CheckCircle, XCircle } from 'lucide-react';
import type { Post } from '@/types/post';
import { PostStatus } from '@/enums/PostStatus';

// Chuẩn hóa status về enum
function normalizeStatus(status: string = ''): PostStatus {
    const s = status.trim().toLowerCase();
    if (s === 'đã duyệt' || s === 'approved') return PostStatus.Approved;
    if (s === 'đã từ chối' || s === 'rejected') return PostStatus.Rejected;
    if (s === 'chờ duyệt' || s === 'pending' || s === '')
        return PostStatus.Pending;
    return PostStatus.Pending;
}

interface PostShowProps {
    post: Post;
    onView?: () => void;
    onApprove?: (postId: string) => void;
    onReject?: (postId: string) => void;
}

const PostShow: React.FC<PostShowProps> = ({
    post,
    onView,
    onApprove,
    onReject
}) => {
    const isPending = normalizeStatus(post.status) === PostStatus.Pending;

    return (
        <tr className='border-b border-gray-100 hover:bg-blue-50/40 transition-colors'>
            <td className='py-3 px-4'>
                <div className='w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shadow-sm'>
                    <img
                        src={post.thumbnailUrl || '/placeholder.png'}
                        alt={post.category}
                        className='w-full h-full object-cover'
                    />
                </div>
            </td>

            <td className='py-3 px-4 font-medium max-w-[220px]'>
                <div className='text-sm text-gray-500 mt-1 line-clamp-1'>
                    {post.senderName || 'Không rõ'}
                </div>
            </td>

            <td className='py-3 px-4 text-gray-700'>{post.category}</td>
            <td className='py-3 px-4 text-gray-700'>{post.address}</td>
            <td className='py-3 px-4 text-sm text-gray-600'>
                {new Date(post.date).toLocaleDateString('vi-VN')}
            </td>

            <td className='py-3 px-4'>
                <div className='flex justify-center gap-2'>
                    <button
                        onClick={onView}
                        className='text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium transition cursor-pointer'
                        title='Xem chi tiết'
                    >
                        <Eye size={16} />
                    </button>

                    {isPending && (
                        <>
                            <button
                                onClick={() => onApprove && onApprove(post.id)}
                                className='text-green-600 hover:text-green-800 flex items-center gap-1 font-medium transition cursor-pointer'
                                title='Duyệt bài'
                            >
                                <CheckCircle size={16} />
                            </button>
                            <button
                                onClick={() => onReject && onReject(post.id)}
                                className='text-red-600 hover:text-red-800 flex items-center gap-1 font-medium transition cursor-pointer'
                                title='Từ chối bài'
                            >
                                <XCircle size={16} />
                            </button>
                        </>
                    )}
                </div>
            </td>
        </tr>
    );
};

export default PostShow;
