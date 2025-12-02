import React from 'react';

import PostShow from './PostShow';
import PostSkeleton from './PostSkeleton';

interface PostListProps {
    posts: any[];
    loading: boolean;
}

const PostList: React.FC<PostListProps> = ({ posts, loading }) => {
    return (
        <div className='bg-white rounded-2xl shadow-lg border border-gray-100'>
            <div className='overflow-x-auto'>
                <table className='w-full text-sm text-gray-800'>
                    <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold'>
                        <tr>
                            <th className='py-3 px-4 text-left'>Người gửi</th>
                            <th className='py-3 px-4 text-left'>Địa chỉ</th>
                            <th className='py-3 px-4 text-left'>Sản phẩm</th>
                            <th className='py-3 px-4 text-left'>Kích thước (cm)</th>
                            <th className='py-3 px-4 text-left'>Khối lượng</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            Array.from({ length: 6 }).map((_, idx) => (
                                <PostSkeleton key={idx} />
                            ))
                        ) : posts?.length === 0 ? (
                            <tr>
                                <td colSpan={5} className='text-center py-8 text-gray-400'>
                                    Không có bưu phẩm nào chưa gom nhóm.
                                </td>
                            </tr>
                        ) : (
                            posts?.map((post, idx) => (
                                <PostShow key={post.postId} post={post} isLast={idx === posts.length - 1} />
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PostList;