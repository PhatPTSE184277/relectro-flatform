import {
  LayoutDashboard,
  Settings,
  Users,
} from 'lucide-react';

export const adminMenuItems = [
  { id: 'dashboard', label: 'Bảng điều khiển', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'user', label: 'Người dùng', path: '/admin/user', icon: <Users size={20} /> },
   { id: 'company-config', label: 'Cấu hình công ty', path: '/admin/company-config', icon: <Settings size={20} /> },
];