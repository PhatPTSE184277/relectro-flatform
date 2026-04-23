/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useRef, useEffect } from 'react';
import Toast from '@/components/ui/Toast';
import CustomNumberInput from '@/components/ui/CustomNumberInput';
import CustomTextarea from '@/components/ui/CustomTextarea';
import { X, Package as PackageIcon, ArrowRight, Loader2 } from 'lucide-react';
import { getProductByQRCode, getProductById } from '@/services/collection-point/IWProductService';
import ReceiveProductList, { ReceiveScannedProduct } from './ReceiveProductList';
import ConfirmDeleteModal from './ConfirmDeleteModal';
import SearchBox from '@/components/ui/SearchBox';

interface ReceiveProductProps {
    open: boolean;
    onClose: () => void;
    onConfirm: (data: {
        qrCode: string;
        description: string | null;
        point: number | null;
    }[]) => void;
}

interface ScannedProduct extends ReceiveScannedProduct {
    status: string;
    estimatePoint?: number;
    realPoints?: number;
    realPoint?: number | null;
    productImages?: string[];
    changedPointMessage?: string;
    pendingDescription?: string;
}

const REASON_TAGS = [
    'Sản phẩm bị hỏng',
    'Thiếu linh kiện',
    'Chất lượng không như mô tả',
    'Khác'
];

