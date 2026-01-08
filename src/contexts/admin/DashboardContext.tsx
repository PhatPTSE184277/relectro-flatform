'use client';

import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    ReactNode
} from 'react';
import {
    getDashboardSummary,
    getDashboardSummaryByDay,
    DashboardSummaryResponse
} from '@/services/admin/DashboardService';

interface DashboardContextType {
    summary: DashboardSummaryResponse | null;
    loading: boolean;
    fetchSummary: (fromDate: string, toDate: string) => Promise<void>;
    fetchSummaryByDay: (date: string) => Promise<void>;
}

const DashboardContext = createContext<DashboardContextType | undefined>(
    undefined
);

type Props = { children: ReactNode };

export const DashboardProvider: React.FC<Props> = ({ children }) => {
    const [summary, setSummary] = useState<DashboardSummaryResponse | null>(
        null
    );
    const [loading, setLoading] = useState(false);

    const fetchSummary = useCallback(
        async (fromDate: string, toDate: string) => {
            setLoading(true);
            try {
                const res = await getDashboardSummary(fromDate, toDate);
                setSummary(res);
            } catch (err) {
                console.log(err);
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const fetchSummaryByDay = useCallback(async (date: string) => {
        setLoading(true);
        try {
            const res = await getDashboardSummaryByDay(date);
            setSummary(res);
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const value: DashboardContextType = {
        summary,
        loading,
        fetchSummary,
        fetchSummaryByDay
    };

    return (
        <DashboardContext.Provider value={value}>
            {children}
        </DashboardContext.Provider>
    );
};

export const useDashboardContext = (): DashboardContextType => {
    const ctx = useContext(DashboardContext);
    if (!ctx)
        throw new Error(
            'useDashboardContext must be used within DashboardProvider'
        );
    return ctx;
};
