import {
    LayoutDashboard,
    Package,
    Truck
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
    },
    {
        id: 'delivery',
        label: 'Vận chuyển',
        path: '/shipper/delivery',
        icon: <Truck size={20} />
    }
];
