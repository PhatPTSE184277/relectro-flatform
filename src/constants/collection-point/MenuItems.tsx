import {
    LayoutDashboard,
    Route,
    Warehouse,
    Package,
    GitBranch,
    QrCode,
    Truck,
    Users,
    CalendarClock,
    Settings2
} from 'lucide-react';

export const collectorMenuItems = [
    {
        id: 'dashboard',
        label: 'Thống kê',
        path: '/small-collector/dashboard',
        icon: <LayoutDashboard size={20} />
    },
    {
        id: 'grouping',
        label: 'Danh sách sản phẩm',
        path: '/small-collector/grouping/list',
        icon: <GitBranch size={20} />
    },
    {
        id: 'collection-route',
        label: 'Tuyến thu gom',
        path: '/small-collector/collection-route',
        icon: <Route size={20} />
    },
    {
        id: 'incoming-warehouse',
        label: 'Nhận hàng về đơn vị thu gom',
        path: '/small-collector/incoming-warehouse',
        icon: <Warehouse size={20} />
    },
    {
        id: 'package',
        label: 'Quản lý kiện hàng',
        path: '/small-collector/package',
        icon: <Package size={20} />
    },
    {
        id: 'collector',
        label: 'Nhân viên thu gom',
        path: '/company/collector',
        icon: <Users size={20} />
    },
    {
        id: 'shift',
        label: 'Ca làm việc',
        path: '/company/shift',
        icon: <CalendarClock size={20} />
    },
    {
        id: 'vehicle',
        label: 'Phương tiện',
        path: '/small-collector/vehicle',
        icon: <Truck size={20} />
    },
    {
        id: 'setting-group',
        label: 'Cấu hình gom nhóm',
        path: '/company/setting-group',
        icon: <Settings2 size={20} />
    },
    {
        id: 'qrcode',
        label: 'QR Code',
        path: '/small-collector/qrcode',
        icon: <QrCode size={20} />
    }
];
