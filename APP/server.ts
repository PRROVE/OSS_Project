import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GenAI
const apiKey = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

function getAiClient() {
  if (!aiClient) {
    if (!apiKey) {
      console.warn("GEMINI_API_KEY environment variable is not defined. AI interactions will fall back to simulated responses.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// API routes FIRST
app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body;
  if (!message) {
    return res.status(400).json({ error: "Message is required." });
  }

  const ai = getAiClient();
  if (!ai) {
    // If no API key or client, return simulated helpful AI coach responses.
    const simulatedAnswers = [
      "반가워요, 윤관님! 🏃‍♂️ 목표를 세부적인 계획으로 쪼개는 것은 큰 꿈을 실현 가능하게 만드는 최고의 한 수입니다. 내년 마라톤 완주를 위해 가장 먼저 할 일은 무리한 달리기보다는, '주 3회 15분 걷고 달리기'로 시작해 발목과 무릎 주변 근력을 다지는 기초 단계입니다. 일일 루틴으로 마음에 드시나요? 🌱",
      "마라톤 준비에서 가장 중요한 건 심폐 에너지를 천천히 빌드업하는 것입니다. 🧭 일정을 15분 단위로 쪼개기 설정해 두셨으니, 당장 수요일 아침 7시에 원대한 목표 대신 '가볍게 스트레칭 5분, 동네 조깅 10분'을 배치할게요. 천천히 시작하면 뇌가 부담을 겪지 않습니다. 🎯",
      "맞습니다! 피로도가 높아지는 오후 3시~4시 마의 구간에는 러닝이나 핵심 학습보다는 수분을 보충하고 '오피스 10분 스트레칭'을 배치하여 에너지를 완만하게 회복하는 것을 추천해 드려요. 🧘‍♂️",
      "오늘 완료율이 벌써 60%를 넘어섰네요! 🎉 남은 2개의 미완수 일정('클라이언트 미팅 준비'와 같은 과업들)은 너무 긴장해 한 번에 끝내려 하기보다, 미팅 완료 리포트를 먼저 가볍게 읽고 15분 집중 타이머를 사용하는 것이 훨씬 집중이 원활합니다!"
    ];
    const randomIndex = Math.floor(Math.random() * simulatedAnswers.length);
    const text = simulatedAnswers[randomIndex];
    // delay a little to simulate network
    await new Promise(resolve => setTimeout(resolve, 800));
    return res.json({ text });
  }

  try {
    const formattedHistory = (history || []).map((msg: any) => {
      const speakerName = msg.role === 'user' ? '윤관' : 'AI 코치';
      return `${speakerName}: ${msg.content}`;
    }).join("\n");

    const systemInstruction = 
      "당신은 생산성 및 라이프 루틴을 컨설팅해 주는 '공감형 AI 코치'입니다. " +
      "사용자의 이름은 '윤관'님입니다. 따뜻하고 건설적이며 용기를 주는 어조로 조언해 주세요. " +
      "대화는 한국어를 사용하고 너무 딱딱하지 않게 이모지(예: 🏃‍♂️, 🎯, 📑, 🌱, 🎉, 🧘‍♂️)를 매우 활기차고 풍부하게 섞어서 답변해 주세요. " +
      "줄바꿈을 적절히 사용하여 모바일 가독성이 극대화되게 해주세요. 사용자의 일정 관리, 목표 쪼개기, 피로 관리 등에 탁월한 조언자입니다.";

    const prompt = `${formattedHistory}\n윤관: ${message}\nAI 코치:`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.8,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API error:", error);
    res.status(500).json({ error: error.message || "An error occurred with Gemini." });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
