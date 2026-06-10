export type Theme = 'light' | 'dark';

export interface UserProfile {
  name: string;
  email: string;
  profilePic: string;
}

export interface AIPartnerSettings {
  persona: 'friendly' | 'logical' | 'assertive';
  expertise: string[];
  frequency: 'needed' | 'moderate' | 'proactive';
  customInstructions: string;
}

export interface AppSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  theme: Theme;
}

export type TaskStatus = 'in_progress' | 'upcoming' | 'completed';
export type TaskPriority = 'high' | 'medium' | 'low';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  description: string;
  duration: string;
  priority: TaskPriority;
  progress: number; // 0 to 100
  completedTime?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface AppState {
  isLoggedIn: boolean;
  completedOnboarding: boolean;
  user: UserProfile;
  aiPartner: AIPartnerSettings;
  settings: AppSettings;
  tasks: Task[];
  chatMessages: ChatMessage[];
}
