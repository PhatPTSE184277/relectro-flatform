"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { getCollectorsByCompany, getCollectorById, importCollectorsExcel } from '@/services/company/CollectorService';
import { Collector } from '@/types';

interface CollectorContextType {
	loading: boolean;
	collectors: Collector[];
	selectedCollector: Collector | null;
	error: string | null;
	fetchCollectors: (companyId: number) => Promise<void>;
	fetchCollector: (collectorId: string) => Promise<void>;
	importCollectors: (file: File) => Promise<any>;
	clearCollectors: () => void;
}

const CollectorContext = createContext<CollectorContextType | undefined>(undefined);

export const CollectorProvider = ({ children }: { children: ReactNode }) => {
	const [loading, setLoading] = useState(false);
	const [collectors, setCollectors] = useState<Collector[]>([]);
	const [selectedCollector, setSelectedCollector] = useState<Collector | null>(null);
	const [error, setError] = useState<string | null>(null);

	const fetchCollectors = useCallback(async (companyId: number) => {
		setLoading(true);
		setError(null);
		try {
			const data = await getCollectorsByCompany(companyId);
			setCollectors(data || []);
		} catch (err: any) {
			setError(err?.response?.data?.message || 'Lỗi khi tải collector');
			setCollectors([]);
		} finally {
			setLoading(false);
		}
	}, []);

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
	}, []);

	return (
		<CollectorContext.Provider value={{ loading, collectors, selectedCollector, error, fetchCollectors, fetchCollector, importCollectors, clearCollectors }}>
			{children}
		</CollectorContext.Provider>
	);
};

export const useCollectorContext = () => {
	const context = useContext(CollectorContext);
	if (!context) throw new Error('useCollectorContext must be used within CollectorProvider');
	return context;
};
