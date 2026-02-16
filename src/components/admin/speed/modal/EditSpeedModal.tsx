import React, { useState } from 'react';
import { X, MapPin, Users, Loader2 } from 'lucide-react';
import { SpeedData, CreateSpeedPayload } from '@/services/admin/SpeedService';
import SummaryCard from '@/components/ui/SummaryCard';
import CustomNumberInput from '@/components/ui/CustomNumberInput';
import { useSpeedContext } from '@/contexts/admin/SpeedContext';
import Toast from '@/components/ui/Toast';

interface EditSpeedModalProps {
	speed: SpeedData | null;
	onClose: () => void;
}

const EditSpeedModal: React.FC<EditSpeedModalProps> = ({ speed, onClose }) => {
	const { updateSpeedByPayload, createSpeedByPayload, loading } = useSpeedContext();
	const [speedKmh, setSpeedKmh] = useState<number>(speed?.value || 0);
	const [toast, setToast] = useState<{ open: boolean; type: 'success' | 'error'; message: string }>({
		open: false,
		type: 'success',
		message: '',
	});

	if (!speed) return null;

	const handleSave = async () => {
		if (speedKmh <= 0) {
			setToast({ open: true, type: 'error', message: 'Tốc độ phải lớn hơn 0' });
			return;
		}

		const payload: CreateSpeedPayload = {
			smallCollectionPointId: speed.smallCollectionPointId,
			speedKmh: speedKmh,
		};

		try {
			// Check status to decide POST or PUT
			if (speed.status === 'Chưa cấu hình') {
				await createSpeedByPayload(payload);
				setToast({ open: true, type: 'success', message: 'Tạo tốc độ thành công' });
			} else {
				await updateSpeedByPayload(payload);
				setToast({ open: true, type: 'success', message: 'Cập nhật tốc độ thành công' });
			}
			onClose();
		} catch (error: any) {
			setToast({
				open: true,
				type: 'error',
				message: error?.response?.data?.message || 'Lỗi khi cập nhật tốc độ',
			});
		}
	};

	return (
		<div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
			<div className='absolute inset-0 bg-black/40 backdrop-blur-sm'></div>
			<div className='relative w-full bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[90vh] animate-fadeIn' style={{maxWidth: Math.max(600, Math.min(1100, (speed?.displayName?.length || 0) * 16 + 600))}}>
				{/* Header (match AssignRecyclingModal) */}
				<div className='flex justify-between items-center p-6 bg-linear-to-r from-primary-50 to-primary-100 rounded-t-2xl'>
					<div>
						<h2 className='text-2xl font-bold text-gray-900'>Chỉnh sửa tốc độ</h2>
					</div>
					<button
						onClick={onClose}
						className='text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer transition'
						disabled={loading}
					>
						<X size={28} />
					</button>
				</div>

				{/* Main content */}
				<div className='flex-1 overflow-y-auto p-6 space-y-6 bg-white'>
					<SummaryCard
						label='Thông tin điểm thu gom'
						singleRow={false}
						items={[
							{
								icon: <MapPin size={14} className='text-primary-600' />,
								label: 'Điểm thu gom',
								value: speed.displayName || 'Không rõ',
								colSpan: 2,
							},
							{
								icon: <Users size={14} className='text-primary-600' />,
								label: 'Nhóm',
								value: speed.groupName || 'Không rõ',
							},
							{
								icon: null,
								label: 'Tốc độ (km/h)',
								value: (
									<div className='w-full'>
										<CustomNumberInput
											value={speedKmh}
											onChange={setSpeedKmh}
											min={1}
											max={200}
											placeholder='Nhập tốc độ'
											className='w-24 px-2 py-1 border border-primary-300 rounded-lg text-primary-700 font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
										/>
									</div>
								),
							}
						]}
					/>

					{/* Actions */}
					<div className='flex justify-end gap-3'>
							<button
								onClick={handleSave}
								className='px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center'
								disabled={loading}
							>
								{loading ? <Loader2 className='animate-spin' size={18} /> : 'Lưu'}
							</button>
					</div>
				</div>
			</div>

			{/* Toast */}
			<Toast
				open={toast.open}
				type={toast.type}
				message={toast.message}
				onClose={() => setToast({ ...toast, open: false })}
			/>

			{/* Animation */}
			<style jsx>{`
				@keyframes fadeIn {
					from {
						opacity: 0;
						transform: scale(0.96) translateY(10px);
					}
					to {
						opacity: 1;
						transform: scale(1) translateY(0);
					}
				}
				.animate-fadeIn {
					animation: fadeIn 0.3s ease-out;
				}
			`}</style>
		</div>
	);
};

export default EditSpeedModal;