const ReceiveProduct: React.FC<ReceiveProductProps> = ({
    open,
    onClose,
    onConfirm
}) => {
    const [qrCode, setQrCode] = useState('');
    const [qrSearch, setQrSearch] = useState('');
    const [scannedProducts, setScannedProducts] = useState<ScannedProduct[]>([]);
    const [latestQr, setLatestQr] = useState<string | null>(null);
    const [selectedProduct, setSelectedProduct] = useState<ScannedProduct | null>(null);
    const [loading, setLoading] = useState(false);
    const [loadingTabId, setLoadingTabId] = useState<string | null>(null);

    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [customReason, setCustomReason] = useState('');
    const [point, setPoint] = useState(0);
    const [zoomImg, setZoomImg] = useState<string | null>(null);
    const [showEditModal, setShowEditModal] = useState(false);

    const [updatedProductIds, setUpdatedProductIds] = useState<string[]>([]);
    const [confirmingReceive, setConfirmingReceive] = useState(false);
    const [showClearAllConfirm, setShowClearAllConfirm] = useState(false);
    const [productToRemove, setProductToRemove] = useState<ReceiveScannedProduct | null>(null);

    const qrInputRef = useRef<HTMLInputElement>(null);

    const [toastOpen, setToastOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState<'success' | 'error'>('success');

    const showToast = (message: string, type: 'success' | 'error' = 'success') => {
        setToastMessage(message);
        setToastType(type);
        setToastOpen(true);
        try {
            qrInputRef.current?.focus();
            requestAnimationFrame(() => qrInputRef.current?.focus());
            setTimeout(() => qrInputRef.current?.focus(), 50);
        } catch {
            // no-op
        }
    };

    useEffect(() => {
        if (!showEditModal) {
            setTimeout(() => qrInputRef.current?.focus(), 50);
        }
    }, [scannedProducts, showEditModal]);

    useEffect(() => {
        if (open) {
            setQrCode('');
            setQrSearch('');
            setScannedProducts([]);
            setLatestQr(null);
            setSelectedProduct(null);
            setSelectedTags([]);
            setCustomReason('');
            setPoint(0);
            setShowEditModal(false);
            setUpdatedProductIds([]);
            setConfirmingReceive(false);
            setShowClearAllConfirm(false);
            setProductToRemove(null);
            setTimeout(() => qrInputRef.current?.focus(), 100);
        }
    }, [open]);

    const resetModalState = () => {
        setQrCode('');
        setQrSearch('');
        setScannedProducts([]);
        setLatestQr(null);
        setSelectedProduct(null);
        setSelectedTags([]);
        setCustomReason('');
        setPoint(0);
        setShowEditModal(false);
        setUpdatedProductIds([]);
        setConfirmingReceive(false);
        setShowClearAllConfirm(false);
        setProductToRemove(null);
    };

    const getBasePoint = (product: any) => {
        const real = product?.realPoints ?? product?.realPoint;
        const estimate = product?.estimatePoint;
        return Number(real ?? estimate ?? 0);
    };

    const handleScanQR = async (e: React.FormEvent) => {
        e.preventDefault();
        const code = qrCode.trim();
        if (!code) return;

        setLoading(true);
        try {
            if (scannedProducts.some((p) => p.qrCode === code)) {
                showToast('Mã này đã có trong danh sách quét!', 'error');
                setQrCode('');
                return;
            }

            const product = await getProductByQRCode(code);
            const normalizedStatus = product.status?.toLowerCase() || '';
            if (!normalizedStatus.includes('đã thu') && normalizedStatus !== 'collected') {
                showToast('Sản phẩm chưa ở trạng thái đã thu gom!', 'error');
                setQrCode('');
                return;
            }

            const basePoint = getBasePoint(product);
            const newProduct: ScannedProduct = {
                productId: product.productId,
                categoryName: product.categoryName,
                brandName: product.brandName,
                description: product.description,
                qrCode: product.qrCode,
                status: product.status,
                estimatePoint: product.estimatePoint,
                realPoints: product.realPoints,
                realPoint: product.realPoint,
                originalPoint: basePoint,
                pendingPoint: undefined,
                pendingDescription: undefined,
                productImages: product.productImages,
                changedPointMessage: product.changedPointMessage
            };

            setScannedProducts((prev) => [newProduct, ...prev]);
            setLatestQr(newProduct.qrCode);
            setQrCode('');
            setTimeout(() => qrInputRef.current?.focus(), 0);
        } catch (err: any) {
            console.error('Scan QR error', err);
            showToast(err?.message || 'Không tìm thấy sản phẩm với mã này!', 'error');
            setQrCode('');
        } finally {
            setLoading(false);
        }
    };

    const handleEditProduct = async (product: ScannedProduct) => {
        setLoadingTabId(product.productId);
        try {
            const fresh = await getProductById(product.productId);
            const freshBasePoint = getBasePoint(fresh);
            const merged: ScannedProduct = {
                ...product,
                categoryName: fresh.categoryName ?? product.categoryName,
                brandName: fresh.brandName ?? product.brandName,
                description: fresh.description ?? product.description,
                estimatePoint: fresh.estimatePoint ?? product.estimatePoint,
                realPoints: fresh.realPoints ?? product.realPoints,
                realPoint: (fresh as any).realPoint ?? product.realPoint,
                originalPoint: freshBasePoint,
                productImages: fresh.productImages ?? product.productImages,
                changedPointMessage: fresh.changedPointMessage ?? product.changedPointMessage,
            };

            setScannedProducts((prev) =>
                prev.map((p) => (p.productId === product.productId ? merged : p))
            );

            setSelectedProduct(merged);
            setPoint(merged.pendingPoint ?? merged.originalPoint);
        } catch {
            setSelectedProduct(product);
            setPoint(product.pendingPoint ?? product.originalPoint);
        } finally {
            setLoadingTabId(null);
        }

        const descToRestore = product.pendingDescription;
        if (descToRestore) {
            const parts = descToRestore.split('; ');
            const knownTags = REASON_TAGS.filter((t) => t !== 'Khác');
            const savedTags: string[] = [];
            const customParts: string[] = [];
            for (const part of parts) {
                if (knownTags.includes(part)) {
                    savedTags.push(part);
                } else {
                    customParts.push(part);
                    if (!savedTags.includes('Khác')) savedTags.push('Khác');
                }
            }
            setSelectedTags(savedTags);
            setCustomReason(customParts.join('; '));
        } else {
            setSelectedTags([]);
            setCustomReason('');
        }
        setShowEditModal(true);
    };

    const handleSaveEdit = () => {
        if (!selectedProduct) return;

        const isPointChanged = point !== selectedProduct.originalPoint;

        if (isPointChanged) {
            const reasons = selectedTags.filter((t) => t !== 'Khác');
            if (selectedTags.includes('Khác') && customReason.trim()) {
                reasons.push(customReason.trim());
            }
            if (reasons.length === 0) return;

            setScannedProducts((prev) =>
                prev.map((p) =>
                    p.qrCode === selectedProduct.qrCode
                        ? {
                            ...p,
                            pendingPoint: point,
                            pendingDescription: reasons.join('; ')
                        }
                        : p
                )
            );

            setUpdatedProductIds((prev) =>
                prev.includes(selectedProduct.productId)
                    ? prev
                    : [...prev, selectedProduct.productId]
            );
        } else {
            setScannedProducts((prev) =>
                prev.map((p) =>
                    p.qrCode === selectedProduct.qrCode
                        ? {
                            ...p,
                            pendingPoint: undefined,
                            pendingDescription: undefined
                        }
                        : p
                )
            );
            setUpdatedProductIds((prev) =>
                prev.filter((id) => id !== selectedProduct.productId)
            );
        }

        setShowEditModal(false);
        setSelectedProduct(null);
        setSelectedTags([]);
        setCustomReason('');
        setPoint(0);
    };

    const removeProductFromList = (product: ReceiveScannedProduct) => {
        setScannedProducts((prev) =>
            prev.filter((p) => p.productId !== product.productId)
        );
        setUpdatedProductIds((prev) =>
            prev.filter((id) => id !== product.productId)
        );
        if (latestQr === product.qrCode) setLatestQr(null);
    };

    const handleRequestRemoveProduct = (product: ReceiveScannedProduct) => {
        setProductToRemove(product);
    };

    const handleConfirmRemoveProduct = () => {
        if (!productToRemove) return;
        removeProductFromList(productToRemove);
        setProductToRemove(null);
    };

    const handleConfirmReceive = async () => {
        if (scannedProducts.length === 0 || confirmingReceive) return;

        const payload = scannedProducts.map((p) => {
            const changedPoint = p.pendingPoint;
            const isChanged = changedPoint !== undefined && changedPoint !== p.originalPoint;
            return {
                qrCode: p.qrCode,
                point: isChanged ? changedPoint! : null,
                description: isChanged ? (p.pendingDescription || '') : null
            };
        });

        setConfirmingReceive(true);
        try {
            await onConfirm(payload);
        } catch (err: any) {
            console.error('confirm receive error', err);
            showToast(err?.message || 'Xác nhận nhận đơn vị thu gom thất bại', 'error');
        } finally {
            setConfirmingReceive(false);
        }
    };

    const handleRequestClose = () => {
        if (scannedProducts.length > 0) {
            setShowClearAllConfirm(true);
        } else {
            // nothing to clear, just close
            resetModalState();
            onClose();
        }
    };

    const handleConfirmClose = () => {
        resetModalState();
        onClose();
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
        setSelectedProduct(null);
        setSelectedTags([]);
        setCustomReason('');
        setPoint(0);
    };

    const normalizedQrSearch = qrSearch.trim().toLowerCase();
    const displayedProducts = normalizedQrSearch
        ? scannedProducts.filter((p) => (p.qrCode || '').toLowerCase().includes(normalizedQrSearch))
        : scannedProducts;

    if (!open) return null;

    return (
        <>
            <Toast
                open={toastOpen}
                type={toastType}
                message={toastMessage}
                onClose={() => setToastOpen(false)}
                duration={2500}
            />

            <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
                <div className='absolute inset-0 bg-black/30 backdrop-blur-sm' />

                <div className='relative w-full max-w-7xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[90vh] animate-fadeIn'>
                    <div className='flex justify-between items-center p-6 border-b bg-linear-to-r from-primary-50 to-primary-100 border-primary-100'>
                        <div>
                            <h2 className='text-2xl font-bold text-gray-900'>Nhận hàng từ nhân viên thu gom</h2>
                        </div>
                        <button
                            onClick={handleRequestClose}
                            className='text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer transition'
                        >
                            <X size={28} />
                        </button>
                    </div>

                    <div className='flex-1 p-6 space-y-6 bg-gray-50 overflow-y-auto'>
                        <div className='bg-white rounded-xl p-4 shadow-sm border border-transparent'>
                            <label className='block text-sm font-medium text-gray-700 mb-2'>
                                Mã sản phẩm <span className='text-red-500'>*</span>
                            </label>
                            <div className='flex flex-col md:flex-row gap-3'>
                                <form onSubmit={handleScanQR} className='flex gap-2 flex-1'>
                                    <div className='relative flex-1'>
                                        <input
                                            ref={qrInputRef}
                                            type='text'
                                            value={qrCode}
                                            onChange={(e) => setQrCode(e.target.value)}
                                            placeholder='Quét hoặc nhập mã QR...'
                                            disabled={loading}
                                            className='w-full pl-10 pr-4 py-2 border border-primary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 placeholder-gray-400 disabled:bg-gray-100'
                                            autoComplete='off'
                                        />
                                        <PackageIcon
                                            className='absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400'
                                            size={18}
                                        />
                                    </div>
                                    <button
                                        type='submit'
                                        disabled={loading}
                                        className='px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer'
                                    >
                                        {loading ? <Loader2 className='w-5 h-5 animate-spin' /> : <ArrowRight className='w-5 h-5' />}
                                    </button>
                                </form>

                                <div className='w-full md:w-[320px]'>
                                    <SearchBox
                                        value={qrSearch}
                                        onChange={setQrSearch}
                                        placeholder='Tìm theo mã QR trong danh sách...'
                                        debounce={200}
                                    />
                                </div>
                            </div>
                        </div>

                        <ReceiveProductList
                            products={displayedProducts}
                            loadingTabId={loadingTabId}
                            latestQr={latestQr}
                            updatedProductIds={updatedProductIds}
                            onEdit={(product) => handleEditProduct(product as ScannedProduct)}
                            onRemove={handleRequestRemoveProduct}
                            maxHeight={32}
                        />
                    </div>

                    <div className='flex justify-between items-center p-6 border-t border-primary-100 bg-white'>
                        <span className='text-gray-700 text-base'>
                            {scannedProducts.length} sản phẩm đã thêm
                        </span>
                        <button
                            onClick={handleConfirmReceive}
                            disabled={confirmingReceive || scannedProducts.length === 0}
                            className='px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer shadow-md'
                        >
                            {confirmingReceive ? <Loader2 className='w-4 h-4 animate-spin' /> : 'Xác nhận'}
                        </button>
                    </div>
                </div>

                <style jsx>{`
                    @keyframes fadeIn {
                        from {
                            opacity: 0;
                            transform: scale(0.95);
                        }
                        to {
                            opacity: 1;
                            transform: scale(1);
                        }
                    }
                    .animate-fadeIn {
                        animation: fadeIn 0.2s ease-out;
                    }
                `}</style>
            </div>

            {showEditModal && selectedProduct && (
                <div className='fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4'>
                    <div className='absolute inset-0 bg-black/30 backdrop-blur-sm'></div>

                    <div className='relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[90vh] animate-fadeIn'>
                        <div className='flex justify-between items-center p-6 border-b border-gray-100 bg-linear-to-r from-primary-50 to-primary-100'>
                            <div>
                                <h2 className='text-2xl font-bold text-gray-900'>Chi tiết sản phẩm</h2>
                                <p className='text-sm text-gray-600 mt-1'>Xác nhận và cập nhật điểm sản phẩm</p>
                            </div>
                            <button
                                onClick={handleCloseEditModal}
                                className='text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer transition'
                            >
                                <X size={28} />
                            </button>
                        </div>

                        <div className='flex-1 overflow-y-auto p-6 space-y-4 bg-white'>
                            <div className='bg-white rounded-xl p-4 shadow-sm border border-primary-200'>
                                <div className='flex items-center gap-2 mb-3'>
                                    <PackageIcon className='text-primary-600' size={20} />
                                    <h3 className='text-lg font-semibold text-gray-900'>Thông tin sản phẩm</h3>
                                </div>
                                <div className='flex gap-4 items-start'>
                                    {selectedProduct.productImages && selectedProduct.productImages.length > 0 && (
                                        <div
                                            className='w-20 h-20 bg-gray-100 rounded-lg overflow-hidden shadow-sm shrink-0 cursor-pointer'
                                            onClick={() => setZoomImg(selectedProduct.productImages![0])}
                                        >
                                            <img
                                                src={selectedProduct.productImages[0]}
                                                alt={selectedProduct.categoryName}
                                                className='w-full h-full object-cover'
                                            />
                                        </div>
                                    )}
                                    {zoomImg && (
                                        <div
                                            className='fixed inset-0 z-70 flex items-center justify-center bg-black/70 cursor-pointer'
                                            onClick={() => setZoomImg(null)}
                                        >
                                            <img
                                                src={zoomImg}
                                                alt='Zoom'
                                                className='max-w-[90vw] max-h-[90vh] rounded-xl shadow-2xl border-4 border-white object-contain'
                                            />
                                        </div>
                                    )}
                                    <div className='flex-1 space-y-2'>
                                        <div className='flex items-center gap-8'>
                                            <div className='flex items-center w-1/2'>
                                                <span className='text-sm text-gray-500 w-28 block'>Mã sản phẩm:</span>
                                                <span className='text-base font-semibold text-gray-900 flex-1 break-all'>{selectedProduct.qrCode}</span>
                                            </div>
                                            <div className='flex items-center w-1/2'>
                                                <span className='text-sm text-gray-500 w-24 block'>Danh mục:</span>
                                                <span className='text-base font-semibold text-gray-900 flex-1 break-all'>{selectedProduct.categoryName}</span>
                                            </div>
                                        </div>
                                        <div className='flex items-center gap-8'>
                                            <div className='flex items-center w-1/2'>
                                                <span className='text-sm text-gray-500 w-28 block'>Thương hiệu:</span>
                                                <span className='text-base font-medium text-gray-900 flex-1 break-all'>{selectedProduct.brandName}</span>
                                            </div>
                                            <div className='flex items-center w-1/2'>
                                                <span className='text-sm text-gray-500 w-28 block'>Điểm</span>
                                                <CustomNumberInput
                                                    value={point}
                                                    onChange={setPoint}
                                                    min={0}
                                                    className='w-28 px-2 py-1 border border-primary-300 rounded-lg text-primary-700 font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent'
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {selectedProduct.description && (
                                    <div className='mt-3 pt-3 border-t border-gray-100'>
                                        <span className='text-sm text-gray-500'>Ghi chú:</span>
                                        <span className='ml-2 text-gray-700 text-sm'>{selectedProduct.description}</span>
                                    </div>
                                )}

                                {selectedProduct.changedPointMessage && (
                                    <div className='mt-3 pt-3 border-t border-gray-100'>
                                        <span className='text-sm text-gray-500'>Ghi chú điểm:</span>
                                        <span className='ml-2 text-gray-700 text-sm'>{selectedProduct.changedPointMessage}</span>
                                    </div>
                                )}
                            </div>

                            {point !== selectedProduct.originalPoint && (
                                <div className='bg-white rounded-xl p-4 shadow-sm border border-primary-200'>
                                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                                        Lý do đổi điểm <span className='text-red-500'>*</span>
                                    </label>
                                    <div className='flex flex-wrap gap-2 mb-2 items-center'>
                                        {REASON_TAGS.slice(0, 3).map((tag) => {
                                            const isSelected = selectedTags.includes(tag);
                                            return (
                                                <button
                                                    type='button'
                                                    key={tag}
                                                    className={`px-3 py-1 rounded-full border text-xs font-medium transition-colors cursor-pointer ${
                                                        isSelected
                                                            ? 'bg-primary-100 border-primary-500 text-primary-700'
                                                            : 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-primary-50'
                                                    }`}
                                                    onClick={() => {
                                                        if (isSelected) {
                                                            setSelectedTags(selectedTags.filter((t) => t !== tag));
                                                        } else {
                                                            setSelectedTags([...selectedTags, tag]);
                                                        }
                                                    }}
                                                >
                                                    {tag}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <div className='flex gap-2 mb-2'>
                                        {(() => {
                                            const tag = REASON_TAGS[3];
                                            const isSelected = selectedTags.includes(tag);
                                            return (
                                                <button
                                                    type='button'
                                                    key={tag}
                                                    className={`px-3 py-1 rounded-full border text-xs font-medium transition-colors cursor-pointer ${
                                                        isSelected
                                                            ? 'bg-primary-100 border-primary-500 text-primary-700'
                                                            : 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-primary-50'
                                                    }`}
                                                    onClick={() => {
                                                        if (isSelected) {
                                                            setSelectedTags(selectedTags.filter((t) => t !== tag));
                                                            setCustomReason('');
                                                        } else {
                                                            setSelectedTags([...selectedTags, tag]);
                                                        }
                                                    }}
                                                >
                                                    {tag}
                                                </button>
                                            );
                                        })()}
                                    </div>

                                    {selectedTags.includes('Khác') && (
                                        <CustomTextarea
                                            value={customReason}
                                            onChange={setCustomReason}
                                            placeholder='Nhập lý do tại sao thay đổi điểm...'
                                            rows={3}
                                        />
                                    )}
                                </div>
                            )}
                        </div>

                        <div className='flex justify-end items-center gap-3 p-5 border-t border-primary-100 bg-white'>
                            <button
                                onClick={handleSaveEdit}
                                disabled={
                                    point !== selectedProduct.originalPoint &&
                                    (selectedTags.length === 0 ||
                                        (selectedTags.includes('Khác') &&
                                            selectedTags.length === 1 &&
                                            !customReason.trim()))
                                }
                                className='px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium disabled:bg-gray-300 disabled:cursor-not-allowed cursor-pointer'
                            >
                                Xác nhận
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <ConfirmDeleteModal
                open={showClearAllConfirm}
                title='Xác nhận xóa tất cả'
                message={
                    <>
                        <span>Bạn có chắc chắn muốn xóa toàn bộ </span>
                        <span className="font-bold text-primary-600">{scannedProducts.length}</span>
                        <span> sản phẩm đã quét không?</span>
                    </>
                }
                onClose={() => setShowClearAllConfirm(false)}
                onConfirm={handleConfirmClose}
            />

            <ConfirmDeleteModal
                open={!!productToRemove}
                title='Xác nhận xóa sản phẩm'
                message={
                    <>
                        <span>Bạn có chắc chắn muốn xóa sản phẩm có mã QR: </span>
                        <span className="font-bold text-primary-600">{productToRemove?.qrCode || ''}</span>
                        <span>?</span>
                    </>
                }
                onClose={() => setProductToRemove(null)}
                onConfirm={handleConfirmRemoveProduct}
            />
        </>
    );
};

export default ReceiveProduct;
