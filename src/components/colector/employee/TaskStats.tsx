import {
  IoStatsChartOutline,
  IoTimeOutline,
  IoCheckmarkCircleOutline,
  IoWarningOutline,
} from "react-icons/io5";

type Stats = {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
};

interface TaskStatsProps {
  stats: Stats;
}

const TaskStats: React.FC<TaskStatsProps> = ({ stats }) => (
  <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">Total</p>
          <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
        </div>
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <IoStatsChartOutline className="text-blue-500" />
        </div>
      </div>
    </div>
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">Pending</p>
          <p className="text-2xl font-bold text-orange-500">{stats.pending}</p>
        </div>
        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
          <IoTimeOutline className="text-orange-500" />
        </div>
      </div>
    </div>
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">In Progress</p>
          <p className="text-2xl font-bold text-blue-500">{stats.inProgress}</p>
        </div>
        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
          <IoTimeOutline className="text-blue-500" />
        </div>
      </div>
    </div>
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">Completed</p>
          <p className="text-2xl font-bold text-green-500">{stats.completed}</p>
        </div>
        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
          <IoCheckmarkCircleOutline className="text-green-500" />
        </div>
      </div>
    </div>
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">Overdue</p>
          <p className="text-2xl font-bold text-red-500">{stats.overdue}</p>
        </div>
        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
          <IoWarningOutline className="text-red-500" />
        </div>
      </div>
    </div>
  </div>
);

export default TaskStats;