'use client';

import React from 'react';
import { CompanyConfigProvider } from '@/contexts/admin/CompanyConfigContext';

export default function CompanyConfigLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return <CompanyConfigProvider>{children}</CompanyConfigProvider>;
}
