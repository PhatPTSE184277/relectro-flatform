'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import verifyQR from '@/services/small-collector/QRService';

type QRContextType = {
    verifying: boolean;
    result: any | null;
    error: any | null;
    verify: (qrCode: string) => Promise<any>;
};

const QRContext = createContext<QRContextType | undefined>(undefined);

export const SmallCollectorQRProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [verifying, setVerifying] = useState<boolean>(false);
    const [result, setResult] = useState<any | null>(null);
    const [error, setError] = useState<any | null>(null);

    const verify = useCallback(async (qrCode: string) => {
        setVerifying(true);
        setError(null);
        try {
            const res = await verifyQR(qrCode);
            setResult(res);
            return res;
        } catch (e) {
            setError(e);
            throw e;
        } finally {
            setVerifying(false);
        }
    }, []);

    return (
        <QRContext.Provider value={{ verifying, result, error, verify }}>
            {children}
        </QRContext.Provider>
    );
};

export const useSmallCollectorQR = (): QRContextType => {
    const ctx = useContext(QRContext);
    if (!ctx) throw new Error('useSmallCollectorQR must be used within SmallCollectorQRProvider');
    return ctx;
};

export default QRContext;
