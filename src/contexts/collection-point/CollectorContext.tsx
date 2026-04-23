"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import { activateCollector as activateCollectorApi, deactivateCollector as deactivateCollectorApi, filterCollectors, getCollectorById, importCollectorsExcel, type CollectorItem, type CollectorPagingResponse } from '@/services/collection-point/CollectorService';
import { useAuth } from '@/hooks/useAuth';

export type CollectorStatusFilter = 'Đang hoạt động' | 'Không hoạt động';

interface CollectorContextType {
	loading: boolean;
	actionLoading: boolean;
	collectors: any[];
	totalItems: number;
	totalPages: number;
	stats: {
		total: number;
		active: number;
		inactive: number;
	};
	selectedCollector: any | null;
	error: string | null;
	page: number;
	limit: number;
	setPage: (page: number) => void;
	setLimit: (limit: number) => void;
	fetchCollectors: (status?: CollectorStatusFilter, page?: number, limit?: number, refreshStats?: boolean) => Promise<void>;
	fetchCollector: (collectorId: string) => Promise<void>;
	importCollectors: (file: File) => Promise<any>;
	activateCollector: (collectorId: string) => Promise<void>;
	deactivateCollector: (collectorId: string) => Promise<void>;
	clearCollectors: () => void;
}

const CollectorContext = createContext<CollectorContextType | undefined>(undefined);

export const CollectorProvider = ({ children }: { children: ReactNode }) => {
	const { user } = useAuth();
	const [loading, setLoading] = useState(false);
	const [actionLoading, setActionLoading] = useState(false);
	const [collectors, setCollectors] = useState<any[]>([]);
	const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });
	const [selectedCollector, setSelectedCollector] = useState<any | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [page, setPage] = useState(1);
	const [limit, setLimit] = useState(10);
	const [totalItems, setTotalItems] = useState(0);
	const [totalPages, setTotalPages] = useState(1);
	const currentStatusRef = React.useRef<CollectorStatusFilter | undefined>(undefined);
	const currentPageRef = React.useRef<number>(1);
	const currentLimitRef = React.useRef<number>(10);

	const fetchCollectorStats = useCallback(async (smallCollectionPointId: string) => {
		try {
			const [allRes, activeRes, inactiveRes] = await Promise.all([
				filterCollectors({ smallCollectionId: smallCollectionPointId, page: 1, limit: 1 }),
				filterCollectors({ smallCollectionId: smallCollectionPointId, status: 'Đang hoạt động', page: 1, limit: 1 }),
				filterCollectors({ smallCollectionId: smallCollectionPointId, status: 'Không hoạt động', page: 1, limit: 1 }),
			]);

			setStats({
				total: allRes?.totalItems || 0,
				active: activeRes?.totalItems || 0,
				inactive: inactiveRes?.totalItems || 0,
			});
		} catch {
			// ignore stats errors
		}
	}, []);

	const fetchCollectors = useCallback(async (
		status?: CollectorStatusFilter,
		pageArg: number = 1,
		limitArg: number = 10,
		refreshStats: boolean = false
	) => {
		if (!user?.smallCollectionPointId) return;
		currentStatusRef.current = status;
		currentPageRef.current = pageArg;
		currentLimitRef.current = limitArg;
		setLoading(true);
		setError(null);
		try {
			const res: CollectorPagingResponse = await filterCollectors({
				smallCollectionId: user.smallCollectionPointId,
				status,
				page: pageArg,
				limit: limitArg,
			});
			setCollectors(Array.isArray(res?.data) ? res.data : []);
			setTotalItems(res?.totalItems || 0);
			setTotalPages(res?.totalPages || 1);
			if (refreshStats || pageArg === 1) {
				void fetchCollectorStats(user.smallCollectionPointId);
			}
		} catch (err: any) {
			setError(err?.response?.data?.message || 'Lỗi khi tải nhân viên thu gom');
			setCollectors([]);
			setTotalItems(0);
			setTotalPages(1);
		} finally {
			setLoading(false);
		}
	}, [fetchCollectorStats, user?.smallCollectionPointId]);

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

	const activateCollector = useCallback(async (collectorId: string) => {
		setActionLoading(true);
		setError(null);
		try {
			await activateCollectorApi(collectorId);
			void fetchCollectors(currentStatusRef.current, currentPageRef.current, currentLimitRef.current, true);
		} catch (err: any) {
			setError(err?.response?.data?.message || 'Lỗi khi mở khóa nhân viên thu gom');
			throw err;
		} finally {
			setActionLoading(false);
		}
	}, [fetchCollectors]);

	const deactivateCollector = useCallback(async (collectorId: string) => {
		setActionLoading(true);
		setError(null);
		try {
			await deactivateCollectorApi(collectorId);
			void fetchCollectors(currentStatusRef.current, currentPageRef.current, currentLimitRef.current, true);
		} catch (err: any) {
			setError(err?.response?.data?.message || 'Lỗi khi khóa nhân viên thu gom');
			throw err;
		} finally {
			setActionLoading(false);
		}
	}, [fetchCollectors]);

	const clearCollectors = useCallback(() => {
		setCollectors([]);
		setSelectedCollector(null);
		setError(null);
		setTotalItems(0);
		setTotalPages(1);
		setStats({ total: 0, active: 0, inactive: 0 });
	}, []);

	return (
		<CollectorContext.Provider value={{
			loading, actionLoading, collectors, totalItems, totalPages, stats, selectedCollector, error,
			page, limit, setPage, setLimit,
			fetchCollectors, fetchCollector, importCollectors, activateCollector, deactivateCollector, clearCollectors
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
