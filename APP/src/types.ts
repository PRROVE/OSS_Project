export interface Todo {
  id: string;
  title: string;
  time: string; // e.g. "14:00-16:30" or just "14:00"
  category: string; // e.g. "WORK", "MEETING", "ADMIN", "개인", "관리"
  completed: boolean;
  failed?: boolean;
  aiMemo?: string; // AI recommendations
}

export interface ChatMessage {
  id: string;
  role: "user" | "model";
  content: string;
  time: string;
}

export interface Post {
  id: string;
  authorName: string;
  authorRole: string;
  authorImage: string;
  content: string;
  timeString: string; // e.g. "2시간 전"
  likes: number;
  comments: number;
  hasLiked?: boolean;
  imgUrl?: string;
  sharedTodos?: { id: string; text: string; checked: boolean }[];
  sharedRoutine?: { title: string; text: string };
}
