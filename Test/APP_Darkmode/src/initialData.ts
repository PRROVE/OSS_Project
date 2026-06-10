import { AppState, Task, ChatMessage } from './types.ts';

export const CATEGORIES = [
  { id: 'academics', label: '학습', eng: 'Academics', icon: 'school', color: 'text-violet-400' },
  { id: 'vitality', label: '건강', eng: 'Vitality', icon: 'heart', color: 'text-emerald-400' },
  { id: 'career', label: '업무', eng: 'Career', icon: 'briefcase', color: 'text-blue-400' },
  { id: 'selfdev', label: '성장', eng: 'Self-Dev', icon: 'trending-up', color: 'text-violet-400' },
  { id: 'routine', label: '습관', eng: 'Routine', icon: 'rotate-cw', color: 'text-emerald-400' },
  { id: 'efficiency', label: '생산성', eng: 'Efficiency', icon: 'zap', color: 'text-yellow-400' },
  { id: 'social', label: '관계', eng: 'Social', icon: 'users', color: 'text-blue-400' },
  { id: 'mindfulness', label: '웰니스', eng: 'Mindfulness', icon: 'leaf', color: 'text-emerald-400' },
];

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: '아키텍처 사양 상세화',
    status: 'in_progress',
    description: '새로운 Aura 뉴럴 엔진 문서 및 노드에 대한 상세 검토...',
    duration: '45m',
    priority: 'high',
    progress: 75
  },
  {
    id: 'task-2',
    title: 'UI 모션 경로 검토',
    status: 'upcoming',
    description: '대시보드의 글래스모피즘 블러 전환 효과에 대해 모션 팀과 협의하세요.',
    duration: '1h 20m',
    priority: 'medium',
    progress: 0
  },
  {
    id: 'task-3',
    title: 'Aura와 아침 동기화',
    status: 'completed',
    description: '수면 주기 및 컨디션 조절을 위한 AI 코치 피드백 동기화 세션 완료',
    duration: '15m',
    priority: 'low',
    progress: 100,
    completedTime: '오전 9:15'
  },
  {
    id: 'task-4',
    title: '데이터 노드 정리',
    status: 'in_progress',
    description: '분산 환경에 맞게 캐시 노드 및 유휴 리소스 정리 작업',
    duration: '30m',
    priority: 'medium',
    progress: 30
  }
];

export const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'ai',
    text: '수면 패턴과 오늘의 일정을 바탕으로 볼 때, 오후 2시경에 창의력이 최고조에 달할 것으로 보입니다. 이 시간을 딥 워크 시간으로 예약할까요?',
    timestamp: '오전 10:42'
  }
];

export const DEFAULT_STATE: AppState = {
  isLoggedIn: false,
  completedOnboarding: false,
  user: {
    name: '홍길동',
    email: 'user@example.com',
    profilePic: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
  },
  aiPartner: {
    persona: 'logical',
    expertise: ['프로젝트 기획'],
    frequency: 'moderate',
    customInstructions: '대표님이라고 불러주세요. 모든 제안은 3단계 분석 결과를 포함해서 보고해주세요.'
  },
  settings: {
    emailNotifications: true,
    pushNotifications: true,
    theme: 'dark'
  },
  tasks: INITIAL_TASKS,
  chatMessages: INITIAL_CHAT_MESSAGES
};

export const STORAGE_KEY = 'aura_state';

export function getStoredState(): AppState {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      // Ensure arrays are initialized if missing
      if (!parsed.tasks) parsed.tasks = INITIAL_TASKS;
      if (!parsed.chatMessages) parsed.chatMessages = INITIAL_CHAT_MESSAGES;
      return parsed;
    }
  } catch (e) {
    console.error('Error loading localStorage state for Aura:', e);
  }
  return DEFAULT_STATE;
}

export function saveStoredState(state: AppState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Error saving localStorage state for Aura:', e);
  }
}
