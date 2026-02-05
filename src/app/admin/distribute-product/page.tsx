'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getTodayString } from '@/utils/getDayString';
import { useDistributeProductContext } from '@/contexts/admin/DistributeProductContext';
import { useNotificationHub } from '@/hooks/useNotificationHub';
import { useAuth } from '@/hooks/useAuth';
import { Package } from 'lucide-react';
import CustomDatePicker from '@/components/ui/CustomDatePicker';
import Breadcrumb from '@/components/ui/Breadcrumb';
import SelectCompanyModal from '@/components/admin/distribute-product/modal/SelectCompanyModal';
import Pagination from '@/components/ui/Pagination';
import Toast from '@/components/ui/Toast';
import DistributeProductFilter from '@/components/admin/distribute-product/DistributeProductFilter';
import CompanyList from '@/components/admin/distribute-product/CompanyList';
import ProductList from '@/components/admin/distribute-product/ProductList';
import SmallPointList from '@/components/admin/distribute-product/SmallPointList';


const DistributeProductPage: React.FC = () => {
    const router = useRouter();
    const {
        undistributedProducts,
        allUndistributedProductIds,
        companies,
        collectionCompanies,
        scpProducts,
        loading,
        companyLoading,
        collectionCompaniesLoading,
        scpLoading,
        activeFilter,
        setActiveFilter,
        fetchUndistributedProducts,
        updatePagination,
        fetchCompanies,
        fetchCollectionCompanies,
        fetchSCPProducts,
        distributeProductsToDate,
        page,
        setPage,
        totalPages,
        pageSize,
        scpPage,
        setScpPage,
        scpTotalPages,
        clearUndistributedProducts
    } = useDistributeProductContext();

    const distributedTotal = companies && Array.isArray(companies)
        ? companies.reduce((sum: number, c: any) => sum + (c.totalOrders || 0), 0)
        : 0;

    const { user } = useAuth();
    const [selectedDate, setSelectedDate] = useState(getTodayString);
    const [showDistributeModal, setShowDistributeModal] = useState(false);
    const [undistributedCount, setUndistributedCount] = useState(0);
    const [selectedCompanyIds, setSelectedCompanyIds] = useState<string[]>([]);
    const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
    const [distributing, setDistributing] = useState(false);
    const [processing, setProcessing] = useState(() => {
        if (typeof window !== 'undefined') {
            return !!localStorage.getItem('ewise_processing_date');
        }
        return false;
    });
    const [processingDate, setProcessingDate] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('ewise_processing_date') || '';
        }
        return '';
    });
    const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const tableScrollRef = useRef<HTMLDivElement>(null);
    const [selectedCompany, setSelectedCompany] = useState<any>(null);
    const [selectedSCP, setSelectedSCP] = useState<any>(null);
    const [increasedCompanyIds, setIncreasedCompanyIds] = useState<Set<string>>(new Set());
    const [increasedSCPIds, setIncreasedSCPIds] = useState<Set<string>>(new Set());

    // Handle sessionStorage params from notification (no URL params)
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const navDate = sessionStorage.getItem('distribute_nav_date');
        const navFilter = sessionStorage.getItem('distribute_nav_filter');
        const navTrigger = sessionStorage.getItem('distribute_nav_trigger');

        // Only apply if triggered from notification
        if (navTrigger === 'notification') {
            // Clear the trigger immediately
            sessionStorage.removeItem('distribute_nav_trigger');

            // Apply filter first
            if (navFilter === 'distributed') {
                setActiveFilter('distributed');
            }

            // Apply date
            if (navDate) {
                setSelectedDate(navDate);
            }

            // Reset page
            setPage(1);

            // Fetch data with new filter and date
            if (navFilter === 'distributed' && navDate) {
                fetchCompanies(navDate);
            } else if (navDate) {
                fetchUndistributedProducts(navDate, 1, pageSize);
            }

            // Clear navigation params after applying
            sessionStorage.removeItem('distribute_nav_date');
            sessionStorage.removeItem('distribute_nav_filter');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleDistributeCompleted = useCallback((data: any) => {
        console.log('Distribution completed callback:', data);
        
        setProcessing(false);
        setProcessingDate('');
        if (typeof window !== 'undefined') {
            localStorage.removeItem('ewise_processing_date');
            console.log('localStorage cleared');
        }
        
        const { success, failed, totalRequested } = data?.data || {};
        console.log('Stats:', { success, failed, totalRequested });
        
        if (failed === 0) {
            setNotification({
                type: 'success',
                message: `Chia thành công ${success}/${totalRequested} sản phẩm!`
            });
        } else {
            setNotification({
                type: 'error',
                message: `Chia hoàn tất: ${success} thành công, ${failed} thất bại`
            });
        }
        
        // Refresh data
        if (activeFilter === 'undistributed') {
            fetchUndistributedProducts(selectedDate, page, pageSize);
        } else {
            fetchCompanies(selectedDate);
        }
    }, [selectedDate, page, pageSize, activeFilter, fetchUndistributedProducts, fetchCompanies]);

    useNotificationHub({
        onAssignCompleted: handleDistributeCompleted,
        token: typeof window !== 'undefined' ? (localStorage.getItem('ewise_token') || sessionStorage.getItem('ewise_token') || '') : '',
        userId: user?.userId || ''
    });

    const handleDateChange = (date: string) => {
        setSelectedDate(date);
        setPage(1);
        setSelectedProductIds([]);
        setSelectedCompany(null);
        setSelectedSCP(null);
        
        // Check if this date is currently being processed
        const isProcessingThisDate = processingDate && processingDate === date;
        // Always fetch company(distributed) counts for the selected date
        // Fetch undistributed products only when the date is not currently processing
        if (!isProcessingThisDate) {
            fetchUndistributedProducts(date, 1, pageSize);
        } else {
            clearUndistributedProducts();
        }

        // Always fetch companies for distributed counts (so "Đã chia" updates immediately)
        fetchCompanies(date);
    };

    const handleFilterChange = (filter: 'undistributed' | 'distributed') => {
        setActiveFilter(filter);
        setPage(1);
        setSelectedCompany(null);
        setSelectedSCP(null);
        
        // Check if selected date is currently being processed
        const isProcessingThisDate = processingDate && processingDate === selectedDate;
        
        if (filter === 'undistributed') {
            // Don't fetch if this date is being processed
            if (!isProcessingThisDate) {
                fetchUndistributedProducts(selectedDate, 1, pageSize);
            } else {
                // Clear old data when switching to processing date
                clearUndistributedProducts();
            }
        } else {
            fetchCompanies(selectedDate);
        }
    };

    const handleSelectCompany = (company: any) => {
        setSelectedCompany(company);
        setSelectedSCP(null);
    };

    const handleSelectSCP = (scp: any) => {
        setSelectedSCP(scp);
        setScpPage(1);
        fetchSCPProducts(scp.pointId, selectedDate, 1, pageSize);
    };

    const handleBackToCompanies = () => {
        setSelectedSCP(null);
        setScpPage(1);
    };

    const handleBackToFilter = () => {
        setSelectedCompany(null);
        setSelectedSCP(null);
    };

    const handleShowDistributeModal = () => {
        setUndistributedCount(selectedProductIds.length);
        fetchCollectionCompanies();
        setShowDistributeModal(true);
    };

    const handleToggleSelectProduct = (productId: string) => {
        setSelectedProductIds(prev => 
            prev.includes(productId) 
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const handleToggleSelectAllProducts = () => {
        // Check if all products (from all pages) are selected
        const targetIds = allUndistributedProductIds.length > 0 
            ? allUndistributedProductIds 
            : undistributedProducts.map(p => p.productId);
        const allSelected = targetIds.length > 0 && targetIds.every(id => selectedProductIds.includes(id));
        
        if (allSelected) {
            setSelectedProductIds([]);
        } else {
            setSelectedProductIds(targetIds);
        }
    };

    const handleToggleSelectCompany = (companyId: string) => {
        setSelectedCompanyIds(prev => 
            prev.includes(companyId) 
                ? prev.filter(id => id !== companyId)
                : [...prev, companyId]
        );
    };

    const handleToggleSelectAllCompanies = () => {
        if (selectedCompanyIds.length === collectionCompanies.length) {
            setSelectedCompanyIds([]);
        } else {
            setSelectedCompanyIds(collectionCompanies.map(c => c.id));
        }
    };

    // Auto-select all companies when modal opens
    React.useEffect(() => {
        if (showDistributeModal && collectionCompanies.length > 0) {
            setSelectedCompanyIds(collectionCompanies.map(c => c.id));
        }
    }, [showDistributeModal, collectionCompanies]);

    const handleCompanySelectionConfirm = async (companyIds: string[]) => {
        if (companyIds.length === 0 || undistributedCount === 0) return;
        
        setShowDistributeModal(false);
        setDistributing(true);
        
        const dateToProcess = selectedDate;
        console.log('🚀 Starting distribution for date:', dateToProcess);
        
        // Save current company counts snapshot to sessionStorage
        if (typeof window !== 'undefined') {
            const companySnapshot: Record<string, number> = {};
            const scpSnapshot: Record<string, Record<string, number>> = {};
            
            companies.forEach(company => {
                const total = company.totalProducts ?? company.totalOrders ?? 0;
                companySnapshot[company.companyId] = total;
                
                // Save SCP counts for each company
                if (company.smallCollectionPoints && Array.isArray(company.smallCollectionPoints)) {
                    scpSnapshot[company.companyId] = {};
                    company.smallCollectionPoints.forEach((scp: any) => {
                        scpSnapshot[company.companyId][scp.pointId] = scp.totalOrders ?? 0;
                    });
                }
            });
            
            sessionStorage.setItem(`distribute_snapshot_${dateToProcess}`, JSON.stringify(companySnapshot));
            sessionStorage.setItem(`distribute_scp_snapshot_${dateToProcess}`, JSON.stringify(scpSnapshot));
            sessionStorage.setItem('distribute_snapshot_date', dateToProcess);
        }
        
        setProcessing(true);
        setProcessingDate(dateToProcess);
        if (typeof window !== 'undefined') {
            localStorage.setItem('ewise_processing_date', dateToProcess);
        }
        
        // Clear undistributed products
        clearUndistributedProducts();
        setActiveFilter('distributed');
        
        try {
            console.log('📦 Distributing', selectedProductIds.length, 'products to', companyIds.length, 'companies');
            
            await distributeProductsToDate({ 
                workDate: dateToProcess, 
                productIds: selectedProductIds,
                targetCompanyIds: companyIds.length > 0 ? companyIds : undefined
            });
            await fetchCompanies(dateToProcess);
            // Navigate to admin dashboard after successful distribution
            router.push('/admin/dashboard');
        } catch (error) {
            console.error('❌ Distribution error:', error);
            setProcessing(false);
            setProcessingDate('');
            if (typeof window !== 'undefined') {
                localStorage.removeItem('ewise_processing_date');
            }
            setNotification({
                type: 'error',
                message: 'Có lỗi xảy ra khi chia sản phẩm'
            });
        } finally {
            setDistributing(false);
        }
    };

    const handlePageChange = (newPage: number) => {
        // Use updatePagination to change page without fetching data again
        updatePagination(newPage);
        if (tableScrollRef.current) {
            tableScrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handleScpPageChange = (newPage: number) => {
        setScpPage(newPage);
        if (selectedSCP) {
            fetchSCPProducts(selectedSCP.pointId, selectedDate, newPage, pageSize);
        }
    };

    // Compare snapshot with current data to show increase indicators
    React.useEffect(() => {
        if (typeof window === 'undefined' || activeFilter !== 'distributed' || companies.length === 0) return;
        
        const snapshotDate = sessionStorage.getItem('distribute_snapshot_date');
        if (snapshotDate !== selectedDate) {
            setIncreasedCompanyIds(new Set());
            setIncreasedSCPIds(new Set());
            return;
        }
        
        const snapshotStr = sessionStorage.getItem(`distribute_snapshot_${selectedDate}`);
        const scpSnapshotStr = sessionStorage.getItem(`distribute_scp_snapshot_${selectedDate}`);
        
        if (!snapshotStr) {
            setIncreasedCompanyIds(new Set());
            setIncreasedSCPIds(new Set());
            return;
        }
        
        try {
            const snapshot: Record<string, number> = JSON.parse(snapshotStr);
            const scpSnapshot: Record<string, Record<string, number>> = scpSnapshotStr ? JSON.parse(scpSnapshotStr) : {};
            
            const increasedCompanies = new Set<string>();
            const increasedSCPs = new Set<string>();
            
            companies.forEach(company => {
                const currentTotal = company.totalProducts ?? company.totalOrders ?? 0;
                const previousTotal = snapshot[company.companyId] ?? 0;
                
                if (currentTotal > previousTotal) {
                    increasedCompanies.add(company.companyId);
                }
                
                // Check SCPs within this company
                if (company.smallCollectionPoints && Array.isArray(company.smallCollectionPoints)) {
                    company.smallCollectionPoints.forEach((scp: any) => {
                        const currentScpTotal = scp.totalOrders ?? 0;
                        const previousScpTotal = scpSnapshot[company.companyId]?.[scp.pointId] ?? 0;
                        
                        if (currentScpTotal > previousScpTotal) {
                            increasedSCPs.add(scp.pointId);
                        }
                    });
                }
            });
            
            setIncreasedCompanyIds(increasedCompanies);
            setIncreasedSCPIds(increasedSCPs);
            
            // Clear snapshot after 5 minutes
            setTimeout(() => {
                sessionStorage.removeItem(`distribute_snapshot_${selectedDate}`);
                sessionStorage.removeItem(`distribute_scp_snapshot_${selectedDate}`);
                sessionStorage.removeItem('distribute_snapshot_date');
                setIncreasedCompanyIds(new Set());
                setIncreasedSCPIds(new Set());
            }, 5 * 60 * 1000);
        } catch (error) {
            console.error('Error parsing snapshot:', error);
            setIncreasedCompanyIds(new Set());
            setIncreasedSCPIds(new Set());
        }
    }, [companies, selectedDate, activeFilter]);

    React.useEffect(() => {
        // Check if selected date is currently being processed
        const isProcessingThisDate = processingDate && processingDate === selectedDate;

        // Always attempt to fetch undistributed products when the date isn't processing
        if (!isProcessingThisDate) {
            fetchUndistributedProducts(selectedDate, page, pageSize);
        } else {
            clearUndistributedProducts();
        }

        // Also always fetch companies so distributed counts are available immediately
        fetchCompanies(selectedDate);
    }, [selectedDate, activeFilter, page, pageSize, processingDate, fetchUndistributedProducts, fetchCompanies, clearUndistributedProducts]);

    return (
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3'>
                <div className='flex items-center gap-3'>
                    <div className='w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center'>
                        <Package className='text-white' size={20} />
                    </div>
                    <h1 className='text-3xl font-bold text-gray-900'>
                        Chia sản phẩm
                    </h1>
                </div>
                <div className='flex gap-4 items-center flex-1 justify-end'>
                    {activeFilter === 'distributed' && (selectedCompany || selectedSCP) && (
                        <Breadcrumb
                            items={[
                                { label: 'Danh sách công ty', onClick: handleBackToFilter },
                                ...(selectedCompany ? [{ 
                                    label: selectedCompany.companyName, 
                                    onClick: selectedSCP ? handleBackToCompanies : undefined 
                                }] : []),
                                ...(selectedSCP ? [{ label: selectedSCP.pointName }] : [])
                            ]}
                        />
                    )}
                    <div className='min-w-fit'>
                        <CustomDatePicker
                            value={selectedDate}
                            onChange={handleDateChange}
                            placeholder='Chọn ngày chia'
                        />
                    </div>
                    <button
                        onClick={handleShowDistributeModal}
                        disabled={processing || (processingDate && processingDate === selectedDate) || activeFilter !== 'undistributed' || selectedProductIds.length === 0}
                        className='px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium transition cursor-pointer shadow-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed'
                    >
                        <Package size={18} />
                        Chia sản phẩm
                    </button>
                </div>
            </div>
            {/* Filter Buttons */}
            <DistributeProductFilter 
                activeFilter={activeFilter}
                onFilterChange={handleFilterChange}
                undistributedCount={allUndistributedProductIds?.length ?? undistributedProducts.length}
                distributedCount={distributedTotal}
            />

            {/* Undistributed Products View */}
            {activeFilter === 'undistributed' && (
                <>
                    <ProductList
                        products={undistributedProducts}
                        loading={loading}
                        page={page}
                        itemsPerPage={pageSize}
                        scpName=""
                        showCheckbox={true}
                        selectedProductIds={selectedProductIds}
                        allProductIds={allUndistributedProductIds}
                        onToggleSelect={handleToggleSelectProduct}
                        onToggleSelectAll={handleToggleSelectAllProducts}
                    />
                    <Pagination
                        page={page}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </>
            )}

            {/* Distributed Products View */}
            {activeFilter === 'distributed' && !selectedCompany && (
                <CompanyList
                    companies={companies}
                    loading={companyLoading}
                    onSelectCompany={handleSelectCompany}
                    increasedCompanyIds={increasedCompanyIds}
                />
            )}

            {/* Company's SCP List */}
            {activeFilter === 'distributed' && selectedCompany && !selectedSCP && (
                <SmallPointList
                    points={selectedCompany.smallCollectionPoints || []}
                    loading={false}
                    onSelectPoint={handleSelectSCP}
                    increasedSCPIds={increasedSCPIds}
                />
            )}

            {/* SCP Products List */}
            {activeFilter === 'distributed' && selectedSCP && (
                <>
                    <ProductList
                        products={scpProducts}
                        loading={scpLoading}
                        scpName={selectedSCP.pointName}
                        page={scpPage}
                        itemsPerPage={pageSize}
                    />
                    <Pagination
                        page={scpPage}
                        totalPages={scpTotalPages}
                        onPageChange={handleScpPageChange}
                    />
                </>
            )}

            {showDistributeModal && (
                <SelectCompanyModal
                    open={showDistributeModal}
                    onClose={() => setShowDistributeModal(false)}
                    onConfirm={handleCompanySelectionConfirm}
                    companies={collectionCompanies}
                    loading={collectionCompaniesLoading}
                    selectedCompanyIds={selectedCompanyIds}
                    onToggleSelect={handleToggleSelectCompany}
                    onToggleSelectAll={handleToggleSelectAllCompanies}
                    workDate={selectedDate}
                    productCount={undistributedCount}
                    distributing={distributing}
                />
            )}
            <Toast
                open={!!notification}
                type={notification?.type}
                message={notification?.message || ''}
                onClose={() => setNotification(null)}
                duration={5000}
            />
        </div>
    );
};

export default DistributeProductPage;
