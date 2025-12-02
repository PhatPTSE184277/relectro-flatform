import React from 'react';
import { formatDimensionText } from '@/utils/formatDimensionText';

interface PostListProps {
    posts: any[];
    selectedPostIds: string[];
    onTogglePost: (postId: string) => void;
}

const PostList: React.FC<PostListProps> = ({ posts, selectedPostIds, onTogglePost }) => {
    return (
        <table className='w-full text-sm text-gray-800'>
            <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold sticky top-0 z-10'>
                <tr>
                    <th className='py-3 px-4 text-left'></th>
                    <th className='py-3 px-4 text-left'>STT</th>
                    <th className='py-3 px-4 text-left'>Người gửi</th>
                    <th className='py-3 px-4 text-left'>Địa chỉ</th>
                    <th className='py-3 px-4 text-left'>Sản phẩm</th>
                    <th className='py-3 px-4 text-left'>Kích thước (cm)</th>
                    <th className='py-3 px-4 text-left'>Khối lượng</th>
                </tr>
            </thead>
            <tbody>
                {posts.map((post: any, index: number) => {
                    const isSelected = selectedPostIds.includes(post.postId);
                    const isLast = index === posts.length - 1;
                    return (
                        <tr
                            key={post.postId}
                            onClick={() => onTogglePost(post.postId)}
                            className={`${!isLast ? 'border-b border-primary-100' : ''} cursor-pointer transition-colors ${
                                isSelected ? 'bg-primary-50' : 'hover:bg-primary-50'
                            }`}
                        >
                            <td className='py-3 px-4'>
                                <input
                                    type='checkbox'
                                    checked={isSelected}
                                    onChange={() => onTogglePost(post.postId)}
                                    onClick={(e) => e.stopPropagation()}
                                    className='w-4 h-4 text-primary-600 rounded cursor-pointer'
                                />
                            </td>
                            <td className='py-3 px-4'>
                                <div className='flex items-center justify-center w-8 h-8 rounded-full bg-primary-50 border border-primary-200 text-primary-700 font-bold text-sm'>
                                    {index + 1}
                                </div>
                            </td>
                            <td className='py-3 px-4 font-medium text-gray-900'>
                                {post.userName}
                            </td>
                            <td className='py-3 px-4 text-gray-700 max-w-xs'>
                                <div className='line-clamp-2'>
                                    {post.address}
                                </div>
                            </td>
                            <td className='py-3 px-4 text-gray-700'>
                                {post.productName || 'N/A'}
                            </td>
                            <td className='py-3 px-4 text-gray-700'>
                                {formatDimensionText(post)}
                            </td>
                            <td className='py-3 px-4 text-gray-700'>
                                <div className='flex flex-col gap-1'>
                                    <span className='text-xs'>
                                        <span className='font-medium'>{post.weight || 0}</span> kg
                                    </span>
                                    <span className='text-xs text-gray-500'>
                                        {post.volume || 0} m³
                                    </span>
                                </div>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default PostList;
