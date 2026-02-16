import React from 'react';
import SpeedShow from './SpeedShow';
import SpeedSkeleton from './SpeedSkeleton';
import { SpeedData } from '@/services/admin/SpeedService';

interface SpeedListProps {
	speeds: SpeedData[];
	loading: boolean;
	onEdit: (speed: SpeedData) => void;
}

const SpeedList: React.FC<SpeedListProps> = ({ speeds, loading, onEdit }) => {
	return (
		<div className='bg-white rounded-2xl shadow-lg border border-gray-100 mb-6'>
			<div className='overflow-x-auto'>
				<div className='max-h-105 overflow-y-auto'>
					<table className='min-w-full text-sm text-gray-800 table-fixed'>
						<thead className='bg-primary-50 text-primary-700 uppercase text-xs font-semibold sticky top-0 z-10 border-b border-primary-100'>
							<tr>
								<th className='py-3 px-4 text-center w-16'>STT</th>
								<th className='py-3 px-4 text-left w-48'>Điểm thu gom</th>
								<th className='py-3 px-4 text-right w-32'>Tốc độ (km/h)</th>
								<th className='py-3 px-4 text-center w-28'>Hành động</th>
							</tr>
						</thead>
						<tbody>
							{loading ? (
								Array.from({ length: 6 }).map((_, idx) => (
									<SpeedSkeleton key={idx} />
								))
							) : speeds.length > 0 ? (
								speeds.map((speed, idx) => (
									<SpeedShow
										key={speed.smallCollectionPointId || `speed-${idx}`}
										speed={speed}
										index={idx}
										isLast={idx === speeds.length - 1}
										onEdit={onEdit}
									/>
								))
							) : (
								<tr>
									<td colSpan={6} className='text-center py-8 text-gray-400'>
										Không có dữ liệu tốc độ.
									</td>
								</tr>
							)}
						</tbody>
					</table>
				</div>
			</div>
		</div>
	);
};

export default SpeedList;
