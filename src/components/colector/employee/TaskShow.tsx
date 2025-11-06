import { IoEyeOutline } from 'react-icons/io5';

type Task = {
    id: string;
    title: string;
    description?: string;
    assignedByName?: string;
    priority: string;
    status: string;
    dueDate: number;
};

interface TaskShowProps {
    task: Task;
    onView: (task: Task) => void;
    onStatusUpdate: (taskId: string, newStatus: string) => void;
    getPriorityColor: (priority: string) => string;
    getStatusColor: (status: string) => string;
    getStatusOptions: (currentStatus: string) => string[];
    isOverdue: (dueDate: number, status: string) => boolean;
    formatDate: (timestamp: number) => string;
}

const TaskShow: React.FC<TaskShowProps> = ({
    task,
    onView,
    onStatusUpdate,
    getPriorityColor,
    getStatusColor,
    getStatusOptions,
    isOverdue,
    formatDate,
}) => {
    return (
        <tr className='border-b border-gray-100 hover:bg-gray-50'>
            <td className='py-3 px-2'>
                <div>
                    <p className='font-medium flex items-center gap-2 text-gray-900'>
                        {task.title}
                        {isOverdue(task.dueDate, task.status) && (
                            <span className='px-2 py-1 bg-red-100 text-red-600 rounded-full text-xs font-medium'>
                                Overdue
                            </span>
                        )}
                    </p>
                    {task.description && (
                        <p className='text-sm text-gray-500 truncate max-w-xs'>
                            {task.description}
                        </p>
                    )}
                </div>
            </td>
            <td className='py-3 px-2 text-gray-600'>
                {task.assignedByName || 'Unknown'}
            </td>
            <td className='py-3 px-2'>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                    {task.priority?.charAt(0).toUpperCase() + task.priority?.slice(1)}
                </span>
            </td>
            <td className='py-3 px-2'>
                <select
                    value={task.status}
                    onChange={(e) => onStatusUpdate(task.id, e.target.value)}
                    className={`px-2 py-1 rounded-full text-xs font-medium border-none bg-transparent ${getStatusColor(task.status)}`}
                >
                    <option value={task.status}>
                        {task.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </option>
                    {getStatusOptions(task.status).map(status => (
                        <option key={status} value={status}>
                            {status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </option>
                    ))}
                </select>
            </td>
            <td className={`py-3 px-2 ${isOverdue(task.dueDate, task.status) ? 'text-red-500' : 'text-gray-600'}`}>
                {formatDate(task.dueDate)}
            </td>
            <td className='py-3 px-2'>
                <button
                    onClick={() => onView(task)}
                    className='text-blue-500 hover:text-blue-700 p-1 rounded transition-colors cursor-pointer'
                    title='View Details'
                >
                    <IoEyeOutline />
                </button>
            </td>
        </tr>
    );
};

export default TaskShow;