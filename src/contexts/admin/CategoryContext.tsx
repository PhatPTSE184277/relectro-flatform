/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
	type ReactNode
} from 'react';

import CategoryService, {
	type AdminChildCategory,
	type AdminParentCategory
} from '@/services/admin/CategoryService';

type CategoryStatusFilter = 'Hoạt động' | 'Không hoạt động';

interface CategoryContextType {
	status: CategoryStatusFilter;
	setStatus: (next: CategoryStatusFilter) => void;

	parentCategories: AdminParentCategory[];
	childCategories: AdminChildCategory[];
	selectedParent: AdminParentCategory | null;
	selectParent: (parent: AdminParentCategory) => void;
	clearSelectedParent: () => void;

	loadingParents: boolean;
	loadingChildren: boolean;
	error: string | null;
	refetchParents: () => Promise<void>;
	refetchChildren: () => Promise<void>;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

type Props = { children: ReactNode };

export const CategoryProvider: React.FC<Props> = ({ children }) => {
	const [status, setStatusState] = useState<CategoryStatusFilter>('Hoạt động');
	const [parentCategories, setParentCategories] = useState<AdminParentCategory[]>([]);
	const [childCategories, setChildCategories] = useState<AdminChildCategory[]>([]);
	const [selectedParent, setSelectedParent] = useState<AdminParentCategory | null>(null);

	const [loadingParents, setLoadingParents] = useState(false);
	const [loadingChildren, setLoadingChildren] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const setStatus = useCallback((next: CategoryStatusFilter) => {
		setStatusState((prev) => (prev === next ? prev : next));
	}, []);

	const refetchParents = useCallback(async () => {
		setLoadingParents(true);
		setError(null);
		try {
			const data = await CategoryService.getAdminParentCategories(status);
			setParentCategories(Array.isArray(data) ? data : []);
		} catch (err: any) {
			setError(err?.response?.data?.message || 'Lỗi khi tải Danh mục lớn');
			setParentCategories([]);
		} finally {
			setLoadingParents(false);
		}
	}, [status]);

	const refetchChildren = useCallback(async () => {
		const parentId = selectedParent?.id;
		if (!parentId) {
			setChildCategories([]);
			return;
		}

		setLoadingChildren(true);
		setError(null);
		try {
			const res = await CategoryService.getAdminChildCategories({
				parentId,
				status,
				page: 1,
				limit: 50
			});
			setChildCategories(Array.isArray(res?.data) ? res.data : []);
		} catch (err: any) {
			setError(err?.response?.data?.message || 'Lỗi khi tải Danh mục nhỏ');
			setChildCategories([]);
		} finally {
			setLoadingChildren(false);
		}
	}, [selectedParent?.id, status]);

	const selectParent = useCallback((parent: AdminParentCategory) => {
		setSelectedParent((prev) => (prev?.id === parent.id ? prev : parent));
	}, []);

	const clearSelectedParent = useCallback(() => {
		setSelectedParent(null);
		setChildCategories([]);
	}, []);

	useEffect(() => {
		void refetchParents();
	}, [refetchParents]);

	useEffect(() => {
		void refetchChildren();
	}, [refetchChildren]);

	// Keep `selectedParent` even if it's not present in the current parent list
	// (e.g. when changing the status filter). This allows viewing child
	// categories for the selected parent across different status filters.

	const value = useMemo<CategoryContextType>(
		() => ({
			status,
			setStatus,
			parentCategories,
			childCategories,
			selectedParent,
			selectParent,
			clearSelectedParent,
			loadingParents,
			loadingChildren,
			error,
			refetchParents,
			refetchChildren
		}),
		[
			status,
			setStatus,
			parentCategories,
			childCategories,
			selectedParent,
			selectParent,
			clearSelectedParent,
			loadingParents,
			loadingChildren,
			error,
			refetchParents,
			refetchChildren
		]
	);

	return <CategoryContext.Provider value={value}>{children}</CategoryContext.Provider>;
};

export const useCategoryContext = (): CategoryContextType => {
	const ctx = useContext(CategoryContext);
	if (!ctx) throw new Error('useCategoryContext must be used within CategoryProvider');
	return ctx;
};

