'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useGroupingContext } from '@/contexts/collection-point/GroupingContext';
import ProductList from './ProductList';
import Pagination from '@/components/ui/Pagination';
import UnassignedProductsModal from './modal/UnassignedProductsModal';
import VehicleSelectionModal from './modal/VehicleSelectionModal';
import ConfirmCloseModal from './modal/ConfirmCloseModal';
import {
    UNASSIGNED_PRODUCTS_DEFAULT_REASON,
    UNASSIGNED_PRODUCTS_REASON_OPTIONS
} from './modal/UnassignedProductsFilter';
import VehicleQuickSelectModal from './modal/VehicleQuickSelectModal';
import { formatDate } from '@/utils/FormatDate';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface AssignDayStepProps {
    loading: boolean;
    workDate: string;
    loadThreshold: number;
    onCreateGrouping: (assignments: {
        workDate: string;
        vehicleId: string;
        productIds: string[];
    }[]) => void;
    onBack: () => void;
    calculateRoute: (saveResult: boolean) => Promise<void>;
    onReSuggestWithVehicles: (vehicleIds: string[]) => Promise<void>;
}

const AssignDayStep: React.FC<AssignDayStepProps> = ({
    loading,
    workDate,
    loadThreshold,
    onCreateGrouping,
    onBack,
    calculateRoute,
    onReSuggestWithVehicles
}) => {
    const router = useRouter();
    const { 
        fetchPreviewVehicles, 
        previewVehicles, 
        preAssignResult,
        fetchPreviewProducts, 
        previewProductsPaging,
        fetchAllPreviewProductIds,
        unassignedProducts,
        unassignedProductsData,
        unassignedProductsLoading,
        fetchUnassignedProducts,
        getUnassignedProductsTotalByReason,
        fetchAvailableVehiclesForDraft
    } = useGroupingContext();
    
    const [selectedVehicleIndex, setSelectedVehicleIndex] = useState<number>(0);
    const [productPage, setProductPage] = useState(1);
    const [createDisabled, setCreateDisabled] = useState(false);
    const [showUnassignedModal, setShowUnassignedModal] = useState(false);
    const [unassignedPage, setUnassignedPage] = useState(1);
    const [showAllVehiclesModal, setShowAllVehiclesModal] = useState(false);
    const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);
    const [remainingVehicles, setRemainingVehicles] = useState<any[]>([]);
    const [selectedAdditionalVehicleIds, setSelectedAdditionalVehicleIds] = useState<string[]>([]);
    const [loadingRemainingVehicles, setLoadingRemainingVehicles] = useState(false);
    const [confirmingAdditionalVehicles, setConfirmingAdditionalVehicles] = useState(false);
    const [showCloseAddVehicleConfirm, setShowCloseAddVehicleConfirm] = useState(false);
    const [selectedUnassignedReason, setSelectedUnassignedReason] = useState<string>(
        UNASSIGNED_PRODUCTS_DEFAULT_REASON
    );
    const [deadlineUnassignedCount, setDeadlineUnassignedCount] = useState(0);
    const [reasonCountMap, setReasonCountMap] = useState<Record<string, number>>({});
    const itemsPerPage = 10;
    const visibleVehicles = previewVehicles.slice(0, 8);
    const preAssignDeadlineMessage =
        preAssignResult?.criticalGapSuggestion?.message || preAssignResult?.message;
    const deadlineSummaryMessage =
        selectedUnassignedReason === UNASSIGNED_PRODUCTS_DEFAULT_REASON
            ? preAssignDeadlineMessage
            : undefined;

    const sanitizeDeadlineSummaryMessageForDisplay = (message?: string) => {
        const raw = String(message || '').trim();
        if (!raw) return undefined;

        const colonIndex = raw.indexOf(':');
        if (colonIndex === -1) return raw;

        const afterColon = raw.slice(colonIndex + 1);
        const hasPlateNumber = /\b\d{2}[A-Z]{1,2}-\d{3,5}(?:\.\d{2})?\b/i.test(afterColon);
        if (!hasPlateNumber) return raw;

        return raw.slice(0, colonIndex).trim();
    };

    const deadlineSummaryMessageForDisplay = sanitizeDeadlineSummaryMessageForDisplay(
        deadlineSummaryMessage
    );

    const parseSuggestedAdditionalVehicleCount = (): number => {
        const suggestion = preAssignResult?.criticalGapSuggestion;
        if (!suggestion) return 0;

        const candidateValues = [
            suggestion?.suggestedVehicleCount,
            suggestion?.recommendedVehicleCount,
            suggestion?.additionalVehicleCount,
            suggestion?.requiredVehicleCount,
            suggestion?.totalSuggestedVehicles,
            suggestion?.count,
            suggestion?.needVehicleCount
        ];

        for (const value of candidateValues) {
            const normalized = Number(value);
            if (Number.isFinite(normalized) && normalized > 0) {
                return Math.floor(normalized);
            }
        }

        const message = String(suggestion?.message || preAssignResult?.message || '');
        const match = message.match(/(\d+)\s*xe/i);
        if (!match) return 0;

        const fromMessage = Number(match[1]);
        return Number.isFinite(fromMessage) && fromMessage > 0 ? fromMessage : 0;
    };

    const suggestedAdditionalVehicleCount = parseSuggestedAdditionalVehicleCount();

    const parseSuggestedVehiclePlates = (): string[] => {
        const message = String(
            preAssignResult?.criticalGapSuggestion?.message ||
            preAssignResult?.message ||
            ''
        );

        if (!message) return [];

        // Example: "... tối ưu: 50KT-666.77, 51C-775.33, ..."
        const matches = message.match(/\b\d{2}[A-Z]{1,2}-\d{3,5}(?:\.\d{2})?\b/gi) || [];
        const normalized = matches
            .map((plate) => String(plate).trim().toUpperCase())
            .filter(Boolean);
        return Array.from(new Set(normalized));
    };

    const suggestedVehiclePlates = parseSuggestedVehiclePlates();

    // Fetch vehicles on mount
    useEffect(() => {
        fetchPreviewVehicles(workDate);
    }, [workDate, fetchPreviewVehicles]);

    // Fetch unassigned count for button badge
    useEffect(() => {
        setUnassignedPage(1);
        fetchUnassignedProducts(workDate, 1, 10, selectedUnassignedReason);
    }, [workDate, fetchUnassignedProducts, selectedUnassignedReason]);

    // Keep the latest total for deadline reason to show in close confirmation.
    useEffect(() => {
        if (selectedUnassignedReason === UNASSIGNED_PRODUCTS_DEFAULT_REASON) {
            setDeadlineUnassignedCount(unassignedProductsData?.total || 0);
        }
    }, [selectedUnassignedReason, unassignedProductsData]);

    useEffect(() => {
        setDeadlineUnassignedCount(0);
    }, [workDate]);

    const refreshReasonCounts = useCallback(async () => {
        const entries = await Promise.all(
            UNASSIGNED_PRODUCTS_REASON_OPTIONS.map(async (option) => {
                const total = await getUnassignedProductsTotalByReason(workDate, option.reason);
                return [option.reason, total] as const;
            })
        );

        setReasonCountMap(Object.fromEntries(entries));
    }, [workDate, getUnassignedProductsTotalByReason]);

    useEffect(() => {
        refreshReasonCounts();
    }, [refreshReasonCounts]);

    useEffect(() => {
        setReasonCountMap((prev) => ({
            ...prev,
            [selectedUnassignedReason]: Number(unassignedProductsData?.total || 0)
        }));
    }, [selectedUnassignedReason, unassignedProductsData]);

    // Get current selected vehicle
    const currentVehicle = previewVehicles[selectedVehicleIndex];

    // Fetch preview products when vehicle or page changes
    useEffect(() => {
        if (currentVehicle) {
            const vehicleId = currentVehicle.vehicleId?.toString() || currentVehicle.id?.toString();
            if (vehicleId) {
                fetchPreviewProducts(vehicleId, workDate, productPage, itemsPerPage);
            }
        }
    }, [currentVehicle, workDate, productPage, fetchPreviewProducts]);

    // Fetch all preview product IDs when vehicle changes
    useEffect(() => {
        if (currentVehicle) {
            const vehicleId = currentVehicle.vehicleId?.toString() || currentVehicle.id?.toString();
            if (vehicleId) {
                fetchAllPreviewProductIds(vehicleId, workDate);
            }
        }
    }, [currentVehicle, workDate, fetchAllPreviewProductIds]);

    // Use data from API preview
    const displayProducts = previewProductsPaging?.products || [];
    const totalPages = previewProductsPaging?.totalPages || 1;

    const normalizeVehicleId = (vehicleData: any): string => {
        return String(vehicleData?.vehicleId ?? vehicleData?.id ?? '');
    };

    const normalizeVehicleForSelection = (vehicleData: any) => {
        return {
            vehicleId: normalizeVehicleId(vehicleData),
            plate_Number: vehicleData?.plate_Number || vehicleData?.plateNumber || vehicleData?.vehicleName || 'N/A',
            vehicle_Type: vehicleData?.vehicle_Type || vehicleData?.vehicleType || 'N/A',
            capacity_Kg: Number(vehicleData?.capacity_Kg ?? vehicleData?.capacityKg ?? 0),
            length_M: vehicleData?.length_M,
            width_M: vehicleData?.width_M,
            height_M: vehicleData?.height_M,
            status: vehicleData?.status || ''
        };
    };

    const handleCreateGrouping = async () => {
        setCreateDisabled(true);
        try {
            // Fetch all products for each vehicle to get productIds
            const assignmentsPromises = previewVehicles.map(async (vehicleData: any) => {
                const vehicleId = vehicleData.vehicleId?.toString() || vehicleData.id?.toString();
                
                // Fetch all products for this vehicle (using large pageSize to get all at once)
                const totalProduct = vehicleData.totalProduct || 0;
                if (totalProduct > 0) {
                    const response = await fetchPreviewProducts(vehicleId, workDate, 1, totalProduct);
                    const productIds = response?.products?.map((p: any) => p.productId) || [];
                    
                    return {
                        workDate: workDate,
                        vehicleId: vehicleId,
                        productIds: productIds
                    };
                } else {
                    return {
                        workDate: workDate,
                        vehicleId: vehicleId,
                        productIds: []
                    };
                }
            });
            
            const assignments = await Promise.all(assignmentsPromises);
            
            console.log(`Đang tạo nhóm cho ${assignments.length} xe cùng lúc`, assignments);
            
            // Call API to create grouping
            await onCreateGrouping(assignments);
            
            // Calculate route and redirect
            await calculateRoute(true);
            router.push("/collection-point/grouping/list");
        } catch (error) {
            console.error('Error creating grouping:', error);
        } finally {
            setCreateDisabled(false);
        }
    };

    const handleShowUnassignedProducts = () => {
        setShowUnassignedModal(true);
        fetchUnassignedProducts(workDate, unassignedPage, 10, selectedUnassignedReason);
    };

    const handleUnassignedPageChange = (page: number) => {
        setUnassignedPage(page);
        fetchUnassignedProducts(workDate, page, 10, selectedUnassignedReason);
    };

    const handleUnassignedReasonChange = (reason: string) => {
        setSelectedUnassignedReason(reason);
        setUnassignedPage(1);
        fetchUnassignedProducts(workDate, 1, 10, reason);
    };

    const handleOpenAddVehicleModal = async () => {
        setLoadingRemainingVehicles(true);
        try {
            const vehicles = await fetchAvailableVehiclesForDraft(workDate);
            const normalizedRemainingVehicles = (vehicles || []).map(normalizeVehicleForSelection);
            const remainingIds = normalizedRemainingVehicles
                .map((vehicle: any) => String(vehicle?.vehicleId || ''))
                .filter((vehicleId: string) => vehicleId.length > 0);

            const suggestedPlateSet = new Set(suggestedVehiclePlates);
            const suggestedIds = suggestedVehiclePlates.length > 0
                ? normalizedRemainingVehicles
                    .filter((vehicle: any) => suggestedPlateSet.has(String(vehicle?.plate_Number || '').trim().toUpperCase()))
                    .map((vehicle: any) => String(vehicle?.vehicleId || ''))
                    .filter((vehicleId: string) => vehicleId.length > 0)
                : [];

            const shouldAutoSelectAllRemaining =
                suggestedAdditionalVehicleCount > 0 &&
                remainingIds.length > 0 &&
                remainingIds.length < suggestedAdditionalVehicleCount;

            setRemainingVehicles(normalizedRemainingVehicles);
            setSelectedAdditionalVehicleIds(
                suggestedIds.length > 0
                    ? suggestedIds
                    : (shouldAutoSelectAllRemaining ? remainingIds : [])
            );
            setShowAddVehicleModal(true);
        } catch (error) {
            console.error('Error loading remaining vehicles:', error);
            setRemainingVehicles([]);
            setSelectedAdditionalVehicleIds([]);
            setShowAddVehicleModal(true);
        } finally {
            setLoadingRemainingVehicles(false);
        }
    };

    const handleToggleAdditionalVehicle = (vehicleId: string) => {
        const normalizedId = String(vehicleId);
        setSelectedAdditionalVehicleIds((prev) =>
            prev.includes(normalizedId)
                ? prev.filter((id) => id !== normalizedId)
                : [...prev, normalizedId]
        );
    };

    const handleToggleAllAdditionalVehicles = () => {
        const allSelected =
            remainingVehicles.length > 0 &&
            remainingVehicles.every((vehicle) =>
                selectedAdditionalVehicleIds.includes(vehicle.vehicleId)
            );

        if (allSelected) {
            setSelectedAdditionalVehicleIds([]);
            return;
        }

        setSelectedAdditionalVehicleIds(
            remainingVehicles
                .map((vehicle) => String(vehicle.vehicleId || ''))
                .filter((vehicleId) => vehicleId.length > 0)
        );
    };

    const handleConfirmAddVehicles = async (vehicleIds: string[]) => {
        if (vehicleIds.length === 0) return;

        setConfirmingAdditionalVehicles(true);
        try {
            const currentVehicleIds = previewVehicles
                .map((vehicleData: any) => normalizeVehicleId(vehicleData))
                .filter((vehicleId: string) => vehicleId.length > 0);

            const mergedVehicleIds = Array.from(
                new Set([...currentVehicleIds, ...vehicleIds])
            );

            await onReSuggestWithVehicles(mergedVehicleIds);
            await fetchPreviewVehicles(workDate);
            await refreshReasonCounts();
            setSelectedVehicleIndex(0);
            setProductPage(1);
            setShowAddVehicleModal(false);
            setShowUnassignedModal(false);
        } catch (error) {
            console.error('Error adding vehicles for pre-assign:', error);
        } finally {
            setConfirmingAdditionalVehicles(false);
        }
    };

    const shouldAutoSelectAllRemainingVehicles =
        suggestedAdditionalVehicleCount > 0 &&
        remainingVehicles.length > 0 &&
        remainingVehicles.length < suggestedAdditionalVehicleCount;

    const shouldRequireExactAdditionalSelection =
        suggestedAdditionalVehicleCount > 0 &&
        remainingVehicles.length >= suggestedAdditionalVehicleCount;

    const unassignedProductsTotalCount = Object.values(reasonCountMap).reduce(
        (sum, count) => sum + Number(count || 0),
        0
    );

    const deadlineReasonCount = reasonCountMap[UNASSIGNED_PRODUCTS_DEFAULT_REASON] ?? deadlineUnassignedCount;
    const vehicleFullReasonOption = UNASSIGNED_PRODUCTS_REASON_OPTIONS.find(
        (option) => option.id === 'vehicle-full'
    );
    const vehicleFullReasonCount = vehicleFullReasonOption
        ? (reasonCountMap[vehicleFullReasonOption.reason] ?? 0)
        : 0;

    const reasonOptionsWithCount = UNASSIGNED_PRODUCTS_REASON_OPTIONS.map((option) => {
        if (option.id === 'deadline-no-vehicle') {
            return { ...option, count: deadlineReasonCount };
        }

        if (option.id === 'vehicle-full') {
            return { ...option, count: vehicleFullReasonCount };
        }

        return { ...option, count: 0 };
    });

    const handleRequestCloseAddVehicleModal = () => {
        setShowCloseAddVehicleConfirm(true);
    };

    const handleCancelCloseAddVehicleModal = () => {
        setShowCloseAddVehicleConfirm(false);
    };

    const handleConfirmCloseAddVehicleModal = () => {
        setShowCloseAddVehicleConfirm(false);
        setShowAddVehicleModal(false);
        setSelectedAdditionalVehicleIds([]);
    };

    return (
        <div className='space-y-2'>
            {/* Header */}
            <div className='flex flex-col md:flex-row md:items-center md:justify-between gap-2 bg-gray-50 rounded-lg px-2 py-2'>
                <div className='flex items-center gap-4'>
                    <h2 className='text-lg font-bold text-gray-900 mb-0'>
                        Bước 2: Tạo nhóm thu gom - {formatDate(workDate)}
                    </h2>
                    <button
                        onClick={handleShowUnassignedProducts}
                        className='px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors flex items-center gap-2'
                    >
                        <AlertTriangle size={18} />
                        Xem sản phẩm chưa được chia ({unassignedProductsTotalCount})
                    </button>
                </div>
                <button
                    onClick={onBack}
                    className='px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors'
                >
                    ← Quay lại
                </button>
            </div>

            {/* Filter bar for vehicles */}
            {previewVehicles.length > 0 && (
                <div className='flex items-center gap-2 bg-white rounded-lg px-4 py-3 shadow-sm border border-gray-100 overflow-x-auto'>
                    <span className='text-sm font-semibold text-gray-700 whitespace-nowrap mr-2'>Chọn xe:</span>
                    {visibleVehicles.map((vehicleData: any, index: number) => {
                        const vehicleId = vehicleData.vehicleId || vehicleData.id;
                        const plateNumber = vehicleData.plateNumber || vehicleData.plate_Number || vehicleData.vehicleName || 'N/A';
                        
                        return (
                            <button
                                key={`${vehicleId}-${index}`}
                                onClick={() => {
                                    setSelectedVehicleIndex(index);
                                    setProductPage(1); // Reset page when vehicle changes
                                }}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer whitespace-nowrap ${
                                    selectedVehicleIndex === index
                                        ? 'bg-primary-600 text-white shadow-md'
                                        : 'bg-gray-100 text-gray-700 hover:bg-primary-50'
                                }`}
                            >
                                {plateNumber}
                            </button>
                        );
                    })}
                    {previewVehicles.length > 8 && (
                        <button
                            onClick={() => setShowAllVehiclesModal(true)}
                            className='px-4 py-2 rounded-lg text-sm font-medium bg-primary-50 text-primary-700 hover:bg-primary-100 transition-colors cursor-pointer whitespace-nowrap border border-primary-200'
                        >
                            Xem tất cả ({previewVehicles.length})
                        </button>
                    )}
                </div>
            )}

            {/* Current vehicle info and products */}
            {currentVehicle && (
                <>
                    {/* Vehicle Header Card */}
                    <div className='bg-primary-50 p-4 rounded-lg'>
                        <div className='flex items-center justify-between gap-2 flex-wrap'>
                            <div className='flex items-center gap-3 flex-1'>
                                <div className='w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center shadow-md'>
                                    <svg className='w-6 h-6 text-white' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' />
                                    </svg>
                                </div>
                                <div className='flex-1'>
                                    <div className='flex items-center gap-4 flex-wrap'>
                                        <h2 className='text-lg font-bold text-gray-900'>
                                            Bước 2: Phân chia xe - {formatDate(workDate)}
                                        </h2>
                                        <span className='text-sm text-gray-600 flex items-center gap-1'>
                                            <strong>Loại xe:</strong> {currentVehicle.vehicleType || currentVehicle.vehicle_Type || 'N/A'}
                                        </span>
                                    </div>
                                    <div className='flex items-center gap-4 mt-1 text-sm'>
                                        <span className='text-primary-600 font-semibold'>
                                            {previewProductsPaging?.totalProduct || currentVehicle.totalProduct || 0} sản phẩm
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className='flex items-center gap-2'>
                                <button
                                    onClick={handleCreateGrouping}
                                    className={`px-4 py-2 bg-primary-600 text-white rounded-lg transition cursor-pointer shadow-md font-medium ${loading || createDisabled ? 'opacity-60 cursor-not-allowed' : 'hover:bg-primary-700'}`}
                                    disabled={loading || createDisabled}
                                >
                                    {loading || createDisabled ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Xác nhận'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Products List for this vehicle */}
                    <ProductList
                        products={displayProducts}
                        loading={loading}
                        page={productPage}
                        itemsPerPage={itemsPerPage}
                        showCheckbox={false}
                        maxHeight={33}
                    />
                    
                    {totalPages > 1 && (
                        <Pagination
                            page={productPage}
                            totalPages={totalPages}
                            onPageChange={setProductPage}
                        />
                    )}
                </>
            )}

            {/* No vehicles message */}
            {previewVehicles.length === 0 && (
                <div className='bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center'>
                    <p className='text-gray-500'>Không có xe nào được gợi ý cho ngày này.</p>
                </div>
            )}

            {/* Unassigned Products Modal */}
            <UnassignedProductsModal
                open={showUnassignedModal}
                onClose={() => setShowUnassignedModal(false)}
                products={unassignedProducts}
                loading={unassignedProductsLoading}
                totalPages={Math.ceil((unassignedProductsData?.total || 0) / 10)}
                currentPage={unassignedPage}
                onPageChange={handleUnassignedPageChange}
                totalCount={unassignedProductsData?.total || 0}
                reasonOptions={reasonOptionsWithCount}
                selectedReason={selectedUnassignedReason}
                onReasonChange={handleUnassignedReasonChange}
                deadlineUnassignedCount={deadlineUnassignedCount}
                summaryMessage={deadlineSummaryMessageForDisplay}
                onAddRemainingVehicles={handleOpenAddVehicleModal}
                addVehiclesLoading={loadingRemainingVehicles}
            />

            <VehicleQuickSelectModal
                open={showAllVehiclesModal}
                onClose={() => setShowAllVehiclesModal(false)}
                vehicles={previewVehicles}
                selectedVehicleIndex={selectedVehicleIndex}
                onSelectVehicle={(index) => {
                    setSelectedVehicleIndex(index);
                    setProductPage(1);
                    setShowAllVehiclesModal(false);
                }}
            />

            <VehicleSelectionModal
                open={showAddVehicleModal}
                onClose={handleRequestCloseAddVehicleModal}
                onConfirm={handleConfirmAddVehicles}
                vehicles={remainingVehicles}
                loading={loadingRemainingVehicles}
                selectedVehicleIds={selectedAdditionalVehicleIds}
                onToggleSelect={handleToggleAdditionalVehicle}
                onToggleSelectAll={handleToggleAllAdditionalVehicles}
                loadThreshold={loadThreshold}
                confirming={confirmingAdditionalVehicles}
                suggestedPlateNumbers={suggestedVehiclePlates}
                requiredSelectionCount={
                    shouldRequireExactAdditionalSelection ? suggestedAdditionalVehicleCount : undefined
                }
                lockSelection={shouldAutoSelectAllRemainingVehicles}
                lockSelectionMessage={
                    shouldAutoSelectAllRemainingVehicles
                        ? `Hệ thống tự chọn tất cả ${remainingVehicles.length} xe còn lại vì thấp hơn mức gợi ý ${suggestedAdditionalVehicleCount} xe.`
                        : undefined
                }
            />

            <ConfirmCloseModal
                open={showCloseAddVehicleConfirm}
                deadlineUnassignedCount={0}
                title='Xác nhận đóng'
                description='Bạn có chắc chắn muốn đóng màn hình chọn xe?\nDanh sách xe đã chọn sẽ bị hủy.'
                confirmText='Xác nhận'
                onConfirm={handleConfirmCloseAddVehicleModal}
                onClose={handleCancelCloseAddVehicleModal}
            />
        </div>
    );
};

export default AssignDayStep;
