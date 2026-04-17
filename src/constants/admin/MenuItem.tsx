import {
    LayoutDashboard,
    Settings,
    Users,
    Factory,
    Package,
    ClipboardList,
    Wrench,
    Layers,
    Zap,
    Bell,
    TicketPercent,
    ScanSearch,
	CalendarDays
	,
	Flag
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
        id: 'company',
        label: 'Công ty',
        path: '/admin/company',
        icon: <Factory size={20} />
    },
    {
        id: 'category',
        label: 'Danh mục',
        path: '/admin/category',
        icon: <Layers size={20} />
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
        id: 'holiday',
        label: 'Ngày nghỉ lễ',
        path: '/admin/holiday',
        icon: <CalendarDays size={20} />
    },
    {
        id: 'collection-off-day',
        label: 'Lịch nghỉ thu gom',
        path: '/admin/collection-off-day',
        icon: <CalendarDays size={20} />
    },
    {
        id: 'report',
        label: 'Báo cáo',
        path: '/admin/report',
        icon: <Flag size={20} />
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
    }
];
