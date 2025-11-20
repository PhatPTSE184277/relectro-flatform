import React from 'react';
import { Eye } from 'lucide-react';

interface PendingPostShowProps {
    post: any;
}

const PendingPostShow: React.FC<PendingPostShowProps> = ({ post }) => {
    return (
        <tr className='border-b border-gray-100 hover:bg-blue-50/40 transition-colors'>
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
                {post.dimensionText || `${post.length} x ${post.width} x ${post.height} cm`}
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

export default PendingPostShow;
