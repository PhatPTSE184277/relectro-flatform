import React from 'react';
import PendingPostShow from './PendingPostShow';
import PendingPostSkeleton from './PendingPostSkeleton';

interface PendingPostListProps {
    pendingPosts: any[];
    loading: boolean;
}

const PendingPostList: React.FC<PendingPostListProps> = ({ pendingPosts, loading }) => {
    return (
        <div className='bg-white rounded-2xl shadow-lg border border-gray-100'>
            <div className='overflow-x-auto'>
                <table className='w-full text-sm text-gray-800'>
                    <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold'>
                        <tr>
                            <th className='py-3 px-4 text-left'>Người gửi</th>
                            <th className='py-3 px-4 text-left'>Địa chỉ</th>
                            <th className='py-3 px-4 text-left'>Sản phẩm</th>
                            <th className='py-3 px-4 text-left'>Kích thước</th>
                            <th className='py-3 px-4 text-left'>Khối lượng</th>
                            {/* <th className='py-3 px-4 text-center'>Hành động</th> */}
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            Array.from({ length: 6 }).map((_, idx) => (
                                <PendingPostSkeleton key={idx} />
                            ))
                        ) : pendingPosts.length === 0 ? (
                            <tr>
                                <td colSpan={7} className='text-center py-8 text-gray-400'>
                                    Không có bưu phẩm nào chưa gom nhóm.
                                </td>
                            </tr>
                        ) : (
                            pendingPosts.map((post) => (
                                <PendingPostShow key={post.postId} post={post} />
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PendingPostList;