/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TaskStatus = 'active' | 'upcoming' | 'completed' | 'pending';
export type TaskPriority = 'high' | 'medium' | 'low';

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  progress: number; // 0 to 100
  durationMinutes: number;
  priority: TaskPriority;
  category?: string;
  completedAt?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
}

export type AIPersona = 'friendly' | 'logical' | 'assertive';
export type AIFrequency = 'minimal' | 'moderate' | 'proactive';

export interface AIPartnerConfig {
  persona: AIPersona;
  expertiseAreas: string[];
  communicationFrequency: AIFrequency;
  customInstructions: string;
}

export interface CoachMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface OnboardingPreferences {
  categories: string[];
  isOnboarded: boolean;
}

export interface AppState {
  profile: UserProfile;
  aiPartner: AIPartnerConfig;
  tasks: TaskItem[];
  chatHistory: CoachMessage[];
  onboarding: OnboardingPreferences;
  theme: 'light' | 'dark';
}
