"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { getCollectorsByCompany, getCollectorById, importCollectorsExcel } from '@/services/company/CollectorService';
import { Collector } from '@/types';
import { useAuth } from '@/hooks/useAuth';

// Add a type for paginated response
interface CollectorPaginatedResponse {
	data: Collector[];
	totalItems: number;
	totalPages: number;
	page: number;
	limit: number;
}

interface CollectorContextType {
	loading: boolean;
	collectors: Collector[];
	selectedCollector: Collector | null;
	error: string | null;
	page: number;
	limit: number;
	total: number;
	setPage: (page: number) => void;
	setLimit: (limit: number) => void;
	fetchCollectors: (companyId: string, page?: number, limit?: number) => Promise<void>;
	fetchCollector: (collectorId: string) => Promise<void>;
	importCollectors: (file: File) => Promise<any>;
	clearCollectors: () => void;
}

const CollectorContext = createContext<CollectorContextType | undefined>(undefined);

export const CollectorProvider = ({ children }: { children: ReactNode }) => {
	const { user } = useAuth();
	const [loading, setLoading] = useState(false);
	const [collectors, setCollectors] = useState<Collector[]>([]);
	const [selectedCollector, setSelectedCollector] = useState<Collector | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [total, setTotal] = useState(0);

	const fetchCollectors = useCallback(async (companyId: string, pageArg?: number, limitArg?: number) => {
		setLoading(true);
		setError(null);
		try {
			const res = await getCollectorsByCompany(companyId, pageArg ?? page, limitArg ?? limit);
			if (Array.isArray(res)) {
				setCollectors(res);
				setTotal(res.length);
			} else {
				const paginated = res as CollectorPaginatedResponse;
				if (Array.isArray(paginated.data) && typeof paginated.totalItems === 'number') {
					setCollectors(paginated.data);
					setTotal(paginated.totalItems);
				} else {
					setCollectors([]);
					setTotal(0);
				}
			}
		} catch (err: any) {
			setError(err?.response?.data?.message || 'Lỗi khi tải collector');
			setCollectors([]);
			setTotal(0);
		} finally {
			setLoading(false);
		}
	}, [page, limit]);

	// Auto-fetch collectors khi có collectionCompanyId từ user
	useEffect(() => {
		if (user?.collectionCompanyId) {
			fetchCollectors(user.collectionCompanyId, page, limit);
		}
	}, [user?.collectionCompanyId, page, limit, fetchCollectors]);

	const fetchCollector = useCallback(async (collectorId: string) => {
		setLoading(true);
		setError(null);
		try {
			const data = await getCollectorById(collectorId);
			setSelectedCollector(data);
		} catch (err: any) {
			setError(err?.response?.data?.message || 'Lỗi khi tải chi tiết collector');
			setSelectedCollector(null);
		} finally {
			setLoading(false);
		}
	}, []);

	const importCollectors = useCallback(async (file: File) => {
		setLoading(true);
		setError(null);
		try {
			const result = await importCollectorsExcel(file);
			return result;
		} catch (err: any) {
			setError(err?.response?.data?.message || 'Lỗi khi import collector');
			throw err;
		} finally {
			setLoading(false);
		}
	}, []);

	const clearCollectors = useCallback(() => {
		setCollectors([]);
		setSelectedCollector(null);
		setError(null);
		setTotal(0);
	}, []);

	return (
		<CollectorContext.Provider value={{
			loading, collectors, selectedCollector, error,
			page, limit, total, setPage, setLimit,
			fetchCollectors, fetchCollector, importCollectors, clearCollectors
		}}>
			{children}
		</CollectorContext.Provider>
	);
};

export const useCollectorContext = () => {
	const context = useContext(CollectorContext);
	if (!context) throw new Error('useCollectorContext must be used within CollectorProvider');
	return context;
};
