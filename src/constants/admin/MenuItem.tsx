
import {
  LayoutDashboard,
  Settings,
  Users,
  Factory,
  Package,
} from 'lucide-react';

export const adminMenuItems = [
  { id: 'dashboard', label: 'Bảng điều khiển', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'user', label: 'Người dùng', path: '/admin/user', icon: <Users size={20} /> },
  { id: 'collection-company', label: 'Công ty thu gom', path: '/admin/collection-company', icon: <Factory size={20} /> },
  { id: 'company-config', label: 'Cấu hình công ty', path: '/admin/company-config', icon: <Settings size={20} /> },
  { id: 'assign-company', label: 'Phân công sản phẩm', path: '/admin/assign-company', icon: <Package size={20} /> },
];