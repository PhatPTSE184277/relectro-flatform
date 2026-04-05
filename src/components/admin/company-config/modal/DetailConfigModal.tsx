import React from 'react';
import { X, MapPin } from 'lucide-react';
import CompanyDetailConfig from './CompanyDetailConfig';

interface DetailConfigModalProps {
    open: boolean;
    onClose: () => void;
    company: any | null;
    onUpdateRadius: (companyId: number, smallPointId: number, radiusKm: number) => void;
    onUpdateMaxDistance: (companyId: number, smallPointId: number, maxRoadDistanceKm: number) => void;
}

const DetailConfigModal: React.FC<DetailConfigModalProps> = ({
    open,
    onClose,
    company,
    onUpdateRadius,
    onUpdateMaxDistance
}) => {
    if (!open || !company) return null;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
            <div className='absolute inset-0 bg-black/50 backdrop-blur-sm'></div>

            <div className='relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[90vh]'>
                <div className='flex justify-between items-center p-6 border-b bg-linear-to-r from-primary-50 to-primary-100 border-primary-100'>
                    <div>
                        <h2 className='text-2xl font-bold text-gray-900 flex items-center gap-2'>
                            <MapPin size={24} className='text-primary-600' />
                            Chỉnh sửa cấu hình
                        </h2>
                        <p className='text-sm text-gray-600 mt-1'>
                            Điều chỉnh bán kính và đơn vị thu gom cách tối đa
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className='text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer'
                        aria-label='Đóng'
                    >
                        <X size={28} />
                    </button>
                </div>

                <div className='flex-1 min-h-0 overflow-hidden p-6 bg-gray-50'>
                    <CompanyDetailConfig
                        company={company}
                        onUpdateRadius={onUpdateRadius}
                        onUpdateMaxDistance={onUpdateMaxDistance}
                    />
                </div>
            </div>
        </div>
    );
};

export default DetailConfigModal;
