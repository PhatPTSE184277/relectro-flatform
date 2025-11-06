import React, { useState } from "react";
import type { Post } from "@/types/post";
import PostShow from "./PostShow";
import PostRowSkeleton from "./PostTableSkeleton";
import PostReject from "./modal/PostReject";
import PostApprove from "./modal/PostApprove";

interface PostListProps {
  posts: Post[];
  loading: boolean;
  status: string;
  onApprove: (postId: string) => void;
  onReject: (postId: string, reason: string) => void;
  onView: (post: Post) => void;
}

const PostList: React.FC<PostListProps> = ({
  posts,
  loading,
  onApprove,
  onReject,
  onView,
}) => {
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

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-gray-800">
          <thead className="bg-gray-50 text-gray-700 uppercase text-xs font-semibold">
            <tr>
              <th className="py-3 px-4 text-left">Ảnh</th>
              <th className="py-3 px-4 text-left">Tiêu đề</th>
              <th className="py-3 px-4 text-left">Danh mục</th>
              <th className="py-3 px-4 text-left">Địa chỉ</th>
              <th className="py-3 px-4 text-left">Ngày đăng</th>
              <th className="py-3 px-4 text-center">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              Array.from({ length: 6 }).map((_, idx) => (
                <PostRowSkeleton key={idx} />
              ))
            ) : posts.length > 0 ? (
              posts.map((p) => (
                <PostShow
                  key={p.id}
                  post={p}
                  onView={() => onView(p)}
                  onApprove={handleApprove}
                  onReject={() => handleReject(p.id)}
                />
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-8 text-gray-400">
                  Không có bài đăng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
};

export default PostList;