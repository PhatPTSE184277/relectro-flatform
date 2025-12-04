'use client';

import React from 'react';
import { AssignProductProvider } from '@/contexts/admin/AssignProductContext';

export default function AssignCompanyLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return <AssignProductProvider>{children}</AssignProductProvider>;
}
