import { Eye, CheckCircle, XCircle } from 'lucide-react';
import { formatDate } from '@/utils/FormatDate';
import { formatAddress } from '@/utils/FormatAddress';
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

interface RequestShowProps {
    post: Post;
    stt?: number;
    onView?: () => void;
    onApprove?: (postId: string) => void;
    onReject?: (postId: string) => void;
    hideImage?: boolean;
    isSelected?: boolean;
    onToggleSelect?: (postId: string) => void;
}

const RequestShow: React.FC<RequestShowProps & { isLast?: boolean }> = ({
    post,
    stt,
    onView,
    onApprove,
    onReject,
    isLast = false,
    isSelected = false,
    onToggleSelect
}) => {
    const isPending = normalizeStatus(post.status) === PostStatus.Pending;

    return (
        <tr className={`${
            !isLast ? 'border-b border-primary-100' : ''
        } ${
            isSelected ? 'bg-primary-50' : ''
        } hover:bg-primary-50/40 transition-colors`}>
            <td className="py-3 px-4 text-center w-16">
                {isPending && onToggleSelect ? (
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect(post.id)}
                        className="w-4 h-4 text-primary-600 bg-white rounded focus:ring-2 focus:ring-primary-500 cursor-pointer border-0 shadow-none outline-none"
                        style={{ boxShadow: 'none', outline: 'none', border: 'none' }}
                    />
                ) : (
                    <div className="w-4 h-4"></div>
                )}
            </td>
            <td className="py-3 px-4 text-center w-[5vw] min-w-[5vw]">
                <span className="w-7 h-7 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold mx-auto">
                    {stt}
                </span>
            </td>
            {/* Ảnh đã bị ẩn */}
            <td className='py-3 px-4 font-medium w-[14vw] min-w-[10vw]'>
                <div className='text-sm text-gray-500 mt-1'>
                    {post.senderName || 'Không rõ'}
                </div>
            </td>

            <td className='py-3 px-4 text-gray-700 w-[18vw] min-w-[12vw]'>
                {post.category}
            </td>
            <td className='py-3 px-4 text-gray-700 w-[28vw] min-w-[18vw]'>
                <div className='line-clamp-2 wrap-break-word'>{formatAddress(post.address) || post.address}</div>
            </td>
            <td className='py-3 px-4 text-sm text-gray-600 text-right w-[12vw] min-w-[8vw]'>
                {formatDate(post.date)}
            </td>

            <td className='py-3 px-4 w-[10vw] min-w-[7vw]'>
                <div className='flex justify-center gap-2'>
                    <button
                        onClick={onView}
                        className='text-primary-600 hover:text-primary-800 flex items-center gap-1 font-medium transition cursor-pointer'
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

export default RequestShow;
