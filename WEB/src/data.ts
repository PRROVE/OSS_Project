/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Task, UserProfile, CoachingInsight, CoachingHistoryItem } from './types';

export const INITIAL_PROFILE: UserProfile = {
  name: '윤관',
  email: 'rfyhy3@gmail.com',
  avatarUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCYdzSVSmYgpM3s4K96TigpLDHQ_ZWXH0Y8Sqbd9jVt6GtwFJR4esPez0b8NQwCxHmMeAKU5aYTWTZ-f_SWh59hseJxZGbIa5864w23eBK0NetoLy1gFj1Y6uEgbJxwC4Vt7e3uVnFbPPDC104As2aSs-3B201E84Xqn-BF8B5qVSa6lecMnTPgmY57bgzPITC-WC8GJkipshsY1sjn9eC-5kTvIXzA5DWZlIv4Ik58NAQLeL9u_UU2eKPCECQHuYEXzBVnSbuhuLA',
  streak: 3,
  completedCount: 15,
  totalCount: 25,
};

export const getRelativeDate = (offsetDays: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export const TODAY_STR = getRelativeDate(0);
export const TOMORROW_STR = getRelativeDate(1);
export const IN_TWO_DAYS_STR = getRelativeDate(2);

export const INITIAL_TASKS: Task[] = [
  {
    id: 'task-1',
    title: '주간 성과 보고서 작성 및 검토',
    priority: 'high',
    category: 'Work',
    completed: true,
    date: TODAY_STR,
    timeStart: '14:00',
    timeEnd: '16:30',
    description: '- 3분기 주요 KPI 달성률 정리\n- 마케팅 캠페인 A/B 테스트 결과 분석 포함\n- 다음 주 전략 회의 전까지 팀장님 사전 리뷰 필요',
    duration: '2시간 30분',
    assignee: '나 (소유자)'
  },
  {
    id: 'task-2',
    title: 'Q3 분기별 마케팅 리포트 초안 작성',
    priority: 'high',
    category: 'Work',
    completed: true,
    date: TODAY_STR,
    timeStart: '10:00',
    timeEnd: '12:00',
    description: 'Q3 성과 수치 취합 및 전반적인 마케팅 채널 기여도 분석 리포트 초안 가안 마련',
    duration: '2시간'
  },
  {
    id: 'task-3',
    title: '클라이언트 미팅 준비 (A사)',
    priority: 'high',
    category: 'Meeting',
    completed: false,
    date: TODAY_STR,
    timeStart: '16:30',
    timeEnd: '17:30',
    description: 'A사 비즈니스 담당자용 요구사항 대응 및 가격 포지셔닝 제안서 슬라이드 보강',
    aiRecommendation: 'AI: 이전 미팅 노트를 참조하세요.'
  },
  {
    id: 'task-4',
    title: '오전 데일리 스크럼 참석',
    priority: 'medium',
    category: 'Admin',
    completed: false,
    failed: true,
    date: TODAY_STR,
    timeStart: '10:00',
    timeEnd: '10:15',
    description: '사내 어질리티 스크럼 참석 (와이파이 및 줌 연동 끊김으로 실패로 마감)'
  },
  {
    id: 'task-5',
    title: '개발팀 주간 싱크업 미팅',
    priority: 'medium',
    category: 'Meeting',
    completed: true,
    date: TODAY_STR,
    timeStart: '14:00',
    timeEnd: '15:00',
    description: '화상 미팅 룸에서 파이프라인 개발 스케줄 싱크업'
  },
  {
    id: 'task-6',
    title: '경쟁사 A UI 업데이트 리뷰',
    priority: 'low',
    category: 'Research',
    completed: false,
    date: TODAY_STR,
    description: '라이벌 서비스의 신규 UI 리뉴얼 관련 햅틱 및 모션 리서치'
  },
  {
    id: 'task-7',
    title: '이메일 인박스 정리 (Zero Inbox)',
    priority: 'low',
    category: 'Admin',
    completed: true,
    date: TODAY_STR,
    description: '업무 관련 메일함 정렬 및 스팸/뉴스레터 구독 해제 정리'
  },
  
  // Tomorrow
  {
    id: 'task-8',
    title: '신규 프로젝트 킥오프',
    priority: 'medium',
    category: 'Project',
    completed: true,
    date: TOMORROW_STR,
    timeStart: '10:30',
    timeEnd: '11:30',
    description: '신규 전략과제 킥오프 화상 회의 지표 수립 준비'
  },
  {
    id: 'task-9',
    title: '사전 자료 조사 완료',
    priority: 'low',
    category: 'Research',
    completed: true,
    date: TOMORROW_STR,
    description: '해외 벤치마킹 사례 PDF 수집 및 노션 공유 문서 게시'
  },
  
  // This Week
  {
    id: 'task-10',
    title: '팀 빌딩 행사 장소 예약',
    priority: 'low',
    category: 'Other',
    completed: false,
    date: IN_TWO_DAYS_STR,
    description: '공동 친목 도모를 위한 공유 워크스페이스 세미나 및 식사 공간 컨택 예약'
  }
];

export const INITIAL_INSIGHTS: CoachingInsight[] = [
  {
    id: 'insight-1',
    title: '최적 성율 유지 (Ideal Target)',
    subTitleKOR: '성공률 완 밀도 관리',
    description: '오늘 완수율이 60.0%의 건강한 밸런스 지점에 도달했습니다! 과몰입으로 인한 번아웃을 막아 영동력 있는 실천을 유지하는 최상의 지속가능 구간입니다.',
    recommendationTitle: 'AI Recommendation',
    recommendationDesc: '내일도 일일 목표 개수를 5개 내외로 안착시키고, 15분 할 일 쪼개기로 60% 내외의 만족스러운 행동 리듬을 보장하십시오.',
    type: 'routine',
    applied: false
  },
  {
    id: 'insight-2',
    title: '인지 페이스 메이킹 (Pacing Rule)',
    subTitleKOR: '인지 가동 부하 조절',
    description: '아침 9시~11시 사이의 작업 흐름에 일정이 가장 집중되고 있습니다. 이 시간대 이후 60% 지점 안에서 충분한 환기 휴식을 큐레이션 하세요.',
    recommendationTitle: 'AI Recommendation',
    recommendationDesc: '무리한 할 일의 추가를 방지하고, 피로 지연이 예측되는 완충 슬롯에 3분의 인지 회복 호흡 루틴을 적용해보는 걸 권장합니다.',
    type: 'routine',
    applied: false
  }
];

export const INITIAL_HISTORY: CoachingHistoryItem[] = [
  {
    id: 'hist-1',
    time: 'Today',
    title: '루틴 재조정 제안',
    description: '오전 집중 시간 블록 생성 권장.',
    tag: 'Rebalance'
  },
  {
    id: 'hist-2',
    time: 'Yesterday',
    title: '태스크 난이도 분석',
    description: '\'개발\' 카테고리 예상 소요 시간 20% 초과 알림.',
    tag: 'Analysis'
  },
  {
    id: 'hist-3',
    time: 'Oct 12',
    title: '휴식 권장 달성',
    description: '주말 동안 완벽한 휴식 패턴 기록됨.',
    tag: 'Rest'
  },
  {
    id: 'hist-4',
    time: 'Oct 10',
    title: '번아웃 징후 감지',
    description: '심야 작업 연속 발생으로 경고 알림 전송.',
    tag: 'Warning'
  }
];

export const MOCK_HOURLY_HEAT_DATA = [
  { hour: '9AM', values: [20, 40, 60, 30, 80, 0, 0] },
  { hour: '12PM', values: [50, 100, 90, 70, 50, 0, 10] },
  { hour: '3PM', values: [0, 20, 0, 0, 10, 0, 0] }, // Energy dip at 3pm
  { hour: '6PM', values: [30, 40, 60, 80, 90, 20, 20] }
];
