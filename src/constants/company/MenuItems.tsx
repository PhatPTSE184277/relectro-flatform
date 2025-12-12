import {
    LayoutDashboard,
    Users,
    MapPin,
    Package,
    CalendarClock,
    Truck,
    Settings2
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
        id: 'shift',
        label: 'Ca làm việc',
        path: '/company/shift',
        icon: <CalendarClock size={20} />
    },
    {
        id: 'vehicle',
        label: 'Phương tiện',
        path: '/company/vehicle',
        icon: <Truck size={20} />
    },
    {
        id: 'product-query',
        label: 'Tra cứu sản phẩm',
        path: '/company/product-query',
        icon: <Package size={20} />
    },
        {
        id: 'setting-group',
        label: 'Cấu hình gom nhóm',
        path: '/company/setting-group',
        icon: <Settings2 size={20} />
    },
];