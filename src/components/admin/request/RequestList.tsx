import React, { useState } from "react";
import type { Post } from "@/types/post";
import RequestShow from "./RequestShow";
import RequestRowSkeleton from "./RequestTableSkeleton";
import RequestReject from "./modal/RequestReject";
import RequestApprove from "./modal/RequestApprove";
import { CheckSquare, Square, CheckCircle, XCircle } from 'lucide-react';
import { PostStatus } from '@/enums/PostStatus';

interface RequestListProps {
  requests: Post[];
  loading: boolean;
  status: string;
  onApprove: (requestId: string) => void;
  onReject: (requestId: string, reason: string) => void;
  onView: (request: Post) => void;
  selectedRequestIds: string[];
  onToggleSelect: (requestId: string) => void;
  onToggleSelectAll: () => void;
  onBulkApprove: () => void;
  onBulkReject: () => void;
  page: number;
  pageSize: number;
}

const RequestList = React.forwardRef<HTMLDivElement, RequestListProps>(({
  requests,
  loading,
  status,
  onApprove,
  onReject,
  onView,
  selectedRequestIds,
  onToggleSelect,
  onToggleSelectAll,
  onBulkApprove,
  onBulkReject,
  page,
  pageSize,
}, ref) => {
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectingRequestId, setRejectingRequestId] = useState<string | null>(null);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [approvingRequestId, setApprovingRequestId] = useState<string | null>(null);

  const handleReject = (requestId: string) => {
    setRejectingRequestId(requestId);
    setIsRejectModalOpen(true);
  };

  const handleConfirmReject = (reason: string) => {
    if (onReject && rejectingRequestId) {
      onReject(rejectingRequestId, reason);
    }
    setIsRejectModalOpen(false);
    setRejectingRequestId(null);
  };

  const handleApprove = (requestId: string) => {
    setApprovingRequestId(requestId);
    setIsApproveModalOpen(true);
  };

  const handleConfirmApprove = () => {
    if (onApprove && approvingRequestId) {
      onApprove(approvingRequestId);
    }
    setIsApproveModalOpen(false);
    setApprovingRequestId(null);
  };

  const handleBulkRejectClick = () => {
    onBulkReject(); // Mở modal từ page.tsx
  };

  const isPending = status === PostStatus.Pending || status === 'Chờ duyệt';
  const allCurrentPageSelected = requests.length > 0 && requests.every(p => selectedRequestIds.includes(p.id));

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
      {/* Bulk Actions Bar */}
      {isPending && selectedRequestIds.length > 0 && (
        <div className="bg-primary-50 border-b border-primary-200 px-4 py-3 flex items-center justify-between">
          <span className="text-sm font-medium text-primary-700">
            Đã chọn {selectedRequestIds.length} yêu cầu
          </span>
          <div className="flex gap-2">
            <button
              onClick={onBulkApprove}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition flex items-center gap-2"
            >
              <CheckCircle size={16} />
              Duyệt {selectedRequestIds.length} yêu cầu
            </button>
            <button
              onClick={handleBulkRejectClick}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition flex items-center gap-2"
            >
              <XCircle size={16} />
              Từ chối {selectedRequestIds.length} yêu cầu
            </button>
          </div>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden">
            <div className="max-h-100  overflow-y-auto" ref={ref}>
              <table className="min-w-full text-sm text-gray-800 table-fixed">
                <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-semibold sticky top-0 z-10">
                  <tr>
                    <th className="py-3 px-4 text-center" style={{ width: '60px' }}>
                      {isPending && (
                        <button
                          onClick={onToggleSelectAll}
                          className="text-primary-600 hover:text-primary-800"
                        >
                          {allCurrentPageSelected ? <CheckSquare size={18} /> : <Square size={18} />}
                        </button>
                      )}
                    </th>
                    <th className="py-3 px-4 text-center w-16">STT</th>
                    <th className="py-3 px-4 text-left w-60">Người gửi</th>
                    <th className="py-3 px-4 text-left w-88">Danh mục</th>
                    <th className="py-3 px-4 text-left w-[550px]">Địa chỉ</th>
                    <th className="py-3 px-4 text-right w-72">Ngày đăng</th>
                    <th className="py-3 px-4 text-center w-36">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    Array.from({ length: 6 }).map((_, idx) => (
                      <RequestRowSkeleton key={idx} />
                    ))
                  ) : requests.length > 0 ? (
                    requests.map((r, idx) => (
                      <RequestShow
                        key={r.id}
                        post={r}
                        stt={(page - 1) * pageSize + idx + 1}
                        onView={() => onView(r)}
                        onApprove={handleApprove}
                        onReject={() => handleReject(r.id)}
                        hideImage
                        isLast={idx === requests.length - 1}
                        isSelected={selectedRequestIds.includes(r.id)}
                        onToggleSelect={onToggleSelect}
                      />
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="text-center py-8 text-gray-400">
                        Không có yêu cầu nào.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <RequestReject
        open={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={handleConfirmReject}
        showTags={true}
      />

      <RequestApprove
        open={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        onConfirm={handleConfirmApprove}
      />
    </div>
  );
});

RequestList.displayName = "RequestList";

export default RequestList;
