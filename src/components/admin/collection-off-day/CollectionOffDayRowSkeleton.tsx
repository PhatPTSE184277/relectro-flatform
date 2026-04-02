'use client';

import React from 'react';

const CollectionOffDayRowSkeleton: React.FC = () => (
  <tr className='border-b border-primary-100'>
    <td className='py-3 px-4 text-center'>
      <span className='w-7 h-7 rounded-full bg-gray-200 opacity-30 flex items-center justify-center mx-auto animate-pulse' />
    </td>
    <td className='py-3 px-4'>
      <div className='h-4 bg-gray-200 rounded w-48 mb-2 animate-pulse' />
      <div className='h-3 bg-gray-100 rounded w-28 animate-pulse' />
    </td>
    <td className='py-3 px-4'>
      <div className='h-4 bg-gray-200 rounded w-44 animate-pulse' />
    </td>
    <td className='py-3 px-4 text-center'>
      <div className='h-4 bg-gray-200 rounded w-24 mx-auto animate-pulse' />
    </td>
    <td className='py-3 px-4'>
      <div className='h-4 bg-gray-200 rounded w-56 animate-pulse' />
    </td>
    <td className='py-3 px-4 text-center'>
      <div className='h-9 w-9 bg-gray-200 rounded-lg mx-auto animate-pulse' />
    </td>
  </tr>
);

export default CollectionOffDayRowSkeleton;
