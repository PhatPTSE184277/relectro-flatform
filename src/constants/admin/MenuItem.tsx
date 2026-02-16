import {
    LayoutDashboard,
    Settings,
    Users,
    Factory,
    Package,
    ClipboardList,
    Wrench,
    MapPin,
    Zap,
    Recycle,
    Bell
} from 'lucide-react';

export const adminMenuItems = [
    {
        id: 'dashboard',
        label: 'Thống kê',
        path: '/admin/dashboard',
        icon: <LayoutDashboard size={20} />
    },
    {
        id: 'request',
        label: 'Yêu cầu',
        path: '/admin/request',
        icon: <ClipboardList size={20} />
    },
    {
        id: 'distribute-product',
        label: 'Chia sản phẩm',
        path: '/admin/distribute-product',
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
        id: 'speed',
        label: 'Tốc độ',
        path: '/admin/speed',
        icon: <Zap size={20} />
    },
    {
        id: 'user',
        label: 'Người dùng',
        path: '/admin/user',
        icon: <Users size={20} />
    },
    {
        id: 'send-notification',
        label: 'Gửi thông báo',
        path: '/admin/send-notification',
        icon: <Bell size={20} />
    }
];
