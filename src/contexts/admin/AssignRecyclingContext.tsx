'use client';

import React, {
    createContext,
    useContext,
    useState,
    useCallback,
    ReactNode
} from 'react';
import {
    assignSmallCollectionPoints,
    updateSmallCollectionPointAssignment,
    listSmallCollectionPoints,
    getRecyclingTasks,
    getScpAssignmentDetail as fetchScpAssignmentDetail,
    getRecyclingCompanies
} from '@/services/admin/AssignRecyclingService';
import { getCollectionCompanies } from '@/services/admin/CollectionCompanyService';

interface AssignRecyclingContextType {
    recyclingCompanies: any[];
    smallCollectionPoints: any[];
    loading: boolean;
    fetchRecyclingCompanies: () => Promise<void>;
    fetchSmallCollectionPoints: () => Promise<void>;
    assignSmallPoints: (data: Array<{ recyclingCompanyId: string; smallCollectionPointIds: string[] }>) => Promise<any>;
    updateSmallPointAssignment: (
        scpId: string,
        data: { newRecyclingCompanyId: string }
    ) => Promise<any>;
    fetchRecyclingTasks: (recyclingCompanyId: string) => Promise<any>;
    getScpAssignmentDetail: (id: string) => Promise<any>;
    getCollectionCompanies: typeof getCollectionCompanies;
}

const AssignRecyclingContext = createContext<AssignRecyclingContextType | undefined>(undefined);

type Props = { children: ReactNode };

export const AssignRecyclingProvider: React.FC<Props> = ({ children }) => {
    const [recyclingCompanies, setRecyclingCompanies] = useState<any[]>([]);
    const [smallCollectionPoints, setSmallCollectionPoints] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchRecyclingCompanies = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getRecyclingCompanies();
            setRecyclingCompanies(data);
        } catch (err) {
            console.log(err);
            setRecyclingCompanies([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchSmallCollectionPoints = useCallback(async () => {
        setLoading(true);
        try {
            const data = await listSmallCollectionPoints();
            setSmallCollectionPoints(data);
        } catch (err) {
            console.log(err);
            setSmallCollectionPoints([]);
        } finally {
            setLoading(false);
        }
    }, []);

    const assignSmallPoints = useCallback(async (data: Array<{ recyclingCompanyId: string; smallCollectionPointIds: string[] }>) => {
        setLoading(true);
        try {
            const res = await assignSmallCollectionPoints(data);
            return res;
        } catch (err) {
            console.log(err);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateSmallPointAssignment = useCallback(
        async (scpId: string, data: { newRecyclingCompanyId: string }) => {
            setLoading(true);
            try {
                const res = await updateSmallCollectionPointAssignment(scpId, data);
                return res;
            } catch (err) {
                console.log(err);
                return null;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const fetchRecyclingTasks = useCallback(async (recyclingCompanyId: string) => {
        setLoading(true);
        try {
            const data = await getRecyclingTasks(recyclingCompanyId);
            return data;
        } catch (err) {
            console.log(err);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const getScpAssignmentDetail = useCallback(async (id: string) => {
        setLoading(true);
        try {
            const data = await fetchScpAssignmentDetail(id);
            return data;
        } catch (err) {
            console.log(err);
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const value: AssignRecyclingContextType = {
        recyclingCompanies,
        smallCollectionPoints,
        loading,
        fetchRecyclingCompanies,
        fetchSmallCollectionPoints,
        assignSmallPoints,
        updateSmallPointAssignment,
        fetchRecyclingTasks,
        getScpAssignmentDetail,
        getCollectionCompanies
    };

    return (
        <AssignRecyclingContext.Provider value={value}>
            {children}
        </AssignRecyclingContext.Provider>
    );
};

export const useAssignRecyclingContext = (): AssignRecyclingContextType => {
    const ctx = useContext(AssignRecyclingContext);
    if (!ctx)
        throw new Error(
            'useAssignRecyclingContext must be used within AssignRecyclingProvider'
        );
    return ctx;
};