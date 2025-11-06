import {
  LayoutDashboard,
  Users,
} from 'lucide-react';

export const adminMenuItems = [
  { id: 'dashboard', label: 'Bảng điều khiển', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'user', label: 'Người dùng', path: '/admin/user', icon: <Users size={20} /> },
];