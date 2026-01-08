import {
    LayoutDashboard,
    Route,
    Warehouse,
    Package,
    GitBranch,
    QrCode
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
        label: 'Nhận hàng về kho',
        path: '/small-collector/incoming-warehouse',
        icon: <Warehouse size={20} />
    },
    {
        id: 'package',
        label: 'Quản lý package',
        path: '/small-collector/package',
        icon: <Package size={20} />
    }
    ,
    {
        id: 'qrcode',
        label: 'QR Code',
        path: '/small-collector/qrcode',
        icon: <QrCode size={20} />
    }
];