import {
  LayoutDashboard,
  Users,
  Truck,
  MapPin,
  ClipboardList,
  Bell,
  Settings,
} from 'lucide-react';

export const colectorMenuItems = [
  { id: 'dashboard', label: 'Bảng điều khiển', path: '/colector/dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'employee', label: 'Nhân viên', path: '/colector/employee', icon: <Users size={20} /> },
  { id: 'shipping', label: 'Vận chuyển', path: '/colector/shipping', icon: <Truck size={20} /> },
  { id: 'collection-point', label: 'Điểm thu gom', path: '/colector/collection-point', icon: <MapPin size={20} /> },
  { id: 'post', label: 'Bài đăng', path: '/colector/post', icon: <ClipboardList size={20} /> },
  // { id: 'notifications', label: 'Thông báo', path: '/colector/notifications', icon: <Bell size={20} /> },
  // { id: 'settings', label: 'Cài đặt', path: '/colector/settings', icon: <Settings size={20} /> },
];