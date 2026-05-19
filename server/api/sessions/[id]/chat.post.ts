import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "../../../constants/SYSTEM_PROMPT";

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
        maxOutputTokens: 1000,
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
