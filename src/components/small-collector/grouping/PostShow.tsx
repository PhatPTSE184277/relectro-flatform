import React from 'react';
import { formatDimensionText } from '../../../utils/formatDimensionText';

interface PostShowProps {
    post: any;
}

const PostShow: React.FC<PostShowProps & { isLast?: boolean }> = ({ post, isLast = false }) => {
    return (
        <tr className={`${!isLast ? 'border-b border-primary-100' : ''} hover:bg-primary-50/40 transition-colors`}>
            <td className='py-3 px-4 text-gray-700'>
                {post.userName || 'N/A'}
            </td>
            <td className='py-3 px-4 text-gray-700 max-w-xs'>
                <div className='line-clamp-2'>{post.address || 'N/A'}</div>
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
};

export default PostShow;
