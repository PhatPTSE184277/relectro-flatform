import React, { useState } from "react";
import type { Post } from "@/types/post";
import PostShow from "./PostShow";
import PostRowSkeleton from "./PostTableSkeleton";
import PostReject from "./modal/PostReject";
import PostApprove from "./modal/PostApprove";
import { CheckSquare, Square, CheckCircle, XCircle } from 'lucide-react';
import { PostStatus } from '@/enums/PostStatus';

interface PostListProps {
  posts: Post[];
  loading: boolean;
  status: string;
  onApprove: (postId: string) => void;
  onReject: (postId: string, reason: string) => void;
  onView: (post: Post) => void;
  selectedPostIds: string[];
  onToggleSelect: (postId: string) => void;
  onToggleSelectAll: () => void;
  onBulkApprove: () => void;
  onBulkReject: () => void;
  page: number;
  pageSize: number;
}

const PostList = React.forwardRef<HTMLDivElement, PostListProps>(({
  posts,
  loading,
  status,
  onApprove,
  onReject,
  onView,
  selectedPostIds,
  onToggleSelect,
  onToggleSelectAll,
  onBulkApprove,
  onBulkReject,
  page,
  pageSize,
}, ref) => {
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectingPostId, setRejectingPostId] = useState<string | null>(null);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [approvingPostId, setApprovingPostId] = useState<string | null>(null);

  const handleReject = (postId: string) => {
    setRejectingPostId(postId);
    setIsRejectModalOpen(true);
  };

  const handleConfirmReject = (reason: string) => {
    if (onReject && rejectingPostId) {
      onReject(rejectingPostId, reason);
    }
    setIsRejectModalOpen(false);
    setRejectingPostId(null);
  };

  const handleApprove = (postId: string) => {
    setApprovingPostId(postId);
    setIsApproveModalOpen(true);
  };

  const handleConfirmApprove = () => {
    if (onApprove && approvingPostId) {
      onApprove(approvingPostId);
    }
    setIsApproveModalOpen(false);
    setApprovingPostId(null);
  };

  const handleBulkRejectClick = () => {
    onBulkReject(); // Mở modal từ page.tsx
  };

  const isPending = status === PostStatus.Pending || status === 'Chờ duyệt';
  const allCurrentPageSelected = posts.length > 0 && posts.every(p => selectedPostIds.includes(p.id));

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
      {/* Bulk Actions Bar */}
      {isPending && selectedPostIds.length > 0 && (
        <div className="bg-primary-50 border-b border-primary-200 px-4 py-3 flex items-center justify-between">
          <span className="text-sm font-medium text-primary-700">
            Đã chọn {selectedPostIds.length} bài đăng
          </span>
          <div className="flex gap-2">
            <button
              onClick={onBulkApprove}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition flex items-center gap-2"
            >
              <CheckCircle size={16} />
              Duyệt {selectedPostIds.length} bài
            </button>
            <button
              onClick={handleBulkRejectClick}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition flex items-center gap-2"
            >
              <XCircle size={16} />
              Từ chối {selectedPostIds.length} bài
            </button>
          </div>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden">
            <table className="min-w-full text-sm text-gray-800" style={{ tableLayout: 'fixed' }}>
              <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-semibold">
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
                  <th className="py-3 px-4 text-center" style={{ width: '60px' }}>STT</th>
                  <th className="py-3 px-4 text-left" style={{ width: '180px' }}>Người gửi</th>
                  <th className="py-3 px-4 text-left" style={{ width: '150px' }}>Danh mục</th>
                  <th className="py-3 px-4 text-left" style={{ width: 'auto' }}>Địa chỉ</th>
                  <th className="py-3 px-4 text-left" style={{ width: '130px' }}>Ngày đăng</th>
                  <th className="py-3 px-4 text-center" style={{ width: '140px' }}>Hành động</th>
                </tr>
              </thead>
            </table>
          </div>
          <div className="max-h-89 overflow-y-auto" ref={ref}>
            <table className="min-w-full text-sm text-gray-800" style={{ tableLayout: 'fixed' }}>
              <tbody>
                {loading ? (
                  Array.from({ length: 6 }).map((_, idx) => (
                    <PostRowSkeleton key={idx} />
                  ))
                ) : posts.length > 0 ? (
                  posts.map((p, idx) => (
                    <PostShow
                      key={p.id}
                      post={p}
                      stt={(page - 1) * pageSize + idx + 1}
                      onView={() => onView(p)}
                      onApprove={handleApprove}
                      onReject={() => handleReject(p.id)}
                      hideImage
                      isLast={idx === posts.length - 1}
                      isSelected={selectedPostIds.includes(p.id)}
                      onToggleSelect={onToggleSelect}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-400">
                      Không có bài đăng nào.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <PostReject
        open={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        onConfirm={handleConfirmReject}
      />

      <PostApprove
        open={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        onConfirm={handleConfirmApprove}
      />
    </div>
  );
});

PostList.displayName = "PostList";

export default PostList;