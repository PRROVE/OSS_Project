# To-Do IT — 당신의 실행을 책임지는 파트너 To-Do List

> "할 일을 적는 것"이 아니라, "할 일을 실제로 끝내게 만드는 것"을 목표로 하는 적응형(Adaptive) 작업 관리 인터페이스입니다.

---

## 프로젝트 개요

대부분의 To-Do List는 **수동적인 체크리스트**입니다.

사용자가 입력한 작업을 단순히 나열해 보여줄 뿐, 어떤 일이 더 급한지, 어떤 일을 계속 미루고 있는지, 오늘 무엇부터 시작해야 하는지는 알려주지 않습니다. 그래서 두 부류의 사용자가 늘 어려움을 겪습니다.

- **시작조차 못 하는 사람** — 할 일은 적어두지만, 일이 너무 크고 막막해서 첫 발을 떼지 못합니다.
- **일정 관리가 어려운 사람** — 무엇을 먼저 해야 할지 우선순위를 못 잡고, 쉬운 일만 먼저 처리하다 중요한 일을 놓칩니다.

또한 최근 등장한 AI 기반 To-Do List는 일정을 **대신 짜주는** 데 그칩니다. 정작 사용자가 그 일정을 실행하지 못하면 아무 의미가 없습니다.

**Adaptive To-Do는 다릅니다.** 우리의 To-Do List는 일정을 대신 짜주는 것을 넘어, **사용자의 행동 패턴을 분석해 "성공할 수 있는 방법"을 제시하는 동반 파트너**입니다. 마감일, 중요도, 미룬 횟수, 완료 패턴을 기반으로 작업 순서와 UI가 동적으로 변하며, 사용자가 실제로 일을 끝낼 수 있도록 곁에서 돕습니다.

---

## Adaptiveness — 우리 팀만의 적응형 컨셉

그냥 할 일을 나열만 하는 게 아니라, 작업 상태에 따라 **목록 순서, 화면 문구, 코치 말투**가 바뀝니다. 아래는 실제로 코드에 들어가 있는 기능입니다.

| 기능 | 무엇을 하나 | 위치 |
| --- | --- | --- |
| **마감 임박한 일 위로 올리기** | 마감이 지났거나 가까운 일을 목록 위쪽에 보여줌 (오늘 / 내일 / 이번 주 묶음별로) | `ScreenTasks.tsx` |
| **상황에 맞는 한마디** | 작업이 "시작 전 · 마감 임박 · 마감 지남 · 미룸 · 완료" 중 어떤 상태냐에 따라 다른 조언 문구를 보여줌 | `ScreenTasks.tsx` |
| **미룬 일 표시** | 사용자가 어떤 일을 "미룸"으로 누르면, 그 일에 따로 색과 표시를 달아 눈에 띄게 함 | `ScreenTasks.tsx`, `ScreenDashboard.tsx` |
| **먼저 할 일 추천** | 첫 화면에서 아직 안 끝낸 일들을 AI에게 보내, 지금 먼저 하면 좋은 일 하나를 한 줄로 추천 | `ScreenDashboard.tsx` · `/api/coach-suggestion` |
| **큰 목표 쪼개기** | "보고서 쓰기"처럼 막막한 큰 일을 AI가 15~30분이면 할 수 있는 작은 단계 2~4개로 나눠줌 | `ScreenTasks.tsx` · `/api/breakdown` |
| **약한 분야 짚어주기** | 카테고리별 완료율을 따져서, 완료율이 낮은(70% 미만) 분야를 "주의"로 알려줌 | `ScreenAnalytics.tsx` |
| **패턴 보여주기** | 시간대별 성공률, 어떤 분야를 많이 하는지, 어떤 일을 자주 못 끝내는지를 그래프로 정리 | `ScreenAnalytics.tsx` |
| **코치 말투 고르기** | 분석형 · 다정형 · 스파르타형 중 고르면 AI 코치의 말투가 그에 맞게 바뀜 | `ScreenAICoach.tsx` · `/api/chat` |

---

## 주요 기능

### 기본 To-Do 기능
- 할 일 추가 / 수정 / 삭제
- 완료 체크 및 작업 상태 관리 (진행 전 · 진행 중 · 완료)
- 전체 할 일 목록 표시
- 마감일(D-day) 및 시간 설정
- 중요도 설정
- 카테고리 분류 (WORK · STUDY · MEETING · HOBBY · HEALTH · PROJECT · ADMIN · RESEARCH)
- 데이터 저장 및 불러오기 (LocalStorage 영속화)

### 적응형 · AI 파트너 기능
- **AI 코치** — 분석형 · 다정형 · 스파르타형 중 말투를 골라 AI와 상담
- **큰 목표 쪼개기** — 막막한 큰 일을 15~30분짜리 작은 단계로 나눠줌
- **먼저 할 일 추천** — 첫 화면에서 지금 먼저 하면 좋은 일을 한 줄로 추천
- **분석 화면** — 주간 완료율, 시간대별 성공률, 분야별 분포, 자주 못 끝내는 패턴을 그래프로 정리
- **커뮤니티** — 할 일과 성과를 공유하며 서로 동기부여

---

## 프로젝트 구조

```
OSS_Project
├── APP
├── APP_Darkmode
├── TEST
│   └── APP
└── WEB
```

| 폴더 | 설명 |
| --- | --- |
| `APP` | 모바일 형태의 풀 버전 (Express 서버 + Gemini AI 연동) |
| `APP_Darkmode` | APP의 다크모드 버전 |
| `TEST/APP` | **최종 테스트를 완료한 완성본 앱** |
| `WEB` | 데스크톱 웹 형태의 프론트엔드 프로토타입 |

### 공통 스택
- **React 19** + **TypeScript**
- **Vite 6** (빌드/개발 서버)
- **Tailwind CSS 4**
- **Motion** (애니메이션) · **lucide-react** (아이콘)
- **Google GenAI SDK** (`@google/genai`) — APP 한정

### 화면 구성
`Login` → `Onboarding` → `Dashboard` · `Tasks` · `Analytics` · `AI Coach` · `Community` · `Settings`

---

## 실행 방법

**사전 준비:** Node.js

### APP (AI 풀 버전)

```bash
cd APP
npm install
npm run dev
```

`.env.local` 파일에 Gemini API 키를 설정해야 합니다.

```
GEMINI_API_KEY=your_api_key_here
```

→ http://localhost:3000

### WEB (프론트엔드 프로토타입)

```bash
cd WEB
npm install
npm run dev
```

→ http://localhost:3000

---

## API (APP)

`APP/server.ts`가 제공하는 엔드포인트입니다.

| Method | Endpoint | 설명 |
| --- | --- | --- |
| `GET` | `/api/health` | 서버 상태 확인 |
| `POST` | `/api/breakdown` | 큰 목표를 15~30분 단위 작은 작업으로 분해 |
| `POST` | `/api/chat` | AI 코치와의 대화 |
| `POST` | `/api/coach-suggestion` | 미완료 작업 중 최우선 "첫 도미노" 작업 추천 |

> API 키가 없거나 호출에 실패해도 정적 폴백(fallback) 데이터로 동작합니다.

---

## 일정

1. Team Building (~5/12)
2. Team Meeting
3. Concept and Features Decisions (~5/26)
4. **Final Presentation: 6/10**

---

## Team

- 배지환
- 백태훈
