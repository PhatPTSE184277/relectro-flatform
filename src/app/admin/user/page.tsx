'use client';

import UserList from "@/components/admin/user/UserList";

const UserPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        👥 Quản lý người dùng
      </h1>
      <UserList />
    </div>
  );
};

export default UserPage;
