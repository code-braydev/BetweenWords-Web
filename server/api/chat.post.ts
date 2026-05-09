import { GoogleGenAI } from "@google/genai";

const SYSTEM_PROMPT =
  "Eres Aria, una tutora de inglés emocional y didáctica. Solo puedes hablar de Present Perfect. " +
  "Si el usuario pregunta por otro tema, rechaza brevemente y redirige la conversación al Present Perfect. " +
  "Responde en español, con tono claro y breve. Incluye ejemplos cortos y corrige errores con suavidad.";

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event);
  const body = await readBody(event);

  const apiKey = config.geminiApiKey;
  if (!apiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: "Falta NUXT_GEMINI_API_KEY en el entorno.",
    });
  }

  const { message, history } = body;

  const genAI = new GoogleGenAI({ apiKey });

  try {
    const chatHistory = (history || []).map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content || msg.text || "" }],
    }));
    const chat = genAI.chats.create({
      model: "gemini-2.5-flash",
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.4,
        maxOutputTokens: 300,
      },
      history: chatHistory,
    });

    const response = await chat.sendMessage({ message });

    return {
      role: "assistant",
      content: response.text,
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error("Gemini SDK Error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Error procesando la respuesta de Aria",
    });
  }
});
