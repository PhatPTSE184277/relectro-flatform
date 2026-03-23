import {
    LayoutDashboard,
    Settings,
    Users,
    Factory,
    Package,
    ClipboardList,
    Wrench,
    Zap,
    Recycle,
    Bell,
    TicketPercent,
    ScanSearch
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
        id: 'company',
        label: 'Công ty',
        path: '/admin/company',
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
        label: 'Theo dõi kiện hàng',
        path: '/admin/tracking',
        icon: <ScanSearch size={20} />
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
        id: 'voucher',
        label: 'Voucher',
        path: '/admin/voucher',
        icon: <TicketPercent size={20} />
    },
    {
        id: 'send-notification',
        label: 'Gửi thông báo',
        path: '/admin/send-notification',
        icon: <Bell size={20} />
    },
    // {
    //     id: 'capacity',
    //     label: 'Năng lực kho',
    //     path: '/admin/capacity',
    //     icon: <Warehouse size={20} />
    // }
];
