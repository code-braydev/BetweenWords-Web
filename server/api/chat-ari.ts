import { defineEventHandler, readBody, createError } from "h3";
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from "../constants/SYSTEM_PROMPT";
import {
  getOrCreateStudentSession,
  updateStudentSession,
} from "../utils/session";

export default defineEventHandler(async (event) => {
  // 1. Identificación y Control de Cuota (Máximo 20 mensajes)
  const { id: sessionId, session } = await getOrCreateStudentSession(event);

  if (session.chatMessagesCount >= 20) {
    throw createError({
      statusCode: 429,
      statusMessage: "Cuota de interacción agotada para esta sesión",
    });
  }

  const config = useRuntimeConfig(event);
  const body = await readBody(event);
  const { message } = body;

  if (!message) {
    throw createError({
      statusCode: 400,
      statusMessage: "Message is required",
    });
  }

  const apiKey = config.geminiApiKey || process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: "Falta la configuración de IA en el servidor",
    });
  }

  const genAI = new GoogleGenAI({ apiKey });

  try {
    // 2. Memoria Contextual: Reconstruir el historial desde la sesión del servidor
    const chatHistory = session.chatHistory.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const chat = genAI.chats.create({
      model: "gemini-2.5-flash", // Usando el modelo especificado o disponible
      config: {
        systemInstruction: SYSTEM_PROMPT,
        temperature: 0.4,
        maxOutputTokens: 1000,
      },
      history: chatHistory,
    });

    const response = await chat.sendMessage({ message });
    const assistantContent =
      response.text || "Lo siento, no pude procesar eso.";

    // 3. Actualizar Historial y Contador en Servidor
    session.chatHistory.push({ role: "user", content: message });
    session.chatHistory.push({ role: "model", content: assistantContent });
    session.chatMessagesCount++;

    await updateStudentSession(sessionId, session);

    return {
      role: "assistant",
      content: assistantContent,
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error("Gemini SDK Error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Error procesando la respuesta de Ari",
    });
  }
});
