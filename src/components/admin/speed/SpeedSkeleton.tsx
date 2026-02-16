import React from 'react';

const SpeedSkeleton: React.FC = () => (
	<tr className='border-b border-gray-100 hover:bg-gray-50'>
		<td className='py-3 px-4'>
			<div className='flex items-center justify-center'>
				<div className='w-8 h-8 rounded-full bg-gray-200 animate-pulse' />
			</div>
		</td>
		<td className='py-3 px-4'>
			<div className='h-4 bg-gray-200 rounded w-40 animate-pulse' />
		</td>
		<td className='py-3 px-4'>
			<div className='h-4 bg-gray-200 rounded w-48 animate-pulse' />
		</td>
		<td className='py-3 px-4'>
			<div className='flex items-center justify-center'>
				<div className='h-4 bg-gray-200 rounded w-16 animate-pulse' />
			</div>
		</td>
		<td className='py-3 px-4'>
			<div className='flex items-center justify-center'>
				<div className='h-6 w-24 bg-gray-200 rounded-full animate-pulse' />
			</div>
		</td>
		<td className='py-3 px-4'>
			<div className='flex justify-center gap-2'>
				<div className='h-8 w-8 bg-gray-200 rounded animate-pulse' />
			</div>
		</td>
	</tr>
);

export default SpeedSkeleton;
