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
              <thead className="bg-primary-50 text-primary-700 uppercase text-xs font-semibold sticky top-0 z-10 border-b border-primary-200">
                <tr>
                  <th className="py-3 px-4 text-center w-[5vw]">STT</th>
                  <th className="py-3 px-4 text-left w-[18vw]">Tên</th>
                  <th className="py-3 px-4 text-left w-[22vw]">Email</th>
                  <th className="py-3 px-4 text-left w-[12vw]">Số điện thoại</th>
                  <th className="py-3 px-4 text-left w-[14vw]">Ngày tạo</th>
                  {showActionColumn && <th className="py-3 px-4 text-center w-[8vw]">Hành động</th>}
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
                    <td colSpan={showActionColumn ? 7 : 6} className="text-center py-8 text-gray-400">
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
