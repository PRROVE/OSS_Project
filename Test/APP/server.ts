import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client lazily
let aiClient: GoogleGenAI | null = null;
function getAiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not defined in environment variables.");
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || "",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Global state / static mocks (fallback in case API fails)
const fallbackTasks = [
  { title: "목표 핵심 가치 정의하기", duration: "15분", category: "PROJECT" },
  { title: "필요 정보 및 레퍼런스 수집", duration: "15분", category: "RESEARCH" },
  { title: "첫 번째 실행 초안 작성", duration: "15분", category: "WORK" }
];

// 1. Health API
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// 2. Breakdown API: Breaking arbitrary goals into 15-minute intervals
app.post("/api/breakdown", async (req, res) => {
  const { goal, category } = req.body;
  if (!goal) {
    return res.status(400).json({ error: "Goal is required" });
  }

  try {
    const ai = getAiClient();
    const prompt = `사용자가 다음과 같은 거대한 목표 혹은 막막한 할 일을 달성하려고 합니다: "${goal}".\n` +
      `이 목표를 사용자가 지치지 않고 15~30분 단위로 세분화하여 쉽게 무찔러 나갈 수 있도록 2~4개의 작은 단계(할 일)로 쪼개주세요.\n` +
      `사용자가 설정한 주 카테고리: "${category || '기타'}".\n` +
      `쪼갠 할 일의 카테고리는 다음 단어 중 가장 적합한 것으로 지정하세요: [WORK, STUDY, MEETING, HOBBY, HEALTH, PROJECT, ADMIN, RESEARCH].`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "당신은 막막하고 과중한 할 일을 원자 단위(15분 내외)로 잘게 쪼개어 행동 장벽을 지능적으로 낮춰 주는 'Adaptive AI' 목표 설계 비서입니다. 친근하고 전문적인 한국어로 응답해야 하고, 반드시 요청된 스키마에 맞는 올바른 JSON 리스트 형태를 반환해야 합니다.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "15분 혹은 30분 단위로 쪼갠 완전 구체적인 조그만 실행 과제 제목" },
                  duration: { type: Type.STRING, description: "소요 예상 시간 (예: '15분', '30분')" },
                  category: { type: Type.STRING, description: "할 일 카테고리 (반드시 WORK, STUDY, MEETING, HOBBY, HEALTH, PROJECT, ADMIN, RESEARCH 중 하나여야 함)" }
                },
                required: ["title", "duration", "category"]
              }
            }
          },
          required: ["tasks"]
        }
      }
    });

    const text = response.text || "{}";
    const data = JSON.parse(text.trim());
    return res.json({ success: true, tasks: data.tasks || fallbackTasks });
  } catch (err: any) {
    console.error("Error in /api/breakdown:", err);
    // Return friendly fallbacks on error so the app doesn't break
    return res.json({
      success: false,
      error: err.message,
      tasks: [
        { title: `${goal} 뼈대 잡기`, duration: "15분", category: category || "WORK" },
        { title: `${goal} 구체화하기`, duration: "15분", category: category || "PROJECT" },
        { title: `${goal} 피드백 및 정비`, duration: "15분", category: category || "ADMIN" }
      ]
    });
  }
});

