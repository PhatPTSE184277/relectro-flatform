'use client';

import { useState, useEffect } from 'react';
import { Users } from 'lucide-react';
import SearchBox from '@/components/ui/SearchBox';
import CustomDateRangePicker from '@/components/ui/CustomDateRangePicker';
import UserList from "@/components/admin/user/UserList";
import UserFilter from '@/components/admin/user/UserFilter';
import UserBan from '@/components/admin/user/modal/UserBan';
import { useUserContext } from '@/contexts/admin/UserContext';
import type { User } from '@/services/admin/UserService';

const UserPage = () => {
  const { setFilterParams, setPage, handleBanUser } = useUserContext();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('Đang hoạt động');
  const [isBanModalOpen, setIsBanModalOpen] = useState(false);
  const [selectedUserForBan, setSelectedUserForBan] = useState<User | null>(null);
  
  const [fromDate, setFromDate] = useState<string>(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}-01`;
  });
  
  const [toDate, setToDate] = useState<string>(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  });

  useEffect(() => {
    const params: any = {};
    if (search) params.email = search;
    if (filterStatus !== 'all') params.status = filterStatus;
    setFilterParams(params);
    setPage(1);
  }, [search, filterStatus, setFilterParams, setPage]);

  const handleFromDateChange = (date: string) => {
    setFromDate(date);
    setFilterParams({ fromDate: date ? { year: parseInt(date.split('-')[0]), month: parseInt(date.split('-')[1]), dayOfMonth: parseInt(date.split('-')[2]) } : undefined });
    setPage(1);
  };

  const handleToDateChange = (date: string) => {
    setToDate(date);
    setFilterParams({ toDate: date ? { year: parseInt(date.split('-')[0]), month: parseInt(date.split('-')[1]), dayOfMonth: parseInt(date.split('-')[2]) } : undefined });
    setPage(1);
  };

  const handleFilterChange = (status: string) => {
    setFilterStatus(status);
  };

  const handleBanClick = (user: User) => {
    setSelectedUserForBan(user);
    setIsBanModalOpen(true);
  };

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
        <div className='flex items-center gap-3 flex-1 justify-end max-w-3xl'>
          <div className='w-full'>
            <CustomDateRangePicker
              fromDate={fromDate}
              toDate={toDate}
              onFromDateChange={handleFromDateChange}
              onToDateChange={handleToDateChange}
            />
          </div>
          <div className='max-w-80 w-full'>
            <SearchBox
              value={search}
              onChange={setSearch}
              placeholder='Tìm kiếm theo email...'
            />
          </div>
        </div>
      </div>
      <UserFilter 
        status={filterStatus} 
        onFilterChange={handleFilterChange} 
      />
      <UserList onBanClick={handleBanClick} />
      
      <UserBan
        open={isBanModalOpen}
        onClose={() => {
          setIsBanModalOpen(false);
          setSelectedUserForBan(null);
        }}
        onConfirm={async () => {
          if (selectedUserForBan) {
            await handleBanUser(selectedUserForBan.userId);
          }
          setIsBanModalOpen(false);
          setSelectedUserForBan(null);
        }}
        userName={selectedUserForBan?.name || ''}
        isActive={selectedUserForBan?.status === 'Đang hoạt động'}
      />
    </div>
  );
};

export default UserPage;
