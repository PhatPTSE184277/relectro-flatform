import {
    Users,
    MapPin,
    Package,
    CalendarClock,
    Truck,
    Settings2
} from 'lucide-react';

export const MenuItems = [
    {
        id: 'small-collection',
        label: 'Điểm thu gom nhỏ',
        path: '/company/small-collection',
        icon: <MapPin size={20} />
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
    // {
    //     id: 'capacity',
    //     label: 'Năng lực đơn vị thu gom',
    //     path: '/company/capacity',
    //     icon: <Warehouse size={20} />
    // },
];