// 3. AI Coach Chat API
app.post("/api/chat", async (req, res) => {
  const { messages, coachStyle } = req.body; // Array of { role: 'user' | 'model', content: string }
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "messages array is required" });
  }

  // Map coachStyle (분석형, 다정형, 스파르타형) to custom prompt extensions
  let styleInstruction = "가장 합리적이고 구조화된 로드맵을 알려주는 차분하고 이성적인 '분석형 코치' 모드입니다.";
  if (coachStyle === "다정형") {
    styleInstruction = "과제에 치인 유저의 마음을 한결 부드럽게 감싸안고, 공감과 따뜻한 정서적 지지를 먼저 제공하는 따사로운 '다정형 코치' 모드입니다. 과도하게 격려하고 이모티콘을 활용해도 좋습니다.";
  } else if (coachStyle === "스파르타형") {
    styleInstruction = "변명을 늘어놓는 것을 방지하고, 질러버리고 나아가도록 지혜롭게 채찍질하며 강력한 에너지를 불어넣는 불꽃 같은 '스파르타형 코치' 모드입니다. 말투가 강하지만 애정이 담겨 있어야 합니다.";
  }

  try {
    const ai = getAiClient();
    
    // Prepare conversation payload
    // Gemini SDK expects { role: 'user' | 'model', parts: [{ text: string }] } or string
    const geminiContents = messages.map(msg => ({
      role: msg.role === "assistant" ? "model" as const : "user" as const,
      parts: [{ text: msg.content }]
    }));

    const systemPrompt = `당신은 사용자의 실행 불능 상태, 미루기 습관, 완벽주의를 치료하는 AI 멘토 및 실천 동반자 'Adaptive AI 코치'입니다.\n` +
      `현재 활성화된 코칭 성향: ${styleInstruction}\n` +
      `사용자가 거대한 도전에 압도당하거나, 해야 할 일을 미루며 스트레스 받을 때, 뇌가 거부감을 느끼지 않는 초소형 실천 단위(15분)로 의욕을 쪼개어 즉시 시작하도록 유도해야 합니다.\n` +
      `대답은 가급적 세련되고 신뢰감 있으며 친근한 한국어(Markdown 포맷)로 작성하고, 너무 길지 않게 3~4문장으로 명쾌한 답글을 주세요.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: geminiContents,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.8
      }
    });

    const reply = response.text || "죄송해요, 대화를 분석하는 도중 일시적인 네트워크 흐름이 중단되었어요. 하지만 윤관님은 할 수 있어요! 어떤 작은 일부터 시작해볼까요?";
    return res.json({ success: true, content: reply });
  } catch (err: any) {
    console.error("Error in /api/chat:", err);
    return res.json({
      success: false,
      error: err.message,
      content: "죄송해요! 지금 Gemini API 연결이 원활하지 않습니다. 하지만 '시작하기가 가장 어렵다'는 룰은 변하지 않아요! 오늘 하려고 하셨던 일의 딱 1%만 먼저 시작해 보시는 건 어떨까요? 제가 곁에서 늘 응원할게요!"
    });
  }
});

// 4. AI Coach Task Suggestion API based on active tasks
app.post("/api/coach-suggestion", async (req, res) => {
  const { currentTasks } = req.body; // Array of { title: string, completed: boolean, category: string }
  if (!currentTasks || !Array.isArray(currentTasks)) {
    return res.status(400).json({ error: "currentTasks is required" });
  }

  const incomplete = currentTasks.filter(t => !t.completed);
  if (incomplete.length === 0) {
    return res.json({
      suggestion: "우와! 오늘 할 일을 완벽히 정복하셨거나, 아직 등록된 일이 없네요! 가슴이 웅장해지는 새로운 가벼운 도전을 하나 추가해보는 건 어떨까요?",
      targetTaskTitle: null
    });
  }

  try {
    const ai = getAiClient();
    const taskListStr = incomplete.map((t, i) => `${i+1}. [${t.category}] ${t.title}`).join("\n");
    const prompt = `사용자의 오늘 남은 미완료 할 일 목록입니다:\n${taskListStr}\n\n` +
      `이 중에서 사용자가 '가장 첫 걸음으로 해치우기 좋고 시작하기 부담 없는' 최우선 순위 과업을 딱 1개 선정하고, 왜 그것부터 시작해야 하는지 뇌 과학이나 인지 심리학 관점에서 엄청 가볍게 1줄로 이유를 들어 조언해 주세요.\n` +
      `결과는 한국어로 짧고 선명하게 추천 문장 1개로 마무리해야 합니다.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction: "당신은 심리학적 관점에서 유저에게 가장 장벽이 낮은 '첫 도미노' 역할을 할 매력적인 1순위 할 일을 정해주는 Adaptive AI 코치입니다. 글자수 공백 포함 100자 이하로 초핵심 조언만 한 줄로 전달해주세요.",
        temperature: 0.7
      }
    });

    const reply = response.text || `가장 급해 보이는 '${incomplete[0].title}'부터 시작하면 오늘 흐름을 잡기 좋아요.`;
    return res.json({ success: true, suggestion: reply, targetTaskTitle: incomplete[0].title });
  } catch (err: any) {
    console.error("Error in /api/coach-suggestion:", err);
    return res.json({
      success: false,
      suggestion: incomplete.length > 0
        ? `가장 먼저 적어두신 '${incomplete[0].title}' 과제부터 기계적으로 5분만 눈 딱 감고 시작해보는 걸 강력 추천합니다!`
        : "오늘의 도미노 칩을 가볍게 쓰다듬어 보세요!"
    });
  }
});

// Vite server integrations
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Adaptive AI] Server is running on http://localhost:${PORT}`);
  });
}

startServer();
