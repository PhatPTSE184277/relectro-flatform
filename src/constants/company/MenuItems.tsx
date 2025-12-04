import {
    LayoutDashboard,
    Users,
    MapPin,
    Package,
} from 'lucide-react';

export const MenuItems = [
    {
        id: 'dashboard',
        label: 'Bảng điều khiển',
        path: '/company/dashboard',
        icon: <LayoutDashboard size={20} />
    },
    {
        id: 'small-collection',
        label: 'Điểm thu gom nhỏ',
        path: '/company/small-collection',
        icon: <MapPin size={20} />
    },
    {
        id: 'collector',
        label: 'Nhân viên thu gom',
        path: '/company/collector',
        icon: <Users size={20} />
    },
    {
        id: 'product-query',
        label: 'Tra cứu sản phẩm',
        path: '/company/product-query',
        icon: <Package size={20} />
    }
];