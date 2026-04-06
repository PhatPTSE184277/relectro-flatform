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
    setFilterParams((prev: any) => {
      const next = { ...prev };

      if (search) next.email = search;
      else delete next.email;

      if (filterStatus !== 'all') next.status = filterStatus;
      else delete next.status;

      if (fromDate) next.FromDate = fromDate;
      else delete next.FromDate;

      if (toDate) next.ToDate = toDate;
      else delete next.ToDate;

      // ensure legacy keys are not present
      delete next.fromDate;
      delete next.toDate;

      return next;
    });
    setPage(1);
  }, [search, filterStatus, fromDate, toDate, setFilterParams, setPage]);

  const handleFromDateChange = (date: string) => {
    setFromDate(date);
    setPage(1);
  };

  const handleToDateChange = (date: string) => {
    setToDate(date);
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
          <div className='min-w-fit'>
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
      <UserList onBanClick={handleBanClick} filterStatus={filterStatus} />
      
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
