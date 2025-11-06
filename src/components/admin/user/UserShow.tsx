/* eslint-disable @next/next/no-img-element */
import type { User } from "@/types/user";
import { Eye } from "lucide-react";

interface UserShowProps {
  user: User;
  onView?: () => void;
}

const UserShow: React.FC<UserShowProps> = ({ user, onView }) => {
  return (
    <tr className="border-b border-gray-100 hover:bg-blue-50/40 transition-colors">
      <td className="py-3 px-4">
        <div className="w-12 h-12 bg-gray-100 rounded-full overflow-hidden shadow-sm">
          <img
            src={user.avatar || "/avatar-default.png"}
            alt={user.name}
            className="w-full h-full object-cover"
          />
        </div>
      </td>
      <td className="py-3 px-4 font-medium">{user.name}</td>
      <td className="py-3 px-4">{user.email}</td>
      <td className="py-3 px-4">{user.phone || "-"}</td>
      <td className="py-3 px-4">{user.address || "-"}</td>
      <td className="py-3 px-4">
        <div className="flex justify-center">
          <button
            onClick={onView}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium transition cursor-pointer"
          >
            <Eye size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default UserShow;