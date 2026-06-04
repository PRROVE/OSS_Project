export interface Todo {
  id: string;
  title: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  date: string; // e.g. "오늘", "내일", "이번 주", "2026-06-04"
  time: string; // e.g. "07:00", "14:00"
  completed: boolean;
  status: 'normal' | 'failed' | 'completed';
  notes?: string;
}

export interface Insight {
  id: string;
  type: 'overflow' | 'pattern' | 'routine' | 'difficulty';
  title: string;
  description: string;
  badge?: string;
  buttonText?: string;
  secondaryButtonText?: string;
  status: 'pending' | 'applied' | 'dismissed';
}

export interface CoachingHistory {
  id: string;
  date: string;
  title: string;
  status: 'applied' | 'dismissed';
  detail?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
  customInstruction: string;
  aiPersona: 'friendly' | 'logical' | 'firm';
  aiExpertise: string[];
  aiFrequency: 'minimal' | 'moderate' | 'active';
  notifications: {
    email: boolean;
    push: boolean;
  };
  theme: 'light' | 'dark';
}

export type ViewType = 'login' | 'onboarding' | 'dashboard' | 'todos' | 'analytics' | 'coach' | 'settings';
