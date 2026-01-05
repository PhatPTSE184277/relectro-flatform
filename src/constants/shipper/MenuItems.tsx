import {
    LayoutDashboard,
    Package
} from 'lucide-react';

export const shipperMenuItems = [
    {
        id: 'dashboard',
        label: 'Bảng điều khiển',
        path: '/shipper/dashboard',
        icon: <LayoutDashboard size={20} />
    },
    {
        id: 'package',
        label: 'Quản lý Package',
        path: '/shipper/package',
        icon: <Package size={20} />
    }
];
