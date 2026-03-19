import React from 'react';
import { Pencil, Trash2, Check, Package } from 'lucide-react';

export interface ReceiveScannedProduct {
    productId: string;
    categoryName: string;
    brandName: string;
    description: string;
    qrCode: string;
    originalPoint: number;
    pendingPoint?: number;
}

interface ReceiveProductListProps {
    products: ReceiveScannedProduct[];
    loadingTabId?: string | null;
    latestQr?: string | null;
    updatedProductIds?: string[];
    onEdit: (product: ReceiveScannedProduct) => void;
    onRemove: (product: ReceiveScannedProduct) => void;
    maxHeight?: number;
}

const ReceiveProductList: React.FC<ReceiveProductListProps> = ({
    products,
    loadingTabId,
    latestQr,
    updatedProductIds = [],
    onEdit,
    onRemove,
    maxHeight = 34
}) => {
    if (!products || products.length === 0) {
        return (
            <div className='text-center py-8 text-gray-400'>
                <Package size={48} className='mx-auto mb-2 opacity-50' />
                <p className='font-semibold text-gray-700'>Chưa có sản phẩm</p>
                <p className='text-sm'>Quét QR code để thêm sản phẩm</p>
            </div>
        );
    }
    return (
        <div className='bg-white rounded-xl shadow-sm border border-gray-100'>
            <div className='p-4'>
                <h3 className='text-3 font-semibold text-gray-900'>
                    Danh sách sản phẩm ({products.length})
                </h3>
            </div>

            <div className='relative w-full overflow-y-auto' style={{ maxHeight: `${maxHeight}vh` }}>
                <table className='w-full text-sm text-gray-800 table-fixed'>
                    <thead className='bg-primary-50 text-primary-700 uppercase text-xs font-semibold sticky top-0 z-10 border-b border-primary-100'>
                        <tr>
                            <th className='py-3 px-4 text-center w-[5vw] min-w-12'>STT</th>
                            <th className='py-3 px-4 text-left w-[16vw] min-w-28'>QR Code</th>
                            <th className='py-3 px-4 text-left w-[14vw] min-w-24'>Danh mục</th>
                            <th className='py-3 px-4 text-left w-[12vw] min-w-24'>Thương hiệu</th>
                            <th className='py-3 px-4 text-left w-[20vw] min-w-28'>Ghi chú</th>
                            <th className='py-3 px-4 text-center w-[10vw] min-w-28'>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, index) => {
                            const isLatest = product.qrCode === latestQr;
                            const isUpdated = updatedProductIds.includes(product.productId);
                            const rowBg = isLatest
                                ? 'bg-green-50'
                                : isUpdated
                                    ? 'bg-blue-50'
                                    : index % 2 === 0
                                        ? 'bg-white'
                                        : 'bg-primary-50';
                            const isLoadingTab = loadingTabId === product.productId;

                            return (
                                <tr key={product.qrCode} className={`${index !== products.length - 1 ? 'border-b border-primary-100' : ''} ${rowBg} transition-colors`}>
                                    <td className='py-3 px-4 text-center'>
                                        <span className='w-7 h-7 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold mx-auto'>
                                            {index + 1}
                                        </span>
                                    </td>
                                    <td className='py-3 px-4 text-gray-900 break-all'>{product.qrCode}</td>
                                    <td className='py-3 px-4 text-gray-900'>{product.categoryName || 'Không rõ'}</td>
                                    <td className='py-3 px-4 text-gray-700'>{product.brandName || 'Không rõ'}</td>
                                    <td className='py-3 px-4 text-gray-700'>
                                        <div className='line-clamp-2 break-all'>{product.description || '-'}</div>
                                    </td>
                                    <td className='py-3 px-4'>
                                        <div className='flex justify-center items-center gap-2'>
                                            <button
                                                onClick={() => onEdit(product)}
                                                disabled={isLoadingTab}
                                                className='text-primary-600 hover:text-primary-800 transition cursor-pointer disabled:opacity-60 disabled:cursor-wait'
                                                title='Chỉnh điểm'
                                            >
                                                {isLoadingTab ? (
                                                    <span className='w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin inline-block' />
                                                ) : (
                                                    <Pencil size={16} />
                                                )}
                                            </button>
                                            {isUpdated && <Check size={14} className='text-green-600' />}
                                            <button
                                                onClick={() => onRemove(product)}
                                                className='text-red-500 hover:text-red-700 transition cursor-pointer'
                                                title='Xóa khỏi danh sách quét'
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReceiveProductList;
