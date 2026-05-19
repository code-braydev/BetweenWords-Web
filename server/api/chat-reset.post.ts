import { defineEventHandler } from "h3";
import { getOrCreateStudentSession, updateStudentSession } from "../utils/session";

export default defineEventHandler(async (event) => {
  const { id: sessionId, session } = await getOrCreateStudentSession(event);

  // Clear chat history on the backend session, keeping the message count intact
  session.chatHistory = [];

  await updateStudentSession(sessionId, session);

  return {
    success: true,
    message: "Chat history cleared successfully on server.",
  };
});
