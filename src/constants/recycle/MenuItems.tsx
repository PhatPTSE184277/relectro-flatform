import {
    LayoutDashboard,
    Package
} from 'lucide-react';

export const recyclerMenuItems = [
    {
        id: 'dashboard',
        label: 'Bảng điều khiển',
        path: '/recycle/dashboard',
        icon: <LayoutDashboard size={20} />
    },
    {
        id: 'package',
        label: 'Quản lý Package',
        path: '/recycle/package',
        icon: <Package size={20} />
    }
];
