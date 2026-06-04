/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded Gemini API Client
let aiClient: GoogleGenAI | null = null;
const api_key = process.env.GEMINI_API_KEY;

function getAiClient(): GoogleGenAI | null {
  if (!aiClient) {
    if (!api_key || api_key === "MY_GEMINI_API_KEY") {
      console.warn("GEMINI_API_KEY is not set or placeholder. Fallback to smart simulated mock responses.");
      return null;
    }
    aiClient = new GoogleGenAI({
      apiKey: api_key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// 1. HEALTH CHECK ENDPOINT
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// 2. DYNAMIC WORKSPACE/PLAN GENERATOR
app.post("/api/generate-plan", async (req, res) => {
  const { prompt, profileName, onboardedCategories } = req.body;
  const ai = getAiClient();

  if (!prompt || typeof prompt !== "string") {
    res.status(400).json({ error: "Focus prompt description is required." });
    return;
  }

  const defaultMock = {
    tasks: [
      {
        title: prompt.length > 20 ? prompt.substring(0, 20) + "..." : prompt,
        description: `진행 과정 세부 수립: ${prompt}`,
        durationMinutes: 45,
        priority: "high"
      },
      {
        title: "중간 세부 사양 설계",
        description: "Aura 기반 마일스톤에 따라 UI 설계 및 기술 사양 검토",
        durationMinutes: 60,
        priority: "medium"
      },
      {
        title: "인지 결과 피드백 정리",
        description: "집중 마친 후 회고 보고서 및 데이터 소스 동기화",
        durationMinutes: 30,
        priority: "low"
      }
    ],
    insight: `“${profileName || "Jordan"}님, 수면 주기와 선호도를 감안할 때 지금이 목표 실현을 위한 가장 맑은 시간대입니다.”`
  };

  if (!ai) {
    res.json(defaultMock);
    return;
  }

  try {
    const categoriesText = onboardedCategories && Array.isArray(onboardedCategories) 
      ? onboardedCategories.join(", ") 
      : "기본 자기관리";

    const systemInstruction = 
      "You are Aura Intelligence personal companion. Generate a tailored set of exactly 2-4 tasks to help the user complete their focus goal. " +
      "The language must be clear, standard Korean. Align task priorities with actual logic. " +
      "Return the JSON structure formatted exactly as the specified schema.";

    const contents = `User Name: ${profileName || "Alex/Jordan"}. 
Onboarding Self-care Interests: ${categoriesText}.
User Focus Prompt Goal: "${prompt}".
Analyze this and generate a 3-step actionable task layout and a highly personalized, empathetic 1-sentence motivation insight.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tasks: {
              type: Type.ARRAY,
              description: "Actionable milestones/tasks to complete the goal.",
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "Short title in Korean (e.g. 'UI 모션 시제품 검토')" },
                  description: { type: Type.STRING, description: "Detailed 1-sentence description in Korean." },
                  durationMinutes: { type: Type.INTEGER, description: "Estimated completion time in minutes." },
                  priority: { type: Type.STRING, description: "Priority level: either 'high', 'medium', or 'low'" }
                },
                required: ["title", "description", "durationMinutes", "priority"]
              }
            },
            insight: { type: Type.STRING, description: "A very clear, motivating Korean sentence summarizing why this fits their profile." }
          },
          required: ["tasks", "insight"]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({
      tasks: parsed.tasks || defaultMock.tasks,
      insight: parsed.insight || defaultMock.insight
    });
  } catch (error: any) {
    console.error("Gemini Generate Plan Error:", error);
    res.json(defaultMock);
  }
});

// 3. AI PARTNER PERSONAL COACH CHAT
app.post("/api/coach-chat", async (req, res) => {
  const { message, history, aiConfig, profileName } = req.body;
  const ai = getAiClient();

  if (!message) {
    res.status(400).json({ error: "Message input is required." });
    return;
  }

  const pName = profileName || "Jordan";
  const persona = aiConfig?.persona || "logical";
  const instructions = aiConfig?.customInstructions || "대표님이라고 불러주세요. 모든 제안은 3단계 분석 결과를 포함해서 보고해주세요.";
  const expertise = aiConfig?.expertiseAreas && aiConfig.expertiseAreas.length > 0
    ? aiConfig.expertiseAreas.join(", ")
    : "종합 몰입 관리";

  // Mock answers if Gemini is not available
  const generateMockReply = (input: string) => {
    let mockPrefix = "";
    if (persona === "friendly") {
      mockPrefix = `우와, ${pName}님! 정말 흥미로운 생각이에요. 😊 제 생각에는: \n\n`;
    } else if (persona === "assertive") {
      mockPrefix = `${pName}님, 바로 행동해야 할 때입니다. 변명은 멈추고 집중 프로토콜을 수행합시다. \n\n`;
    } else {
      mockPrefix = `분석 결과, ${pName} 대표님께서 제안하신 의제(${input.substring(0, 15)})에 대해 3단계 솔루션을 정리해 드립니다:\n\n`;
    }

    return mockPrefix + 
      "1. **현상 분석**: 현재 몰입 에너지가 78% 상태로 회복 단계에 도달했습니다.\n" +
      "2. **차단 대책**: 방해 요인을 30분간 완전히 격리하는 딥워크를 설계하세요.\n" +
      "3. **예측 효율**: 해당 흐름 완료 후 주간 보고서 정합성이 18% 추가 상승합니다. 어떻게 할까요?";
  };

  if (!ai) {
    setTimeout(() => {
      res.json({ reply: generateMockReply(message) });
    }, 700);
    return;
  }

  try {
    const systemPrompt = 
      `You are "Aura", the empathetic, calming, and highly intellectual AI companion and cognitive coach. ` +
      `Your current active configured state is:\n` +
      `- User Name: ${pName}\n` +
      `- Persona Type: ${persona} (Adopt this tone: friendly=warm/gentle/encouraging, logical=precise/analytical/3-step structure, assertive=direct/highly focused/action-prompting)\n` +
      `- Expertise Fields: ${expertise}\n` +
      `- Custom Specific Instructions: ${instructions}\n\n` +
      `Generate a reply strictly adhering to the configured tone and specific custom instructions. Respond in professional Korean (한국어). Do not use extra code snippets unless necessary. Keep it under 4 paragraphs.`;

    // Package chat history
    const formattedHistory = (history || [])
      .slice(-10) // Send last 10 messages for context
      .map((msg: any) => {
        return {
          role: msg.sender === "user" ? "user" : "model",
          parts: [{ text: msg.text }]
        };
      });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        ...formattedHistory,
        { role: "user", parts: [{ text: message }] }
      ],
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.8,
      }
    });

    res.json({ reply: response.text || generateMockReply(message) });
  } catch (error: any) {
    console.error("Gemini Coach Chat Error:", error);
    res.json({ reply: generateMockReply(message) });
  }
});

// 4. EMBEDDED INTEL INSIGHT GENERATING
app.post("/api/generate-insights", async (req, res) => {
  const { tasks, config, profileName } = req.body;
  const ai = getAiClient();

  const pName = profileName || "Jordan";
  const defaultMock = {
    weeklySummary: "이번 주 인지 성과가 12% 향상되었습니다.",
    primaryInsightTitle: "신경 에너지 최고 수준",
    primaryInsightDesc: "정신적 명료함이 최고조에 달하고 있습니다. 딥 워크 세션을 시작하기에 완벽한 시점입니다.",
    efficiency: 88,
    efficiencyPeak: "오전 10:00"
  };

  if (!ai) {
    res.json(defaultMock);
    return;
  }

  try {
    const tasksSummary = (tasks || []).map((t: any) => `- [${t.status}] ${t.title}`).join("\n");
    const systemInstruction = 
      "You are Aura Intelligence insights generator. Based on the user's focus configuration and tasks, write a brief, elegant summary " +
      "of cognitive energy and recommendation in Korean. " +
      "Return the JSON schema structured exactly as defined.";

    const contents = `User Name: ${pName}. Active Persona: ${config?.persona || "logical"}. Tasks list:\n${tasksSummary}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            weeklySummary: { type: Type.STRING, description: "Concise headline (e.g. '이번 주 인지 성과가 12% 향상되었습니다')" },
            primaryInsightTitle: { type: Type.STRING, description: "Short title (e.g. '신경 에너지 분석')" },
            primaryInsightDesc: { type: Type.STRING, description: "Detailed 1-2 sentence insights in Korean." },
            efficiency: { type: Type.INTEGER, description: "Estimated productivity efficiency percentage (0 to 100)." },
            efficiencyPeak: { type: Type.STRING, description: "Peak time of the day (e.g. '오전 10:00')" }
          },
          required: ["weeklySummary", "primaryInsightTitle", "primaryInsightDesc", "efficiency", "efficiencyPeak"]
        }
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json({
      weeklySummary: parsed.weeklySummary || defaultMock.weeklySummary,
      primaryInsightTitle: parsed.primaryInsightTitle || defaultMock.primaryInsightTitle,
      primaryInsightDesc: parsed.primaryInsightDesc || defaultMock.primaryInsightDesc,
      efficiency: parsed.efficiency || defaultMock.efficiency,
      efficiencyPeak: parsed.efficiencyPeak || defaultMock.efficiencyPeak
    });
  } catch (error: any) {
    console.error("Gemini Insights Generator Error:", error);
    res.json(defaultMock);
  }
});

// START PRODUCTION SERVING FLOW
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
    console.log(`[Aura Server] running on http://localhost:${PORT} in env: ${process.env.NODE_ENV || "development"}`);
  });
}

startServer();
