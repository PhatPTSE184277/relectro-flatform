import { IoEyeOutline } from 'react-icons/io5';
import TaskShow from './TaskShow';

type Task = {
    id: string;
    title: string;
    description?: string;
    assignedByName?: string;
    priority: string;
    status: string;
    dueDate: number;
};

interface TaskListProps {
    tasks: Task[];
    loading: boolean;
    onView: (task: Task) => void;
    onStatusUpdate: (taskId: string, newStatus: string) => void;
    getPriorityColor: (priority: string) => string;
    getStatusColor: (status: string) => string;
    getStatusOptions: (currentStatus: string) => string[];
    isOverdue: (dueDate: number, status: string) => boolean;
    formatDate: (timestamp: number) => string;
    TaskTableSkeleton: React.FC;
}

const TaskList: React.FC<TaskListProps> = ({
    tasks,
    loading,
    onView,
    onStatusUpdate,
    getPriorityColor,
    getStatusColor,
    getStatusOptions,
    isOverdue,
    formatDate,
    TaskTableSkeleton,
}) => {
    return (
        <div className='bg-white rounded-2xl shadow-xl border border-gray-100 p-6'>
            {loading ? (
                <TaskTableSkeleton />
            ) : (
                <div className='overflow-x-auto'>
                    <table className='w-full text-gray-900'>
                        <thead>
                            <tr className='border-b border-gray-200'>
                                <th className='text-left py-3 px-2 font-semibold'>Task</th>
                                <th className='text-left py-3 px-2 font-semibold'>Assigned By</th>
                                <th className='text-left py-3 px-2 font-semibold'>Priority</th>
                                <th className='text-left py-3 px-2 font-semibold'>Status</th>
                                <th className='text-left py-3 px-2 font-semibold'>Due Date</th>
                                <th className='text-left py-3 px-2 font-semibold'>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Array.isArray(tasks) && tasks.length > 0 ? (
                                tasks.map((task) => (
                                    <TaskShow
                                        key={task.id}
                                        task={task}
                                        onView={onView}
                                        onStatusUpdate={onStatusUpdate}
                                        getPriorityColor={getPriorityColor}
                                        getStatusColor={getStatusColor}
                                        getStatusOptions={getStatusOptions}
                                        isOverdue={isOverdue}
                                        formatDate={formatDate}
                                    />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className='text-center py-8 text-gray-500'>
                                        No tasks found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default TaskList;