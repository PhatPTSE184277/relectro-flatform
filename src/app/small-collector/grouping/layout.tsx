'use client';

import React from 'react';
import { GroupingProvider } from '@/contexts/small-collector/GroupingContext';

export default function GroupingLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return <GroupingProvider>{children}</GroupingProvider>;
}
