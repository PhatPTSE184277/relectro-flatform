'use client';

import React from 'react';
import { QrCode } from 'lucide-react';
import { useSeedQRCodeContext } from '@/contexts/small-collector/SeedQRCodeContext';
import SeedQRProductList from '@/components/small-collector/seed-qrcode/SeedQRProductList';
import SeedQRModal from '@/components/small-collector/seed-qrcode/modal/SeedQRModal';
import CustomDatePicker from '@/components/ui/CustomDatePicker';
import Toast from '@/components/ui/Toast';

const SeedQRCodePage: React.FC = () => {
    const {
        routes,
        loading,
        selectedIds,
        pickUpDate,
        setPickUpDate,
        showModal,
        setShowModal,
        toast,
        hideToast,
        toggleRoute,
        toggleAll,
        seedQR
    } = useSeedQRCodeContext();

    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8'>
            {/* Header */}
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6'>
                <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center border border-primary-200'>
                        <QrCode className='text-white' size={20} />
                    </div>
                    <h1 className='text-3xl font-bold text-gray-900'>Gán QR Code sản phẩm</h1>
                </div>

                <div className='flex items-center gap-3 flex-wrap'>
                    {/* Single date picker */}
                    <CustomDatePicker
                        value={pickUpDate}
                        onChange={setPickUpDate}
                        placeholder='Chọn ngày'
                    />

                    {/* Seed button */}
                    <button
                        disabled={selectedIds.size === 0}
                        onClick={() => setShowModal(true)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-white shadow-md border transition whitespace-nowrap ${
                            selectedIds.size === 0
                                ? 'bg-primary-300 border-primary-200 cursor-not-allowed'
                                : 'bg-primary-600 hover:bg-primary-700 border-primary-200 cursor-pointer'
                        }`}
                    >
                        <QrCode size={18} />
                        Gán QR Code
                        {selectedIds.size > 0 && (
                            <span className='ml-1 bg-white/30 text-white text-xs px-2 py-0.5 rounded-full font-semibold'>
                                {selectedIds.size}
                            </span>
                        )}
                    </button>
                </div>
            </div>

            {/* Summary info removed per request */}

            {/* Route list */}
            <SeedQRProductList
                routes={routes}
                loading={loading}
                selectedIds={selectedIds}
                onToggle={toggleRoute}
                onToggleAll={toggleAll}
            />

            {/* QR Modal */}
            <SeedQRModal
                open={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={seedQR}
                selectedCount={selectedIds.size}
            />

            {/* Toast */}
            {toast && (
                <Toast
                    open={!!toast}
                    message={toast.message}
                    type={toast.type}
                    onClose={hideToast}
                />
            )}
        </div>
    );
};

export default SeedQRCodePage;
