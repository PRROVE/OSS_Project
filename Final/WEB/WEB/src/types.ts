/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Priority = 'high' | 'medium' | 'low';

export type Category = 'Work' | 'Meeting' | 'Research' | 'Admin' | 'Health' | 'Personal' | 'Study' | 'Team' | 'Project' | 'Other';

// 작업 상태: 진행 전 → 진행 중 → 완료 (실패는 별도 플래그)
export type TaskStatus = 'todo' | 'inprogress' | 'done';

export interface Task {
  id: string;
  title: string;
  priority: Priority;
  category: Category;
  completed: boolean;
  status: TaskStatus;
  timeStart?: string;
  timeEnd?: string;
  date: string; // YYYY-MM-DD format — 예정일 (오늘/내일/이번주 분류 기준)
  deadline?: string; // YYYY-MM-DD format — 마감일 (제출/완료 기한)
  description: string;
  duration?: string; // Estimated duration (e.g. "2시간 30분")
  failed?: boolean; // For display of failed scrum meetings etc.
  aiRecommendation?: string; // e.g. "AI: 이전 미팅 노트를 참조하세요"
  assignee?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
  gender?: 'male' | 'female' | 'none';
  phone?: string;
  streak: number;
  completedCount: number;
  totalCount: number;
  successRate?: number;
  dailyGoalCount?: number;
  coachTone?: 'friendly' | 'strict' | 'analytic';
  cognitiveTipsEnabled?: boolean;
}

export interface CoachingInsight {
  id: string;
  title: string;
  subTitleKOR: string;
  description: string;
  recommendationTitle: string;
  recommendationDesc: string;
  type: 'warning' | 'info' | 'routine';
  applied: boolean;
  onApplyAction?: () => void;
}

export interface CoachingHistoryItem {
  id: string;
  time: string;
  title: string;
  description: string;
  tag?: string;
}

export type ViewTab = 'dashboard' | 'todos' | 'analytics' | 'coach' | 'community' | 'onboarding' | 'login' | 'settings';
