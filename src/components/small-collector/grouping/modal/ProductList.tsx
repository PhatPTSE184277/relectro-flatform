interface ProductListProps {
    products: any[];
    selectedProductIds: string[];
    onToggleProduct: (productId: string) => void;
    onToggleAll?: () => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, selectedProductIds, onToggleProduct, onToggleAll }) => {
    const allSelected = products.length > 0 && selectedProductIds.length === products.length;
    const handleToggleAll = () => {
        if (onToggleAll) {
            onToggleAll();
        }
    };
    // Xử lý hiển thị kích thước
    const getDimensionDisplay = (product: any) => {
        if (!product.dimensions || product.dimensions === 'Chưa cập nhật') {
            return '0 x 0 x 0';
        }
        const l = product.length ?? 0;
        const w = product.width ?? 0;
        const h = product.height ?? 0;
        if (l > 0 || w > 0 || h > 0) {
            return `${Number(l).toFixed(2).replace(/\.00$/, '')} x ${Number(w).toFixed(2).replace(/\.00$/, '')} x ${Number(h).toFixed(2).replace(/\.00$/, '')}`;
        }
        return product.dimensions;
    };
    return (
        <div className='max-h-[284px] overflow-y-auto'>
            <table className='min-w-[700px] text-sm text-gray-800' style={{ tableLayout: 'fixed', width: '100%' }}>
                <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold sticky top-0 z-10'>
                    <tr>
                        <th className='py-3 px-4 text-center w-13'>
                            <input
                                type='checkbox'
                                checked={allSelected}
                                onChange={handleToggleAll}
                                className='w-4 h-4 text-primary-600 rounded cursor-pointer'
                            />
                        </th>
                        <th className='py-3 px-4 text-left w-18'>STT</th>
                        <th className='py-3 px-4 text-left w-64'>Người gửi</th>
                        <th className='py-3 px-4 text-left'>Địa chỉ</th>
                        <th className='py-3 px-4 text-right w-64'>Khối lượng / Kích thước (kg, cm)</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product: any, index: number) => {
                        const isSelected = selectedProductIds.includes(product.productId);
                        const isLast = index === products.length - 1;
                        return (
                            <tr
                                key={product.productId}
                                onClick={() => onToggleProduct(product.productId)}
                                className={`${!isLast ? 'border-b border-primary-100' : ''} cursor-pointer transition-colors ${
                                    isSelected ? 'bg-primary-50' : 'hover:bg-primary-50'
                                }`}
                            >
                                <td className='py-3 px-4 text-center' onClick={e => e.stopPropagation()}>
                                    <input
                                        type='checkbox'
                                        checked={isSelected}
                                        onChange={e => {
                                            e.stopPropagation();
                                            onToggleProduct(product.productId);
                                        }}
                                        className='w-4 h-4 text-primary-600 rounded cursor-pointer'
                                    />
                                </td>
                                <td className='py-3 px-4 text-left w-16'>
                                    <span className='w-7 h-7 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold mx-auto'>
                                        {index + 1}
                                    </span>
                                </td>
                                <td className='py-3 px-4 text-left w-64'>
                                    <div>{product.userName || 'N/A'}</div>
                                    <div className='text-xs text-gray-500 mt-1'>
                                        {product.categoryName ? product.categoryName : 'Không rõ'}{' - '}{product.brandName ? product.brandName : 'Không rõ'}
                                    </div>
                                </td>
                                <td className='py-3 px-4 text-left'>
                                    <div className='line-clamp-2'>{product.address || 'N/A'}</div>
                                </td>
                                <td className='py-3 px-4 text-right w-64'>
                                    <div className='flex flex-col gap-1 items-end'>
                                        <span className='text-xs'>
                                            <span className='font-medium'>{product.weight || product.weightKg || 0}</span>
                                        </span>
                                        <span className='text-xs text-gray-500'>
                                            {getDimensionDisplay(product)}
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default ProductList;
