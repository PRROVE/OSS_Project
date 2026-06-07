export type CategoryType = "WORK" | "STUDY" | "MEETING" | "HOBBY" | "HEALTH" | "PROJECT" | "ADMIN" | "RESEARCH";

export interface Task {
  id: string;
  title: string;
  duration: string;
  category: CategoryType;
  completed: boolean;
  failed?: boolean;
  dueDateStr?: string; // e.g. "D-1", "D-2"
  timeStr?: string;    // e.g. "16:30", "12:00"
  aiTip?: string;      // AI helper comment if any
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface DiagnosisRecord {
  id: string;
  day: string; // "10", "09"
  dateStr: string; // "October 24, 2023"
  rate: number; // 88
  status: "최상" | "보통" | "주의" | "실패";
}

export interface CommunityFeed {
  id: string;
  authorName: string;
  authorEmail: string;
  authorRole: string;
  avatarUrl: string;
  timeAgo: string;
  content: string;
  imageUrl?: string;
  likes: number;
  likedByMe?: boolean;
  comments: Array<{
    id: string;
    author: string;
    avatarInitials: string;
    content: string;
    timeAgo: string;
  }>;
  sharedTasks?: Array<{
    title: string;
    duration: string;
    category: CategoryType;
    completed: boolean;
  }>;
}

export interface UserProfile {
  name: string;
  role: string;
  gender: string;
  phone: string;
  email: string;
}

export interface NotificationSettings {
  onDeadline: boolean;
  onDailyReview: boolean;
  onWeeklySummary: boolean;
}

export type CoachStyleType = "분석형" | "다정형" | "스파르타형";
