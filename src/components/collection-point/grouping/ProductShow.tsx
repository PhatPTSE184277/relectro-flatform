import { formatDimensionText } from '@/utils/formatNumber';
import { formatAddress } from '@/utils/FormatAddress';
import { Loader2, Pencil } from 'lucide-react';

interface ProductShowProps {
    product: any;
    stt?: number;
    showCheckbox?: boolean;
    isSelected?: boolean;
    onToggleSelect?: () => void;
    showAction?: boolean;
    actionLoading?: boolean;
    onAction?: () => void;
    showPhone?: boolean;
}

const ProductShow: React.FC<ProductShowProps & { isLast?: boolean }> = ({
    product,
    isLast = false,
    stt,
    showCheckbox,
    isSelected,
    onToggleSelect,
    showAction,
    actionLoading,
    onAction,
    showPhone
}) => {

    const sttIndex = stt ?? 1;
    const rowBg = (sttIndex - 1) % 2 === 0 ? 'bg-white' : 'bg-primary-50';

    let dimensionDisplay = '';
    if (product.dimensionText && product.dimensionText !== 'Chưa cập nhật') {
        dimensionDisplay = product.dimensionText;
    } else if (!product.dimensions || product.dimensions === 'Chưa cập nhật') {
        dimensionDisplay = '0 x 0 x 0';
    } else {
        const l = product.length ?? 0;
        const w = product.width ?? 0;
        const h = product.height ?? 0;
        if (l > 0 || w > 0 || h > 0) {
            dimensionDisplay = `${Number(l).toFixed(2).replace(/\.00$/, '')} x ${Number(w).toFixed(2).replace(/\.00$/, '')} x ${Number(h).toFixed(2).replace(/\.00$/, '')}`;
        } else {
            dimensionDisplay = formatDimensionText(product.dimensions);
        }
    }

    return (
        <tr className={`${!isLast ? 'border-b border-primary-100' : ''} ${rowBg}`}>
            {showCheckbox && (
                <td className='py-3 px-4 text-center w-[5vw]'>
                    <input
                        type='checkbox'
                        checked={isSelected}
                        onChange={onToggleSelect}
                        className='w-4 h-4 cursor-pointer accent-primary-600'
                    />
                </td>
            )}
            <td className='py-3 px-4 w-[5vw]'>
                <div className='flex items-center justify-center h-full'>
                    <span className='w-7 h-7 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold'>
                        {stt}
                    </span>
                </div>
            </td>
            <td className='py-3 px-4 text-left w-[14vw]'>
                <div>{product.categoryName ? product.categoryName : 'Không rõ'}{' - '}{product.brandName ? product.brandName : 'Không rõ'}</div>
            </td>
            <td className='py-3 px-4 text-left w-[22vw]'>
                <div className='space-y-1'>
                    <div className='line-clamp-2'>{formatAddress(product.address) || product.address || 'N/A'}</div>
                    {showPhone && (product.phoneNumber || product.phone) && (
                        <div className='text-xs text-primary-700 font-medium'>
                            SĐT: {product.phoneNumber || product.phone}
                        </div>
                    )}
                </div>
            </td>
            <td className='py-3 px-4 text-right w-[18vw]'>
                <div className='flex flex-col gap-2 items-end'>
                    <span className='text-xs'>
                        <span className='font-medium'>{product.weight || product.weightKg || 0}</span>
                    </span>
                    <span className='text-xs text-gray-500'>
                        {dimensionDisplay}
                    </span>
                </div>
            </td>
            {showAction && (
                <td className='py-3 px-4 text-center w-[10vw]'>
                    <button
                        type='button'
                        onClick={onAction}
                        disabled={actionLoading}
                        className='text-primary-600 hover:text-primary-800 flex items-center justify-center font-medium transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed w-full'
                        title='Cập nhật QR và mô tả'
                    >
                        {actionLoading ? <Loader2 size={16} className='animate-spin' /> : <Pencil size={18} />}
                    </button>
                </td>
            )}
        </tr>
    );
};

export default ProductShow;
