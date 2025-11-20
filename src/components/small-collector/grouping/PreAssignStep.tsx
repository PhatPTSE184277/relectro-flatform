'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';
import PendingPostList from './PendingPostList';

interface PreAssignStepProps {
    loading: boolean;
    pendingPosts: any[];
    loadThreshold: number;
    setLoadThreshold: (value: number) => void;
    onGetSuggestion: () => void;
}

const PreAssignStep: React.FC<PreAssignStepProps> = ({
    loading,
    pendingPosts,
    loadThreshold,
    setLoadThreshold,
    onGetSuggestion
}) => {
    return (
        <div className='space-y-6'>
            <div className='text-center'>
                <h2 className='text-2xl font-bold text-gray-900 mb-2'>
                    Bước 1: Gợi ý gom nhóm
                </h2>
                <p className='text-gray-600'>
                    Hệ thống sẽ tự động gợi ý cách gom nhóm các bưu phẩm dựa
                    trên khả năng tải của phương tiện
                </p>
            </div>

            {/* Load Threshold Setting */}
            <div className='bg-gray-50 rounded-lg p-6 mb-4'>
                <label className='block text-sm font-medium text-gray-700 mb-3'>
                    Ngưỡng tải (%)
                </label>
                <div className='flex items-center gap-4'>
                    <input
                        type='range'
                        min='50'
                        max='100'
                        value={loadThreshold}
                        onChange={(e) =>
                            setLoadThreshold(Number(e.target.value))
                        }
                        className='flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer'
                        style={{
                            accentColor: '#2563eb'
                        }}
                    />
                    <div className='w-16 text-center'>
                        <span className='text-2xl font-bold text-blue-600'>
                            {loadThreshold}
                        </span>
                        <span className='text-sm text-gray-500'>%</span>
                    </div>
                </div>
                <p className='text-xs text-gray-500 mt-2'>
                    Phương tiện sẽ được gợi ý sử dụng khi đạt mức tải này
                </p>
            </div>

            {/* Warning */}
            {/* <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start gap-3'>
                            <AlertCircle className='text-yellow-600 shrink-0 mt-0.5' size={20} />
                            <div className='text-sm text-yellow-800'>
                                <p className='font-medium mb-1'>Lưu ý:</p>
                                <ul className='list-disc list-inside space-y-1'>
                                    <li>
                                        Hệ thống sẽ ưu tiên gom nhóm theo khoảng cách gần
                                        nhất
                                    </li>
                                    <li>
                                        Ngưỡng tải cao hơn có thể giảm số lượng phương tiện
                                        cần sử dụng
                                    </li>
                                    <li>
                                        Bạn có thể điều chỉnh lại sau khi xem gợi ý
                                    </li>
                                </ul>
                            </div>
                        </div> */}

            {/* Action Button */}
            <div className='flex justify-center mb-4'>
                <button
                    onClick={onGetSuggestion}
                    disabled={loading || pendingPosts.length === 0}
                    className='py-2 px-6 text-base bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors'
                >
                    {loading ? 'Đang xử lý...' : 'Lấy gợi ý gom nhóm'}
                </button>
            </div>

            {/* Pending Posts List */}
            <PendingPostList pendingPosts={pendingPosts} loading={loading} />
        </div>
    );
};

export default PreAssignStep;
