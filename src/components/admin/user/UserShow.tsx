import { Ban } from "lucide-react";
import { formatDate } from '@/utils/FormatDate';

interface UserShowProps {
  user: any;
  stt?: number;
  onView?: () => void;
  onBan?: () => void;
  isLast?: boolean;
  showActionColumn?: boolean;
}

const UserShow: React.FC<UserShowProps> = ({ user, stt, onBan, isLast = false, showActionColumn = true }) => {
  const isActive = user.status === 'Đang hoạt động';
  const idx = (stt ?? 1) - 1;
  const rowBg = idx % 2 === 0 ? 'bg-white' : 'bg-primary-50';

  return (
    <tr className={`${!isLast ? 'border-b border-primary-100' : ''} ${rowBg}`}>
      <td className="py-3 px-4 text-center w-[5vw]">
        <span className="w-7 h-7 rounded-full bg-primary-600 text-white text-sm flex items-center justify-center font-semibold mx-auto">
          {stt}
        </span>
      </td>
      <td className="py-3 px-4 font-medium text-gray-900 w-[18vw]">{user.name}</td>
      <td className="py-3 px-4 text-gray-700 w-[22vw]">{user.email}</td>
      <td className="py-3 px-4 text-gray-700 w-[12vw]">{user.phone || "-"}</td>
      <td className="py-3 px-4 text-gray-700 w-[14vw]">{formatDate(user.createAt)}</td>
      {showActionColumn && (
        <td className="py-3 px-4 w-[8vw]">
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