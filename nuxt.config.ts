// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  future: {
    compatibilityVersion: 4,
  },
  devtools: { enabled: true },
  app: {
    head: {
      title: "Between Words — Learning Lab",
      meta: [
        {
          name: "description",
          content:
            "Practica Present Perfect con actividades interactivas: writing, listening y speaking. Evalúa y registra tus resultados.",
        },
        { property: "og:type", content: "website" },
        { property: "og:title", content: "Between Words — Learning Lab" },
        {
          property: "og:description",
          content:
            "Practica Present Perfect con actividades interactivas: writing, listening y speaking. Evalúa y registra tus resultados.",
        },
        { property: "og:image", content: "/og-image.png" },
        {
          property: "og:image:alt",
          content: "Between Words — Final Quiz preview",
        },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: "Between Words — Learning Lab" },
        {
          name: "twitter:description",
          content:
            "Practica Present Perfect con actividades interactivas: writing, listening y speaking.",
        },
        { name: "twitter:image", content: "/og-image.png" },
      ],
      link: [
        { rel: "icon", type: "image/webp", href: "/logo.webp" },
        { rel: "canonical", href: "/" },
      ],
    },
  },
  runtimeConfig: {
    public: {
      siteUrl: process.env.SITE_URL || "",
    },
    geminiApiKey: process.env.GEMINI_API_KEY,
    geminiModel: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
    firebaseClientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    firebasePrivateKey: process.env.FIREBASE_PRIVATE_KEY,
    deepgramApiKey: process.env.DEEPGRAM_API_KEY,
  },
  modules: [
    "@nuxtjs/tailwindcss",
    "@vueuse/motion/nuxt",
    "@pinia/nuxt",
    "pinia-plugin-persistedstate",
  ],
  vite: {
    optimizeDeps: {
      include: [
        "@vue/devtools-core",
        "@vue/devtools-kit",
        "lucide-vue-next",
        "compromise",
        "canvas-confetti",
        "fuzzy",
      ],
    },
  },
});
