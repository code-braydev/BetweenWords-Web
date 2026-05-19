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
        content:
          "¡Hola! Soy Aria, tu guía en esta aventura. 🌟 Cuéntame, para empezar nuestro camino con el Present Perfect: ¿hay un concepto que se te dificulta entender?",
        timestamp: new Date(),
      },
    ] as ChatMessage[],
    usageCount: 0,
    maxMessages: 20,
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
          `/api/chat-ari`,
          {
            method: "POST",
            body: {
              message: messageText,
            },
            credentials: "include",
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
        if (error.status === 429) {
          this.messages.push({
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content:
              "⚠️ Has alcanzado el límite de interacciones con Aria para esta sesión.",
            timestamp: new Date(),
          });
        } else {
          this.messages.push({
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: "SYSTEM_ERROR: Connection to Aria lost.",
            timestamp: new Date(),
          });
        }
      } finally {
        this.isTyping = false;
      }
    },

    async clearChat() {
      this.messages = [
        {
          id: "welcome",
          role: "assistant",
          content: "¡Hola! Soy Aria. Solo puedo ayudarte con Present Perfect.",
          timestamp: new Date(),
        },
      ];
      this.isTyping = false;

      try {
        await $fetch('/api/chat-reset', {
          method: 'POST',
          credentials: 'include'
        });
      } catch (error) {
        console.error('Failed to reset chat on server:', error);
      }
    },
  },
  persist: {
    key: "between-words-chat",
    storage: typeof window !== 'undefined' ? window.sessionStorage : undefined,
  },
});
