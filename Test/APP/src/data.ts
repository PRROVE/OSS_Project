import { Task, CommunityFeed, DiagnosisRecord, UserProfile, NotificationSettings } from "./types.ts";

export const DEFAULT_TASKS: Task[] = [
  {
    id: "task-1",
    title: "주간 성과 보고서 작성 및 검토",
    duration: "30분",
    category: "WORK",
    completed: true,
    timeStr: "11:00",
    createdAt: new Date().toISOString()
  },
  {
    id: "task-2",
    title: "클라이언트 미팅 준비 (A사)",
    duration: "60분",
    category: "MEETING",
    completed: false,
    dueDateStr: "D-1",
    timeStr: "16:30-17:30",
    aiTip: "AI: 이전 미팅 노트를 참조하세요.",
    createdAt: new Date().toISOString()
  },
  {
    id: "task-3",
    title: "오전 데일리 스크럼 참석",
    duration: "15분",
    category: "ADMIN",
    completed: false,
    failed: true,
    createdAt: new Date().toISOString()
  },
  {
    id: "task-4",
    title: "경쟁사 A UI 업데이트 리뷰",
    duration: "15분",
    category: "RESEARCH",
    completed: false,
    dueDateStr: "D-2",
    timeStr: "12:00",
    createdAt: new Date().toISOString()
  },
  {
    id: "task-5",
    title: "Q3 분기별 마케팅 리포트 초안 작성",
    duration: "45분",
    category: "WORK",
    completed: true,
    timeStr: "10:00",
    createdAt: new Date().toISOString()
  },
  {
    id: "task-6",
    title: "신규 프로젝트 킥오프",
    duration: "30분",
    category: "PROJECT",
    completed: false,
    timeStr: "10:30",
    createdAt: new Date(Date.now() + 86400000).toISOString() // Tomorrow
  }
];

export const DEFAULT_FEEDS: CommunityFeed[] = [
  {
    id: "feed-1",
    authorName: "이혜린",
    authorEmail: "hyerin.lee@partner.design",
    authorRole: "Google UX Design Lead",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDdDs9Mseq2PqoCdJw8DvZZ0M686v-30TW-cg8c1qXnhFD-EA3ZVKFtBzA9Br2R8ZGPrOrHSXnmxOXmjSDnmyFmtZzm_Adyz3Rlc2MRQO-G1sKFTW1tFfWr2lH6xY4iWgYdhNQhjUFLiRL3QtjOsB3I0rTUColF_uTJe1TpaoVD2OZMMn3b0Myx6T8d1B0OVDHh791oXzUGrA5CnWRPXUQyOQTiy4Ir6ChkT74GrI2sEpsVrh2ZVLwGV8unUIVf1x-vvzZ5xorGfr-R",
    timeAgo: "2시간 전",
    content: "어제 완료한 To-Do 목록 스크린샷과 함께 성공률 60% 정비 기록 인증하고 갑니다! 15분 단위로 쪼개도 집중력을 끝까지 유지하기란 쉽지 않네요. 그래도 큰 덩어리를 작게 만드니 한결 가볍습니다.",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAiAcHWEiqilykmHz6XTvSZYJSR3jCmEe65ejFT6OFtist6W-SbIDBS1lDNSUOUI7vjF9UdcVV3_SI8RpLmUvV3DRE5BbBM7nl1bFel-T7e1vEK588ZB4c7qO0xqeHJipBAAYBz0pGpl4ZHhkMFNR3IX3Atgxd-Z07LfuYmsu52aj_QkHDxtKA3z_NuP_b8-546SYkAgyWRZQMVZxlHgcg1WyDR1fnUEqjdnUhH3tSmzAoE8OU76cm6LLJXPyRI3YIWjG5xkZDHB00x",
    likes: 18,
    likedByMe: false,
    comments: [
      {
        id: "c-1",
        author: "김완수",
        avatarInitials: "김",
        content: "To-Do 성공률 60%라니 저보다 높으시네요! 꼼꼼한 관리 자극 받고 갑니다",
        timeAgo: "1시간 전"
      },
      {
        id: "c-2",
        author: "윤관 (나)",
        avatarInitials: "윤",
        content: "체계적인 지표 관리 부럽습니다! 저도 내 할 일 탭으로 참고할게요!",
        timeAgo: "30분 전"
      }
    ],
    sharedTasks: [
      { title: "피그마 컴포넌트 라이브러리 정렬 & 싱크", duration: "15분", category: "RESEARCH", completed: true },
      { title: "프론트엔드 개발팀 전달용 디자인 명세서 작성", duration: "30분", category: "WORK", completed: true },
      { title: "UX 테스트 세션 최종 피드백 분류 & 요약", duration: "15분", category: "RESEARCH", completed: false }
    ]
  },
  {
    id: "feed-2",
    authorName: "김완수",
    authorEmail: "wansu.kim@partner.com",
    authorRole: "마케팅 매니저",
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCLhfHOkZKC8aBREKs3Wrvr-9Jp6-0NYj1bnRhLL0tg8_1VZfDSN38UdDhh-s3r430asgq7HGneIFr-cYww223VsD5q1wUuseT3Bk5Musv35KjNUmrIkmSCxKjbgCASEgV1QNsGwfn4eiqx2Yy2SXAjk00V-X1TpVKeSUsO2xt3f9u4vEOzNvdojW7Vtn1uNNgMn3GarHCBc-gmumavz_jz5ZmH6mj38ENW8pevuFICS_qx88k0MbKgjInXAmeNqjOGM4-fVFx0fNwW",
    timeAgo: "4시간 전",
    content: "큰 일을 작게 쪼개서 하나씩 끝내니까 지난주보다 완료율이 확 올랐어요. 미루던 보고서도 30분 단위로 나누니 의외로 금방 끝나더라고요!",
    likes: 12,
    likedByMe: true,
    comments: []
  }
];

export const DEFAULT_DIAGNOSIS: DiagnosisRecord[] = [
  {
    id: "diag-1",
    day: "10",
    dateStr: "October 24, 2023",
    rate: 88,
    status: "최상"
  },
  {
    id: "diag-2",
    day: "09",
    dateStr: "October 23, 2023",
    rate: 42,
    status: "주의"
  }
];

export const DEFAULT_PROFILE: UserProfile = {
  name: "윤관",
  role: "Professional Designer",
  gender: "남성",
  phone: "010-1234-5678",
  email: "yoon.kwan@example.com"
};

export const DEFAULT_NOTIFICATIONS: NotificationSettings = {
  onDeadline: true,
  onDailyReview: false,
  onWeeklySummary: true
};
