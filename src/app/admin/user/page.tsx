'use client';

import React, { useState } from 'react';
import { Users } from 'lucide-react';
import SearchBox from '@/components/ui/SearchBox';
import UserList from "@/components/admin/user/UserList";

const UserPage = () => {
  const [search, setSearch] = useState('');

  return (
    <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
      <div className='flex justify-between items-center mb-6'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center'>
            <Users className='text-white' size={20} />
          </div>
          <h1 className='text-3xl font-bold text-gray-900'>
            Quản lý người dùng
          </h1>
        </div>
        <div className='flex-1 max-w-md'>
          <SearchBox
            value={search}
            onChange={setSearch}
            placeholder='Tìm kiếm người dùng...'
          />
        </div>
      </div>
      <UserList />
    </div>
  );
};

export default UserPage;
