import Pagination from '@/components/ui/Pagination';
import { useUserContext } from '@/contexts/admin/UserContext';
import UserTableSkeleton from '@/components/admin/user/UserTableSkeleton';
import UserShow from '@/components/admin/user/UserShow';

const UserList: React.FC = () => {
  const { users, loading, page, limit, total, setPage } = useUserContext();
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;

  return (
    <>
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
        <div className="overflow-x-auto">
          <div className="max-h-110 overflow-y-auto">
            <table className="min-w-full text-sm text-gray-800 table-fixed">
              <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-semibold sticky top-0 z-10">
                <tr>
                  <th className="py-3 px-4 text-center w-16">STT</th>
                  <th className="py-3 px-4 text-left w-52">Tên</th>
                  <th className="py-3 px-4 text-left w-64">Email</th>
                  <th className="py-3 px-4 text-left w-36">Vai trò</th>
                  <th className="py-3 px-4 text-left w-36">Số điện thoại</th>
                  <th className="py-3 px-4 text-center w-24">Hành động</th>
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
                      isLast={idx === users.length - 1} 
                    />
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
      </div>
      {/* Pagination */}
      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </>
  );
};

export default UserList;
