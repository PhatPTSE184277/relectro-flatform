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
    return (
        <table className='w-full text-sm text-gray-800'>
            <thead className='bg-gray-50 text-gray-700 uppercase text-xs font-semibold sticky top-0 z-10'>
                <tr>
                    <th className='py-3 px-4 text-left'>
                        <input
                            type='checkbox'
                            checked={allSelected}
                            onChange={handleToggleAll}
                            className='w-4 h-4 text-primary-600 rounded cursor-pointer'
                        />
                    </th>
                    <th className='py-3 px-4 text-left'>STT</th>
                    <th className='py-3 px-4 text-left'>Người gửi</th>
                    <th className='py-3 px-4 text-left'>Địa chỉ</th>
                    <th className='py-3 px-4 text-left'>Khối lượng</th>
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
                            <td className='py-3 px-4'>
                                <input
                                    type='checkbox'
                                    checked={isSelected}
                                    onChange={() => onToggleProduct(product.productId)}
                                    onClick={(e) => e.stopPropagation()}
                                    className='w-4 h-4 text-primary-600 rounded cursor-pointer'
                                />
                            </td>
                            <td className='py-3 px-4'>
                                <span className='w-6 h-6 rounded-full bg-primary-600 text-white text-xs flex items-center justify-center font-semibold'>
                                    {index + 1}
                                </span>
                            </td>
                            <td className='py-3 px-4 text-gray-700'>
                                <div>{product.userName || 'N/A'}</div>
                                <div className='text-xs text-gray-500 mt-1'>
                                    {product.categoryName ? product.categoryName : 'Không rõ'}{' - '}{product.brandName ? product.brandName : 'Không rõ'}
                                </div>
                            </td>
                            <td className='py-3 px-4 text-gray-700 max-w-xs'>
                                <div className='line-clamp-2'>{product.address || 'N/A'}</div>
                            </td>
                            <td className='py-3 px-4 text-gray-700'>
                                <div className='flex flex-col gap-1'>
                                    <span className='text-xs'>
                                        <span className='font-medium'>{product.weight || product.weightKg || 0}</span> kg
                                    </span>
                                    <span className='text-xs text-gray-500'>
                                        {product.volume || product.volumeM3 || 0} m³
                                    </span>
                                </div>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default ProductList;
