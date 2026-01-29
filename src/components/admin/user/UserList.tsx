import Pagination from '@/components/ui/Pagination';
import { useUserContext } from '@/contexts/admin/UserContext';
import UserTableSkeleton from '@/components/admin/user/UserTableSkeleton';
import UserShow from '@/components/admin/user/UserShow';
import type { User } from '@/services/admin/UserService';

interface UserListProps {
  onBanClick: (user: User) => void;
  filterStatus?: string;
}

const UserList: React.FC<UserListProps> = ({ onBanClick, filterStatus }) => {
  const { users, loading, page, limit, totalPages, setPage } = useUserContext();
  const startIndex = (page - 1) * limit;
  const showActionColumn = filterStatus !== 'Không hoạt động';

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="overflow-x-auto">
          <div className="max-h-[57vh] sm:max-h-[70vh] md:max-h-[60vh] lg:max-h-[50vh] xl:max-h-[57vh] overflow-y-auto">
            <table className="min-w-full text-sm text-gray-800 table-fixed">
              <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-semibold sticky top-0 z-10">
                <tr>
                  <th className="py-3 px-4 text-center w-[5vw] min-w-[5vw]">STT</th>
                  <th className="py-3 px-4 text-left w-[18vw] min-w-[12vw]">Tên</th>
                  <th className="py-3 px-4 text-left w-[22vw] min-w-[14vw]">Email</th>
                  <th className="py-3 px-4 text-left w-[12vw] min-w-[8vw]">Số điện thoại</th>
                  {showActionColumn && <th className="py-3 px-4 text-center w-[8vw] min-w-[6vw]">Hành động</th>}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 6 }).map((_, idx: number) => (
                    <UserTableSkeleton key={idx} />
                  ))
                ) : users.length > 0 ? (
                  users.map((user: any, idx: number) => (
                    <UserShow 
                      key={user.userId} 
                      user={user} 
                      stt={startIndex + idx + 1} 
                      onView={() => {}} 
                      onBan={() => onBanClick(user)}
                      isLast={idx === users.length - 1}
                      showActionColumn={showActionColumn}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={showActionColumn ? 6 : 5} className="text-center py-8 text-gray-400">
                      Không có người dùng nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Pagination */}
      <Pagination page={page} totalPages={Number(totalPages)} onPageChange={setPage} />
    </>
  );
};

export default UserList;
