export interface Sender {
    userId: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    avatar: string;
    iat: number;
    ing: number;
}

export interface Schedule {
    dayName: string;
    pickUpDate: string;
    slots: {
        startTime: string;
        endTime: string;
    }[];
}

export interface Post {
  id: string;
  name: string;
  category: string;
  status: string;
  date: string;
  address: string;
  senderName?: string;
  thumbnailUrl?: string;
  images?: string[];
}

export interface ApiResponse<T> {
    data: T;
    message?: string;
    status?: number;
}

export type PostContextType = {
  posts: Post[];
  loading: boolean;
  fetchPosts: () => Promise<void>;
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  handleApprove: (postId: string) => Promise<void>;
  handleReject: (postId: string, reason: string) => Promise<void>;
  selectedPost: Post | null;
  fetchPostById: (postId: string) => Promise<void>;
  setSelectedPost: React.Dispatch<React.SetStateAction<Post | null>>;
};