import { IoFilterOutline } from 'react-icons/io5';

interface TaskFilterProps {
  status: string;
  stats: {
    pending: number;
    inProgress: number;
    completed: number;
  };
  onFilterChange: (status: string) => void;
}

const TaskFilter: React.FC<TaskFilterProps> = ({ status, stats, onFilterChange }) => (
  <div className='bg-white rounded-2xl shadow-xl border border-gray-100 p-4 mb-6'>
    <div className='flex items-center gap-2 mb-4'>
      <IoFilterOutline className='text-gray-500' />
      <h3 className='text-gray-900 font-medium'>Filter Tasks</h3>
    </div>
    <div className='flex flex-wrap gap-2'>
      <button
        onClick={() => onFilterChange('')}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
          status === ''
            ? 'bg-purple-100 text-purple-700 shadow'
            : 'bg-gray-100 text-gray-600 hover:bg-purple-50 hover:text-purple-600'
        }`}
      >
        All Tasks
      </button>
      <button
        onClick={() => onFilterChange('pending')}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
          status === 'pending'
            ? 'bg-orange-100 text-orange-700 shadow'
            : 'bg-gray-100 text-gray-600 hover:bg-orange-50 hover:text-orange-600'
        }`}
      >
        Pending ({stats.pending})
      </button>
      <button
        onClick={() => onFilterChange('in-progress')}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
          status === 'in-progress'
            ? 'bg-blue-100 text-blue-700 shadow'
            : 'bg-gray-100 text-gray-600 hover:bg-blue-50 hover:text-blue-600'
        }`}
      >
        In Progress ({stats.inProgress})
      </button>
      <button
        onClick={() => onFilterChange('completed')}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
          status === 'completed'
            ? 'bg-green-100 text-green-700 shadow'
            : 'bg-gray-100 text-gray-600 hover:bg-green-50 hover:text-green-600'
        }`}
      >
        Completed ({stats.completed})
      </button>
    </div>
  </div>
);

export default TaskFilter;