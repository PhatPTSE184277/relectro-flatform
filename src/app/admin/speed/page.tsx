'use client';

import React, { useState, useEffect } from 'react';
import { Navigation } from 'lucide-react';
import { SpeedProvider, useSpeedContext } from '@/contexts/admin/SpeedContext';
import SpeedList from '@/components/admin/speed/SpeedList';
import EditSpeedModal from '@/components/admin/speed/modal/EditSpeedModal';
import { SpeedData } from '@/services/admin/SpeedService';
import Pagination from '@/components/ui/Pagination';
import SearchBox from '@/components/ui/SearchBox';

const SpeedPageContent: React.FC = () => {
	const {
		speeds,
		loading,
		page,
		limit,
		totalPages,
		setPage,
		fetchSpeeds,
	} = useSpeedContext();

	const [searchTerm, setSearchTerm] = useState('');
	const [selectedSpeed, setSelectedSpeed] = useState<SpeedData | null>(null);
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);

	// Debounce search
	useEffect(() => {
		const timer = setTimeout(() => {
			void fetchSpeeds(1, limit, searchTerm);
		}, 500);
		return () => clearTimeout(timer);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchTerm, limit]);

	const handleEdit = (speed: SpeedData) => {
		setSelectedSpeed(speed);
		setIsEditModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsEditModalOpen(false);
		setSelectedSpeed(null);
	};

	const handlePageChange = (newPage: number) => {
		setPage(newPage);
		void fetchSpeeds(newPage, limit, searchTerm);
	};

	return (
		<div className='min-h-screen p-6'>
			<div className='max-w-7xl mx-auto'>
							{/* Header + Search */}
							<div className='mb-6'>
								<div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2'>
									<div className='flex items-center gap-3'>
										<div className='w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center'>
											<Navigation className='text-white' size={20} />
										</div>
										<div>
											<h1 className='text-3xl font-bold text-gray-900'>Quản lý tốc độ</h1>
										</div>
									</div>
									<div className='flex gap-4 items-center flex-1 justify-end'>
										<div className='flex-1 max-w-md'>
											<SearchBox
												value={searchTerm}
												onChange={setSearchTerm}
												placeholder='Tìm kiếm theo tên điểm thu gom, nhóm...'
											/>
										</div>
									</div>
								</div>
							</div>

				{/* Speed List */}
				<SpeedList speeds={speeds} loading={loading} onEdit={handleEdit} />

				{/* Pagination */}
				{!loading && speeds.length > 0 && (
					<Pagination
						page={page}
						totalPages={totalPages}
						onPageChange={handlePageChange}
					/>
				)}

				{/* Edit Modal */}
				{isEditModalOpen && (
					<EditSpeedModal speed={selectedSpeed} onClose={handleCloseModal} />
				)}
			</div>
		</div>
	);
};

const SpeedPage: React.FC = () => {
	return (
		<SpeedProvider>
			<SpeedPageContent />
		</SpeedProvider>
	);
};

export default SpeedPage;
