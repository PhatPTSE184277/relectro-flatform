import React, { useState, useEffect } from 'react';
import { useSendNotiContext } from '@/contexts/admin/SendNotiContext';
import { X, ArrowLeft } from 'lucide-react';
import Pagination from '@/components/ui/Pagination';
import SearchBox from '@/components/ui/SearchBox';
import UserList from './UserList';
import CustomDateRangePicker from '@/components/ui/CustomDateRangePicker';
import { getFirstDayOfMonthString, getTodayString } from '@/utils/getDayString';
import { getAllUsers } from '@/services/admin/SendNotiService';

interface CreateNotiModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const CreateNotiModal: React.FC<CreateNotiModalProps> = ({
    open,
    onClose,
    onSuccess
}) => {
    const { users, loading, fetchUsers, sendNotification, page, setPage, totalPages } = useSendNotiContext();
    const [step, setStep] = useState(1); // 1: title/message, 2: user selection
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
    const [allUserIds, setAllUserIds] = useState<string[]>([]); // Store all user IDs for select all
    const [search, setSearch] = useState('');
    const [fromDate, setFromDate] = useState(getFirstDayOfMonthString);
    const [toDate, setToDate] = useState(getTodayString);
    // Remove local page and totalPages state, use context instead
    const [sending, setSending] = useState(false);
    const pageSize = 10;

    useEffect(() => {
        if (open && step === 2) {
            const params: any = { page, limit: pageSize, status: 'Đang hoạt động' };
            if (search) params.email = search;
            if (fromDate) params.fromDate = fromDate;
            if (toDate) params.toDate = toDate;
            fetchUsers(params);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, step, page, search, fromDate, toDate]);

    // Fetch all user IDs when modal opens at step 2 (for select all functionality)
    useEffect(() => {
        let ignore = false;
        if (open && step === 2) {
            const params: any = { page: 1, limit: 10000, status: 'Đang hoạt động' };
            if (search) params.email = search;
            if (fromDate) params.fromDate = fromDate;
            if (toDate) params.toDate = toDate;
            getAllUsers(params).then((res: any) => {
                if (!ignore && res && res.data) {
                    setAllUserIds(res.data.map((u: any) => u.userId));
                }
            });
        }
        return () => { ignore = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, step, search, fromDate, toDate]);

    const handleToggleSelect = (userId: string) => {
        setSelectedUserIds(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const handleToggleSelectAll = () => {
        // Check if all users are selected
        const allSelected = allUserIds.length > 0 && selectedUserIds.length === allUserIds.length;

        if (allSelected) {
            // Deselect all
            setSelectedUserIds([]);
        } else {
            // Select all users (across all pages)
            setSelectedUserIds([...allUserIds]);
        }
    };

    const handleClose = () => {
        setStep(1);
        setTitle('');
        setMessage('');
        setSelectedUserIds([]);
        setAllUserIds([]);
        setSearch('');
        setFromDate(getFirstDayOfMonthString);
        setToDate(getTodayString);
        setPage(1);
        onClose();
    };

    const handleContinue = () => {
        if (!title.trim() || !message.trim()) return;
        setStep(2);
    };

    const handleBack = () => {
        setStep(1);
    };

    const handleSubmit = async () => {
        if (!title.trim() || !message.trim() || selectedUserIds.length === 0) return;

        setSending(true);
        try {
            await sendNotification({
                userIds: selectedUserIds,
                title: title.trim(),
                message: message.trim()
            });
            handleClose();
            onSuccess();
        } catch (err) {
            console.error('Send notification error', err);
        } finally {
            setSending(false);
        }
    };

    if (!open) return null;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
            <div className='absolute inset-0 bg-black/30 backdrop-blur-sm'></div>

            <div className='relative w-full max-w-6xl bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-10 max-h-[98vh] min-h-[90vh]'>
                {/* Header */}
                <div className='flex justify-between items-center p-6 border-b bg-linear-to-r from-primary-50 to-primary-100'>
                    <div className='flex items-center gap-3'>
                        {step === 2 && (
                            <button
                                onClick={handleBack}
                                className='text-gray-600 hover:text-primary-600 transition cursor-pointer'
                            >
                                <ArrowLeft size={24} />
                            </button>
                        )}
                        <h2 className='text-2xl font-bold text-gray-800'>
                            {step === 1 ? 'Tạo thông báo mới' : 'Chọn người nhận'}
                        </h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className='text-gray-400 hover:text-red-500 text-3xl font-light cursor-pointer transition'
                    >
                        <X size={28} />
                    </button>
                </div>

                {/* Body */}
                <div className='flex-1 overflow-y-auto p-6 space-y-5 bg-gray-50'>
                    {step === 1 ? (
                        /* Step 1: Title and Message */
                        <div className='space-y-4'>
                            <div className='space-y-2'>
                                <label className='block text-sm font-medium text-gray-700'>
                                    Tiêu đề <span className='text-red-500'>*</span>
                                </label>
                                <input
                                    type='text'
                                    className='w-full border border-gray-200 rounded-xl p-3 text-gray-800 placeholder-gray-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none transition-all duration-200 bg-white'
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder='Nhập tiêu đề thông báo...'
                                    maxLength={100}
                                />
                                <p className='text-xs text-gray-500'>{title.length}/100 ký tự</p>
                            </div>

                            <div className='space-y-2'>
                                <label className='block text-sm font-medium text-gray-700'>
                                    Nội dung <span className='text-red-500'>*</span>
                                </label>
                                <textarea
                                    className='w-full border border-gray-200 rounded-xl p-3 text-gray-800 placeholder-gray-400 focus:border-primary-400 focus:ring-2 focus:ring-primary-100 outline-none resize-none transition-all duration-200 bg-white'
                                    rows={8}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder='Nhập nội dung thông báo...'
                                    maxLength={500}
                                />
                                <p className='text-xs text-gray-500'>{message.length}/500 ký tự</p>
                            </div>
                        </div>
                    ) : (
                        /* Step 2: User Selection */
                        <div className='space-y-4'>
                            <div className='flex gap-3'>
                                <div className='flex-1'>
                                    <SearchBox
                                        value={search}
                                        onChange={setSearch}
                                        placeholder='Tìm kiếm theo email...'
                                    />
                                </div>
                                <div className='w-80'>
                                    <CustomDateRangePicker
                                        fromDate={fromDate}
                                        toDate={toDate}
                                        onFromDateChange={setFromDate}
                                        onToDateChange={setToDate}
                                    />
                                </div>
                            </div>

                            <UserList
                                users={users}
                                loading={loading}
                                selectedUserIds={selectedUserIds}
                                allUserIds={allUserIds}
                                onToggleSelect={handleToggleSelect}
                                onToggleSelectAll={handleToggleSelectAll}
                                page={page}
                                pageSize={pageSize}
                            />

                            <Pagination
                                page={page}
                                totalPages={totalPages}
                                onPageChange={setPage}
                            />
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className='flex items-center justify-between gap-3 p-6 border-t bg-gray-50'>
                    {step === 2 && selectedUserIds.length > 0 ? (
                        <span className='text-sm font-medium text-gray-700'>
                            Đã chọn {selectedUserIds.length} người
                        </span>
                    ) : <span />}
                    <div className='flex gap-3'>
                        {step === 1 ? (
                            <button
                                onClick={handleContinue}
                                disabled={!title.trim() || !message.trim()}
                                className={`px-6 py-2.5 rounded-xl transition font-medium cursor-pointer ${
                                    !title.trim() || !message.trim()
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-primary-600 text-white hover:bg-primary-700'
                                }`}
                            >
                                Tiếp tục
                            </button>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                disabled={selectedUserIds.length === 0 || sending}
                                className={`px-6 py-2.5 rounded-xl transition font-medium cursor-pointer ${
                                    selectedUserIds.length === 0 || sending
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-primary-600 text-white hover:bg-primary-700'
                                }`}
                            >
                                {sending ? 'Đang gửi...' : 'Gửi thông báo'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateNotiModal;
