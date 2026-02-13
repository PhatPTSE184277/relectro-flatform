'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { generateQRForCompany } from '@/services/recycle/QRService';

type QRContextType = {
    qrData: any | null;
    loading: boolean;
    generateQR: () => Promise<any>;
};

const QRContext = createContext<QRContextType | undefined>(undefined);

type Props = { children: ReactNode };

export const QRProvider: React.FC<Props> = ({ children }) => {
    const user = useSelector((state: RootState) => state.auth.user);
    const [qrData, setQrData] = useState<any | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const generateQR = useCallback(async () => {
        const companyId = user?.collectionCompanyId;
        if (!companyId) throw new Error('No companyId available');
        setLoading(true);
        try {
            const res = await generateQRForCompany(companyId);
            setQrData(res);
            return res;
        } finally {
            setLoading(false);
        }
    }, [user?.collectionCompanyId]);

    useEffect(() => {
        if (user?.collectionCompanyId) {
            void generateQR();
        } else {
            setQrData(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.collectionCompanyId]);

    return (
        <QRContext.Provider value={{ qrData, loading, generateQR }}>
            {children}
        </QRContext.Provider>
    );
};

export const useQRContext = (): QRContextType => {
    const ctx = useContext(QRContext);
    if (!ctx) throw new Error('useQRContext must be used within QRProvider');
    return ctx;
};

export default QRContext;
