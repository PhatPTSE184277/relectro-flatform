import React from "react";
import { useUserContext } from "@/contexts/admin/UserContext";
import UserShow from "./UserShow";
import UserTableSkeleton from "./UserTableSkeleton";

const UserList: React.FC = () => {
  const { users, loading } = useUserContext();

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-gray-800">
          <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-semibold">
            <tr>
              <th className="py-3 px-4 text-left">Avatar</th>
              <th className="py-3 px-4 text-left">Tên</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Số điện thoại</th>
              <th className="py-3 px-4 text-left">Địa chỉ</th>
              <th className="py-3 px-4 text-right">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              Array.from({ length: 6 }).map((_, idx) => (
                <UserTableSkeleton key={idx} />
              ))
            ) : users.length > 0 ? (
              users.map((user) => (
                <UserShow key={user.userId} user={user} onView={() => {}} />
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-400">
                  Không có người dùng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
