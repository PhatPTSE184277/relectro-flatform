import type { User } from "@/services/admin/UserService";
import { Ban } from "lucide-react";

interface UserShowProps {
  user: User;
  stt?: number;
  onView?: () => void;
  onBan?: () => void;
  isLast?: boolean;
  showActionColumn?: boolean;
}

const UserShow: React.FC<UserShowProps> = ({ user, stt, onBan, isLast = false, showActionColumn = true }) => {
  const isActive = user.status === 'Đang hoạt động';
  
  return (
    <tr className={`${!isLast ? 'border-b border-primary-100' : ''} hover:bg-primary-50/40 transition-colors`}>
      <td className="py-3 px-4 text-center w-16">
        <span className="w-7 h-7 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold mx-auto">
          {stt}
        </span>
      </td>
      <td className="py-3 px-4 font-medium text-gray-900 w-52">{user.name}</td>
      <td className="py-3 px-4 text-gray-700 w-64">{user.email}</td>
      <td className="py-3 px-4 text-gray-700 w-36">{user.phone || "-"}</td>
      {showActionColumn && (
        <td className="py-3 px-4 w-24">
          <div className="flex justify-center">
            {isActive && (
              <button
                onClick={onBan}
                className="text-red-600 hover:text-red-800 flex items-center gap-1 font-medium transition cursor-pointer"
                title="Cấm người dùng"
              >
                <Ban size={16} />
              </button>
            )}
          </div>
        </td>
      )}
    </tr>
  );
};

export default UserShow;