import { Todo, Insight, CoachingHistory, UserProfile } from './types';

export const INITIAL_TODOS: Todo[] = [
  // 오늘 할 일 (Dashboard & To-dos Views)
  {
    id: 'todo-1',
    title: '아침 조깅 30분',
    category: '운동',
    priority: 'medium',
    date: '오늘',
    time: '07:00',
    completed: true,
    status: 'completed',
    notes: '가벼운 페이스로 3km 조깅하기'
  },
  {
    id: 'todo-2',
    title: '주간 리포트 작성 및 검토',
    category: '업무',
    priority: 'high',
    date: '오늘',
    time: '10:00',
    completed: false,
    status: 'normal',
    notes: '이번 주 성과 자료 취합 및 분석 정리'
  },
  {
    id: 'todo-3',
    title: '팀 미팅 준비 자료 정리',
    category: '업무',
    priority: 'medium',
    date: '오늘',
    time: '14:00',
    completed: false,
    status: 'normal',
    notes: '프로젝트 마일스톤 업데이트 사항 공유 준비'
  },
  {
    id: 'todo-4',
    title: '클린코드 3장 읽기',
    category: '독서',
    priority: 'low',
    date: '오늘',
    time: '21:00',
    completed: false,
    status: 'normal',
    notes: '좋은 이름을 짓기 위한 네이밍 규칙 관련'
  },
  {
    id: 'todo-5',
    title: '분기별 성과 보고서 초안 작성',
    category: '업무',
    priority: 'high',
    date: '오늘',
    time: '14:00',
    completed: false,
    status: 'normal',
    notes: 'Q2 성과 요약 및 시각 자료 준비'
  },
  {
    id: 'todo-6',
    title: '오전 요가 세션',
    category: '건강',
    priority: 'medium',
    date: '오늘',
    time: '07:00',
    completed: false,
    status: 'failed',
    notes: '유연성 및 호흡 단련 코칭 세션'
  },
  {
    id: 'todo-7',
    title: '팀 주간 회의 참석',
    category: '미팅',
    priority: 'medium',
    date: '오늘',
    time: '11:00',
    completed: true,
    status: 'completed',
    notes: '주간 이슈 브리핑 및 마일스톤 체크'
  },
  // 내일 할 일
  {
    id: 'todo-8',
    title: '새 프로젝트 킥오프 준비',
    category: '업무',
    priority: 'medium',
    date: '내일',
    time: '10:00',
    completed: false,
    status: 'normal',
    notes: '참가 인원 설정 및 아젠다 문서 공유'
  },
  {
    id: 'todo-9',
    title: '클라이언트 미팅 자료 전송',
    category: '중요',
    priority: 'high',
    date: '내일',
    time: '16:00',
    completed: false,
    status: 'normal',
    notes: '최종 가격 제안서 및 아키텍처 다이어그램'
  }
];

export const INITIAL_INSIGHTS: Insight[] = [
  {
    id: 'insight-1',
    type: 'overflow',
    title: '목표 과다 분석',
    description: '목표를 5개에서 3개로 줄여보세요. 집중력이 분산되고 있습니다.',
    buttonText: '적용하기',
    secondaryButtonText: '나중에',
    status: 'pending'
  },
  {
    id: 'insight-2',
    type: 'pattern',
    title: '생활 패턴 분석',
    description: '밤 11시 이후 목표 달성 실패율이 78%에 달합니다.',
    buttonText: '오전으로 이동',
    status: 'pending'
  },
  {
    id: 'insight-3',
    type: 'routine',
    title: '루틴 강화 분석',
    badge: '성공적',
    description: '운동 성공률이 92%입니다. 직후에 짧은 명상 습관을 연결하는 것을 제안합니다.',
    buttonText: '연결하기',
    secondaryButtonText: '무시하기',
    status: 'pending'
  },
  {
    id: 'insight-4',
    type: 'difficulty',
    title: '카테고리 난이도 분석',
    description: '공부 카테고리의 실패율이 높습니다. 목표를 더 작게 세분화해보세요.',
    buttonText: '세분화 제안 보기',
    status: 'pending'
  }
];

export const INITIAL_HISTORY: CoachingHistory[] = [
  {
    id: 'history-1',
    date: '어제, 오후 8:00',
    title: '독서 습관 시간대 변경 제안',
    status: 'applied',
    detail: '클린코드 독서 시간을 밤 11시에서 저녁 9시로 앞당김 - 실행 성공률 85% 향상'
  },
  {
    id: 'history-2',
    date: '10월 12일',
    title: '주말 수면 패턴 불규칙 경고',
    status: 'dismissed',
    detail: '주말 동안 평균 취침 시간이 2시간 지연되는 것에 대한 피드백 거부'
  },
  {
    id: 'history-3',
    date: '10월 8일',
    title: "새로운 '명상' 습관 추천 (스트레스 지수 기반)",
    status: 'applied',
    detail: '퇴근 직후 5분 심호흡 패턴 적용 - 데일리 피로 피크 수치 20% 감소'
  },
  {
    id: 'history-4',
    date: '10월 1일',
    title: '월간 회고 요약 및 다음 달 목표 설정 가이드',
    status: 'applied',
    detail: '9월 루틴 성공 지표 요약 제공 및 과도한 우선순위 재분포 완료'
  }
];

export const DEFAULT_USER: UserProfile = {
  name: '홍길동',
  email: 'user@example.com',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhBqXjP7Zs1r0DMoE9Cm6i7-FuUAIVl5Hb2LPZWG7DRxHn6Q-SS6t2hrAGr2nKi-NWsueGpr0o8A0lzHpmyTty4mPrx6Gq54KGN0EpUs1Z7GzFh9W2Nv7I4HVZB61cjIbXQ8_9KjueDFmiP-lE8CmZCm825uSXb-6fr-kytv2f3Ut4tJUU0m94pzV05A7ZYfjIhijJq3aA9Vo2x7o-hAX5vgOox5huJ1SFtZv4dTWHU-oKYE7X8JSGdfxDsZlcgNf03HqRtaWv18ys',
  customInstruction: '대표님이라고 불러주세요.',
  aiPersona: 'logical',
  aiExpertise: ['프로젝트 기획', '시간 관리'],
  aiFrequency: 'moderate',
  notifications: {
    email: true,
    push: true
  },
  theme: 'light'
};
