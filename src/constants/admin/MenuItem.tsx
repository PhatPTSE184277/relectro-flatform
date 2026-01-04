import {
    LayoutDashboard,
    Settings,
    Users,
    Factory,
    Package,
    ClipboardList,
    Wrench,
    MapPin,
    Recycle
} from 'lucide-react';

export const adminMenuItems = [
    {
        id: 'dashboard',
        label: 'Bảng điều khiển',
        path: '/admin/dashboard',
        icon: <LayoutDashboard size={20} />
    },
    {
        id: 'post',
        label: 'Bài đăng',
        path: '/admin/post',
        icon: <ClipboardList size={20} />
    },
    {
        id: 'assign-product',
        label: 'Phân công sản phẩm',
        path: '/admin/assign-product',
        icon: <Package size={20} />
    },
    {
        id: 'assign-recycling',
        label: 'Phân công tái chế',
        path: '/admin/assign-recycling',
        icon: <Recycle size={20} />
    },
    {
        id: 'collection-company',
        label: 'Công ty thu gom',
        path: '/admin/collection-company',
        icon: <Factory size={20} />
    },
    {
        id: 'company-config',
        label: 'Cấu hình công ty',
        path: '/admin/company-config',
        icon: <Wrench size={20} />
    },
    {
        id: 'system-config',
        label: 'Cấu hình hệ thống',
        path: '/admin/system-config',
        icon: <Settings size={20} />
    },
    {
        id: 'tracking',
        label: 'Theo dõi sản phẩm',
        path: '/admin/tracking',
        icon: <MapPin size={20} />
    },
    {
        id: 'user',
        label: 'Người dùng',
        path: '/admin/user',
        icon: <Users size={20} />
    }
];
