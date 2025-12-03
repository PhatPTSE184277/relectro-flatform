"use client";

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import {
	getAssignCompanyConfig,
	postAssignCompanyConfig
} from '@/services/admin/CompanyConfigService';
import {
	AssignCompanyConfigResponse,
	AssignCompanyConfigPostRequest,
	AssignCompanyConfigPostResponse
} from '@/types';
import { toast } from 'react-toastify';

interface CompanyConfigContextType {
	config: AssignCompanyConfigResponse | null;
	loading: boolean;
	companiesWithPoints: any[];
	fetchConfig: () => Promise<void>;
	postConfig: (data: AssignCompanyConfigPostRequest) => Promise<AssignCompanyConfigPostResponse | null>;
	updateConfig: (companies: any[]) => Promise<void>;
}

const CompanyConfigContext = createContext<CompanyConfigContextType | undefined>(undefined);

type Props = { children: ReactNode };

export const CompanyConfigProvider: React.FC<Props> = ({ children }) => {
	const [config, setConfig] = useState<AssignCompanyConfigResponse | null>(null);
	const [loading, setLoading] = useState(false);
	const [companiesWithPoints, setCompaniesWithPoints] = useState<any[]>([]);

	const fetchConfig = useCallback(async () => {
		setLoading(true);
		try {
			const res = await getAssignCompanyConfig();
			setConfig(res);
			setCompaniesWithPoints(res.companies || []);
		} catch (err) {
			toast.error('Lỗi khi tải cấu hình công ty');
			setConfig(null);
			setCompaniesWithPoints([]);
		} finally {
			setLoading(false);
		}
	}, []);

	const postConfig = useCallback(async (data: AssignCompanyConfigPostRequest) => {
		setLoading(true);
		try {
			const res = await postAssignCompanyConfig(data);
			toast.success('Cập nhật cấu hình thành công');
			await fetchConfig();
			return res;
		} catch (err) {
			toast.error('Lỗi khi cập nhật cấu hình');
			return null;
		} finally {
			setLoading(false);
		}
	}, [fetchConfig]);

	const updateConfig = useCallback(async (companies: any[]) => {
		const requestData: AssignCompanyConfigPostRequest = {
			companies: companies.map((company) => ({
				companyId: company.companyId,
				ratioPercent: company.ratioPercent,
				smallPoints: company.smallPoints.map((sp: any) => ({
					smallPointId: sp.smallPointId,
					radiusKm: sp.radiusKm,
					maxRoadDistanceKm: sp.maxRoadDistanceKm,
					active: true
				}))
			}))
		};
		await postConfig(requestData);
	}, [postConfig]);

	useEffect(() => {
		void fetchConfig();
	}, [fetchConfig]);

	const value: CompanyConfigContextType = {
		config,
		loading,
		companiesWithPoints,
		fetchConfig,
		postConfig,
		updateConfig
	};

	return (
		<CompanyConfigContext.Provider value={value}>
			{children}
		</CompanyConfigContext.Provider>
	);
};

export const useCompanyConfigContext = (): CompanyConfigContextType => {
	const ctx = useContext(CompanyConfigContext);
	if (!ctx) throw new Error('useCompanyConfigContext must be used within CompanyConfigProvider');
	return ctx;
};
