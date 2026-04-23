'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { Download, Layers } from 'lucide-react';
import { IoCloudUploadOutline } from 'react-icons/io5';
import { useCategoryContext } from '@/contexts/admin/CategoryContext';
import CategoryStatusFilter from '@/components/admin/category/CategoryStatusFilter';
import ParentCategoryList from '@/components/admin/category/ParentCategoryList';
import ChildCategoryList from '@/components/admin/category/ChildCategoryList';
import CategoryDetailModal from '@/components/admin/category/modal/CategoryDetailModal';
import ImportCategoryModal from '@/components/admin/category/modal/ImportCategoryModal';
import Breadcrumb from '@/components/ui/Breadcrumb';
import Toast from '@/components/ui/Toast';
import { getActiveSystemConfigs } from '@/services/admin/SystemConfigService';
import { pickExcelTemplateUrl } from '@/utils/excelTemplateConfig';
import CategoryService from '@/services/admin/CategoryService';
import type { AdminChildCategory } from '@/services/admin/CategoryService';

const AdminCategoryPage: React.FC = () => {
	const {
		status,
		setStatus,
		parentCategories,
		childCategories,
		selectedParent,
		selectParent,
		clearSelectedParent,
		loadingParents,
		loadingChildren,
		error
		,
		refetchParents,
		refetchChildren
	} = useCategoryContext();

	const [detailOpen, setDetailOpen] = useState(false);
	const [detailCategory, setDetailCategory] = useState<AdminChildCategory | null>(null);
	const [showImportModal, setShowImportModal] = useState(false);
	const [templateUrl, setTemplateUrl] = useState<string | null>(null);
	const [toast, setToast] = useState<{ open: boolean; type: 'success' | 'error'; message: string }>({
		open: false,
		type: 'error',
		message: ''
	});

	const parentName = useMemo(() => selectedParent?.name || '', [selectedParent?.name]);

	// Clear any previously selected parent when entering this page (mount).
	// This ensures navigating from other pages resets to the parent list default.
	useEffect(() => {
		clearSelectedParent();
		// Reset the status filter to 'Hoạt động' when coming from other pages
		setStatus('Hoạt động');
	}, [clearSelectedParent, setStatus]);

	useEffect(() => {
		const loadTemplate = async () => {
			try {
				const configs = await getActiveSystemConfigs('Excel');
				setTemplateUrl(pickExcelTemplateUrl(configs, ['danh muc', 'category', 'categories']));
			} catch {
				setTemplateUrl(null);
			}
		};

		void loadTemplate();
	}, []);

	const handleImportExcel = async (file: File): Promise<boolean> => {
		try {
			const res = await CategoryService.importCategoriesFromExcel(file);
			if (!res) {
				setToast({ open: true, type: 'error', message: 'Thêm dữ liệu thất bại' });
				return false;
			}

			await refetchParents();
			await refetchChildren();
			setToast({ open: true, type: 'success', message: 'Thêm dữ liệu hoàn tất' });
			return true;
		} catch {
			setToast({ open: true, type: 'error', message: 'Thêm dữ liệu thất bại' });
			return false;
		}
	};

	const handleViewDetail = (cat: AdminChildCategory) => {
		setDetailCategory(cat);
		setDetailOpen(true);
	};

	const handleCloseDetail = () => {
		setDetailOpen(false);
		setDetailCategory(null);
	};

	return (
		<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative'>
			<div className='flex items-center justify-between gap-2 mb-3'>
				<div className='flex items-center gap-3 min-w-0'>
					<div className='w-10 h-10 rounded-full bg-primary-600 shadow-sm flex items-center justify-center shrink-0'>
						<Layers className='text-white' size={18} />
					</div>
					<div className='min-w-0 flex items-center gap-4'>
						<h1 className='text-3xl font-bold text-gray-900 truncate'>Danh mục</h1>
						{selectedParent ? (
							<div className='text-sm text-primary-600 truncate'>
								<Breadcrumb
									items={[
										{ label: 'Danh sách Danh mục lớn', onClick: clearSelectedParent },
										{ label: parentName || 'Danh mục nhỏ' }
									]}
								/>
							</div>
						) : null}
					</div>
				</div>
				<div className='flex items-center gap-3 shrink-0'>
					<a
						href={templateUrl || '#'}
						download
						onClick={(e) => {
							if (!templateUrl) e.preventDefault();
						}}
						className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition font-medium shadow-sm ${
							templateUrl
								? 'border-primary-300 text-primary-600 hover:bg-primary-50'
								: 'border-gray-200 text-gray-400 cursor-not-allowed'
						}`}
					>
						<Download size={18} />
						Tải file mẫu
					</a>
					<button
						type='button'
						className='flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition font-medium shadow-md border border-primary-200 cursor-pointer'
						onClick={() => setShowImportModal(true)}
					>
						<IoCloudUploadOutline size={18} />
						Nhập từ Excel
					</button>
				</div>
			</div>

			<CategoryStatusFilter value={status} onChange={setStatus} />

			{error ? (
				<div className='p-3 rounded-lg border border-red-200 bg-red-50 text-red-700 text-sm'>
					{error}
				</div>
			) : null}

			{!selectedParent ? (
				<ParentCategoryList
					categories={parentCategories}
					loading={loadingParents}
					selectedParentId={null}
					onSelect={selectParent}
				/>
			) : (
				<ChildCategoryList
					categories={childCategories}
					loading={loadingChildren}
					parentName={parentName}
					onViewDetail={handleViewDetail}
				/>
			)}

			<CategoryDetailModal
				open={detailOpen}
				category={detailCategory}
				status={status}
				onClose={handleCloseDetail}
			/>

			{showImportModal ? (
				<ImportCategoryModal
					open={showImportModal}
					onClose={() => setShowImportModal(false)}
					onImport={handleImportExcel}
				/>
			) : null}

			<Toast
				open={toast.open}
				type={toast.type}
				message={toast.message}
				onClose={() => setToast({ ...toast, open: false })}
			/>
		</div>
	);
};

export default AdminCategoryPage;

