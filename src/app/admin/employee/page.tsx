'use client';

import { useEffect, useState } from 'react';
import EmployeeViewTaskModal from '@/components/colector/employee/ViewTaskModal';
import api from '@/lib/axios';
import { toast } from 'react-toastify';
import TaskTableSkeleton from '@/components/colector/employee/TaskTableSkeleton';
import TaskList from '@/components/colector/employee/TaskList';
import TaskFilter from '@/components/colector/employee/TaskFilter';

type Task = {
    id: string;
    title: string;
    description?: string;
    assignedByName?: string;
    priority: 'high' | 'medium' | 'low' | string;
    status: 'pending' | 'in-progress' | 'completed' | string;
    dueDate: number;
};

type Stats = {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    overdue: number;
};

const EmployeeTaskPage = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [stats, setStats] = useState<Stats>({
        total: 0,
        pending: 0,
        inProgress: 0,
        completed: 0,
        overdue: 0
    });
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState<{ status: string }>({
        status: ''
    });

    const fetchTasks = async (status = '') => {
        try {
            setLoading(true);
            let url = '/employee/tasks';
            if (status) url += `?status=${status}`;

            const response = await api.get(url);
            if (response.data) {
                setTasks(response.data.tasks || []);
            }
        } catch (error: any) {
            console.error('Error fetching tasks:', error);
            toast.error('Failed to fetch tasks');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await api.get('/employee/tasks/stats');
            if (response.data) {
                setStats(response.data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    useEffect(() => {
        fetchTasks();
        fetchStats();
    }, []);

    const handleView = (task: Task) => {
        setSelectedTask(task);
        setIsViewModalOpen(true);
    };

    const handleStatusUpdate = async (taskId: string, newStatus: string) => {
        try {
            await api.patch(`/employee/tasks/${taskId}/status`, {
                status: newStatus
            });
            fetchTasks(filters.status);
            fetchStats();
            toast.success('Task status updated successfully!');
        } catch (error: any) {
            console.error('Error updating task status:', error);
            toast.error(
                error.response?.data?.error || 'Failed to update task status'
            );
        }
    };

    const handleFilterChange = (status: string) => {
        setFilters({ status });
        fetchTasks(status);
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high':
                return 'text-red-400 bg-red-500/20';
            case 'medium':
                return 'text-yellow-400 bg-yellow-500/20';
            case 'low':
                return 'text-green-400 bg-green-500/20';
            default:
                return 'text-gray-400 bg-gray-500/20';
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'text-green-400 bg-green-500/20';
            case 'in-progress':
                return 'text-blue-400 bg-blue-500/20';
            case 'pending':
                return 'text-orange-400 bg-orange-500/20';
            default:
                return 'text-gray-400 bg-gray-500/20';
        }
    };

    const isOverdue = (dueDate: number, status: string) => {
        return dueDate < Date.now() && status !== 'completed';
    };

    const getStatusOptions = (currentStatus: string) => {
        const statusOptions: Record<string, string[]> = {
            pending: ['in-progress'],
            'in-progress': ['completed', 'pending'],
            completed: ['in-progress']
        };
        return statusOptions[currentStatus] || [];
    };

    return (
        <>
            <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
                <div className='flex justify-between items-center mb-6'>
                    <h1 className='text-3xl font-bold text-gray-900'>
                        Nhân viên thu gom
                    </h1>
                </div>

                <TaskFilter
                    status={filters.status}
                    stats={stats}
                    onFilterChange={handleFilterChange}
                />

                <div className='bg-white rounded-2xl shadow-xl border border-gray-100 p-6'>
                    {loading ? (
                        <TaskTableSkeleton />
                    ) : (
                        <div className='overflow-x-auto'>
                            <TaskList
                                tasks={tasks}
                                loading={loading}
                                onView={handleView}
                                onStatusUpdate={handleStatusUpdate}
                                getPriorityColor={getPriorityColor}
                                getStatusColor={getStatusColor}
                                getStatusOptions={getStatusOptions}
                                isOverdue={isOverdue}
                                formatDate={formatDate}
                                TaskTableSkeleton={TaskTableSkeleton}
                            />
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default EmployeeTaskPage;
