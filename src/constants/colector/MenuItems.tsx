import {
  LayoutDashboard,
  Users,
  Truck,
  MapPin,
  ClipboardList,
  Route,
} from 'lucide-react';

export const collectorMenuItems = [
  { id: 'dashboard', label: 'Bảng điều khiển', path: '/collector/dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'employee', label: 'Nhân viên', path: '/collector/employee', icon: <Users size={20} /> },
  { id: 'shipping', label: 'Vận chuyển', path: '/collector/shipping', icon: <Truck size={20} /> },
  { id: 'collection-point', label: 'Điểm thu gom', path: '/collector/collection-point', icon: <MapPin size={20} /> },
  { id: 'post', label: 'Bài đăng', path: '/collector/post', icon: <ClipboardList size={20} /> },
  { id: 'collection-route', label: 'Tuyến thu gom', path: '/collector/collection-route', icon: <Route size={20} /> }
];