import { defineStore } from "pinia";
import { useGameStore } from "~/stores/useGameStore";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

export const useChatStore = defineStore("chat", {
  state: () => ({
    messages: [
      {
        id: "welcome",
        role: "assistant",
        content:
          "¡Hola! Soy Aria, tu guía en esta aventura. 🌟 Cuéntame, para empezar nuestro camino con el Present Perfect: ¿hay un concepto que se te dificulta entender?",
        timestamp: new Date(),
      },
    ] as ChatMessage[],
    usageCount: 0,
    maxMessages: 10,
    isTyping: false,
  }),
  actions: {
    async sendMessage(text: string) {
      if (this.usageCount >= this.maxMessages) return "LIMIT_REACHED";

      const messageText = text.trim();
      if (!messageText) return;

      const gameStore = useGameStore();
      const sessionId = gameStore.session.id;
      const topic = gameStore.session.topic;

      if (!sessionId) {
        throw createError({
          statusCode: 400,
          statusMessage: "No hay una sesión válida para el chat.",
        });
      }

      this.messages.push({
        id: Date.now().toString(),
        role: "user",
        content: messageText,
        timestamp: new Date(),
      });
      this.usageCount++;
      this.isTyping = true;

      try {
        const response = await $fetch<{ content: string; answer: string }>(
          `/api/sessions/${sessionId}/chat`,
          {
            method: "POST",
            body: {
              message: messageText,
              history: this.messages,
              topic,
              sessionId,
            },
          },
        );

        this.messages.push({
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            response.content || response.answer || "Error: No content received",
          timestamp: new Date(),
        });
      } catch (error: any) {
        if (error.status === 503) {
          throw createError({
            statusCode: 503,
            statusMessage:
              "Aria está descansando un poco (demasiada demanda). Reintenta en un segundo.",
          });
        }
        this.messages.push({
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: "SYSTEM_ERROR: Connection to Aria lost.",
          timestamp: new Date(),
        });
      } finally {
        this.isTyping = false;
      }
    },

    clearChat() {
      this.messages = [
        {
          id: "welcome",
          role: "assistant",
          content: "¡Hola! Soy Aria. Solo puedo ayudarte con Present Perfect.",
          timestamp: new Date(),
        },
      ];
      this.usageCount = 0;
      this.isTyping = false;
    },
  },
  persist: true, // Para que no se borre al recargar
});
