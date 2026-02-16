import React from 'react';
import { Edit } from 'lucide-react';
import { SpeedData } from '@/services/admin/SpeedService';

interface SpeedShowProps {
	speed: SpeedData;
	index: number;
	isLast?: boolean;
	onEdit: (speed: SpeedData) => void;
}

const SpeedShow: React.FC<SpeedShowProps> = ({ speed, index, isLast = false, onEdit }) => {
	const rowBg = index % 2 === 0 ? 'bg-white' : 'bg-primary-50';

	return (
		<tr className={`${!isLast ? 'border-b border-primary-100' : ''} ${rowBg}`}>
			<td className='py-3 px-4 text-center w-16'>
				<span className='w-7 h-7 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold mx-auto'>
					{index + 1}
				</span>
			</td>
			<td className='py-3 px-4 font-medium text-gray-900 w-48'>
				{speed.displayName || 'Không rõ'}
			</td>
			<td className='py-3 px-4 text-right w-32'>
				<span className='text-gray-900'>
					{speed.value || 0}
				</span>
			</td>
			<td className='py-3 px-4 w-28'>
				<div className='flex justify-center gap-2'>
					<button
						onClick={() => onEdit(speed)}
						className='text-primary-600 hover:text-primary-800 flex items-center gap-1 font-medium transition cursor-pointer'
						title='Chỉnh sửa'
					>
						<Edit size={16} />
					</button>
				</div>
			</td>
		</tr>
	);
};

export default SpeedShow;
