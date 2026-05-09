// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  runtimeConfig: {
    geminiApiKey: "AIzaSyB2SAA_nMPFuZAbJiJseKlA2ebKkvJqF74",
    geminiModel: "gemini-2.5-flash",
  },
  modules: [
    "@nuxtjs/tailwindcss",
    "@vueuse/motion/nuxt",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate",
  ],
  vite: {
    optimizeDeps: {
      include: ["@vue/devtools-core", "@vue/devtools-kit", "lucide-vue-next"],
    },
  },
});
