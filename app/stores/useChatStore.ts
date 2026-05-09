import { defineStore } from "pinia";

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
        content: "¡Hola! Soy Aria. Que parte del tema necesitas ayuda?",
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
          "/api/chat",
          {
            method: "POST",
            body: { message: messageText, history: this.messages },
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
