import {
  IoCloseOutline,
  IoPersonOutline,
  IoCalendarOutline,
  IoFlagOutline,
  IoCheckmarkCircleOutline,
  IoTimeOutline,
  IoDocumentTextOutline,
  IoWarningOutline,
} from "react-icons/io5";

type Task = {
  id: string;
  title: string;
  description?: string;
  assignedByName?: string;
  dueDate: number;
  priority: string;
  status: string;
  createdAt: number;
  updatedAt?: number;
};

interface EmployeeViewTaskModalProps {
  task: Task;
  onClose: () => void;
  onStatusUpdate: (taskId: string, newStatus: string) => void;
}

const EmployeeViewTaskModal: React.FC<EmployeeViewTaskModalProps> = ({
  task,
  onClose,
  onStatusUpdate,
}) => {
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDueDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getPriorityBadge = (priority: string) => {
    const colors: Record<string, string> = {
      high: "bg-red-100 text-red-600",
      medium: "bg-yellow-100 text-yellow-600",
      low: "bg-green-100 text-green-600",
    };
    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
          colors[priority] || colors.medium
        }`}
      >
        <IoFlagOutline />
        {priority?.charAt(0).toUpperCase() + priority?.slice(1)}
      </span>
    );
  };

  const getStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      completed: "bg-green-100 text-green-600",
      "in-progress": "bg-blue-100 text-blue-600",
      pending: "bg-orange-100 text-orange-600",
    };
    const icons: Record<string, JSX.Element> = {
      completed: <IoCheckmarkCircleOutline />,
      "in-progress": <IoTimeOutline />,
      pending: <IoTimeOutline />,
    };
    return (
      <span
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
          colors[status] || colors.pending
        }`}
      >
        {icons[status] || icons.pending}
        {status
          ?.split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")}
      </span>
    );
  };

  const isOverdue = () => {
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    return dueDate < today && task.status !== "completed";
  };

  const getStatusOptions = (currentStatus: string) => {
    const statusOptions: Record<string, string[]> = {
      pending: ["in-progress"],
      "in-progress": ["completed", "pending"],
      completed: ["in-progress"],
    };
    return statusOptions[currentStatus] || [];
  };

  const handleStatusChange = (newStatus: string) => {
    onStatusUpdate(task.id, newStatus);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      ></div>
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-6 max-h-[90vh] overflow-y-auto border border-gray-100">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Task Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-blue-500 p-1 rounded-lg hover:bg-blue-50 transition-colors"
          >
            <IoCloseOutline size={24} />
          </button>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl">
                <IoDocumentTextOutline />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900">{task.title}</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {getPriorityBadge(task.priority)}
                  {getStatusBadge(task.status)}
                  {isOverdue() && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm font-medium">
                      <IoWarningOutline />
                      Overdue
                    </span>
                  )}
                </div>
              </div>
            </div>

            {task.description && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  Description
                </h4>
                <p className="text-gray-700">{task.description}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">
                Assignment Details
              </h4>

              <div className="flex items-center gap-3 text-gray-600">
                <IoPersonOutline className="text-purple-400" />
                <div>
                  <p className="text-xs text-gray-400">Assigned By</p>
                  <p className="text-gray-900">{task.assignedByName || "Unknown"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-gray-600">
                <IoCalendarOutline className="text-purple-400" />
                <div>
                  <p className="text-xs text-gray-400">Due Date</p>
                  <p className={`text-gray-900 ${isOverdue() ? "text-red-500" : ""}`}>
                    {formatDueDate(task.dueDate)}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-gray-900 border-b border-gray-100 pb-2">
                Task Information
              </h4>

              <div className="flex items-center gap-3 text-gray-600">
                <IoCalendarOutline className="text-purple-400" />
                <div>
                  <p className="text-xs text-gray-400">Created At</p>
                  <p className="text-gray-900">{formatDate(task.createdAt)}</p>
                </div>
              </div>

              {task.updatedAt && task.updatedAt !== task.createdAt && (
                <div className="flex items-center gap-3 text-gray-600">
                  <IoCalendarOutline className="text-purple-400" />
                  <div>
                    <p className="text-xs text-gray-400">Last Updated</p>
                    <p className="text-gray-900">{formatDate(task.updatedAt)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">
              Update Status
            </h4>
            <div className="flex flex-wrap gap-2">
              {getStatusOptions(task.status).map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:scale-105 transition-all duration-300 cursor-pointer"
                >
                  Mark as{" "}
                  {status
                    .split("-")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </button>
              ))}
            </div>
            {getStatusOptions(task.status).length === 0 && (
              <p className="text-gray-400 text-sm">
                No status changes available for this task.
              </p>
            )}
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-gray-900 mb-3">
              Progress Summary
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center">
                <div
                  className={`w-4 h-4 mx-auto rounded-full mb-2 ${
                    task.status === "pending" ||
                    task.status === "in-progress" ||
                    task.status === "completed"
                      ? "bg-green-400"
                      : "bg-gray-400"
                  }`}
                ></div>
                <p className="text-xs text-gray-400">Created</p>
              </div>
              <div className="text-center">
                <div
                  className={`w-4 h-4 mx-auto rounded-full mb-2 ${
                    task.status === "in-progress" || task.status === "completed"
                      ? "bg-green-400"
                      : "bg-gray-400"
                  }`}
                ></div>
                <p className="text-xs text-gray-400">In Progress</p>
              </div>
              <div className="text-center">
                <div
                  className={`w-4 h-4 mx-auto rounded-full mb-2 ${
                    task.status === "completed" ? "bg-green-400" : "bg-gray-400"
                  }`}
                ></div>
                <p className="text-xs text-gray-400">Completed</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-6 border-t border-gray-100 mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmployeeViewTaskModal;