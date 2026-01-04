import type { User } from "@/services/admin/UserService";
import { Eye } from "lucide-react";

interface UserShowProps {
  user: User;
  stt?: number;
  onView?: () => void;
  isLast?: boolean;
}

const UserShow: React.FC<UserShowProps> = ({ user, stt, onView, isLast = false }) => {
  return (
    <tr className={`${!isLast ? 'border-b border-primary-100' : ''} hover:bg-primary-50/40 transition-colors`}>
      <td className="py-3 px-4 text-center" style={{ width: '60px' }}>
        <span className="w-7 h-7 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold mx-auto">
          {stt}
        </span>
      </td>
      <td className="py-3 px-4 font-medium text-gray-900" style={{ width: '200px' }}>{user.name}</td>
      <td className="py-3 px-4 text-gray-700" style={{ width: '250px' }}>{user.email}</td>
      <td className="py-3 px-4 text-gray-700" style={{ width: '150px' }}>{user.role || 'User'}</td>
      <td className="py-3 px-4 text-gray-700" style={{ width: '150px' }}>{user.phone || "-"}</td>
      <td className="py-3 px-4" style={{ width: '100px' }}>
        <div className="flex justify-center">
          <button
            onClick={onView}
            className="text-primary-600 hover:text-primary-800 flex items-center gap-1 font-medium transition cursor-pointer"
            title="Xem chi tiết"
          >
            <Eye size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default UserShow;