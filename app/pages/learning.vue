<template>
    <main
        class="min-h-screen bg-transparent text-slate-900 dark:text-nebula-text flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 transition-colors duration-300">
        <header v-motion :initial="{ opacity: 0, y: -20 }"
            :enter="{ opacity: 1, y: 0, transition: { duration: 500, ease: 'easeOut' } }"
            class="mb-8 sm:mb-10 lg:mb-12">
            <div class="flex flex-col gap-4 mb-4">
                <div class="flex items-center gap-2 sm:gap-3 flex-wrap">
                    <UiBadge variant="primary" class="text-xs sm:text-sm">LECCIÓN</UiBadge>
                    <h1
                        class="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-mono font-bold text-slate-900 dark:text-white uppercase tracking-tight transition-colors">
                        Present Perfect
                    </h1>
                </div>
            </div>
            <p
                class="text-slate-600 dark:text-white/70 font-mono text-xs sm:text-sm pl-3 sm:pl-4 border-l-2 border-nebula-cyan italic max-w-2xl leading-relaxed transition-colors">
                Objetivo: Aprende a conectar acciones del pasado con el presente y domina este tiempo verbal
                fundamental.
            </p>
        </header>
        <div class="flex flex-col lg:flex-row gap-8 lg:gap-12">
            <!-- Main Content: The Learning Journey -->
            <div class="flex-1 space-y-12 sm:space-y-16">
                <!-- 01. Introduction -->
                <section id="intro" class="scroll-mt-24">
                    <LearnIntro />
                </section>

                <!-- 02. Integrated Theory -->
                <section id="theory" class="scroll-mt-24">
                    <LearnGrammarTheory />
                </section>
            </div>

            <!-- Sidebar: Supporting Tools (Desktop: Sticky, Mobile: Flow) -->
            <aside class="w-full lg:w-80 space-y-8 h-fit lg:sticky lg:top-8">
                <!-- Video Section -->
                <UiCard class="border-nebula-cyan/30 p-4 bg-white/5 backdrop-blur-xl">
                    <div class="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
                        <Video class="w-4 h-4 text-nebula-cyan" />
                        <h3 class="text-[10px] font-black text-nebula-cyan uppercase tracking-widest">Video Tutorial
                        </h3>
                    </div>
                    <div class="aspect-video bg-black/40 rounded-xl overflow-hidden border border-white/5 relative">
                        <iframe v-if="isOnline" class="w-full h-full"
                            src="https://www.youtube-nocookie.com/embed/7aw7bQtPYCE?si=zauMx_S2872Qhu8&start=11"
                            title="YouTube" frameborder="0" allowfullscreen>
                        </iframe>
                        <div v-else class="absolute inset-0 flex flex-col items-center justify-center bg-black/60">
                            <WifiOff class="w-6 h-6 text-nebula-primary/40 mb-2" />
                            <p class="text-[9px] uppercase font-bold text-white/20 tracking-widest">Offline Mode</p>
                        </div>
                    </div>
                </UiCard>

                <!-- Progress Guide (Quick Nav) -->
                <div class="hidden lg:block p-6 bg-white/5 border border-white/10 rounded-3xl mb-8">
                    <h4 class="text-[10px] font-black text-white/40 uppercase tracking-[0.3em] mb-6">Contenido</h4>
                    <nav class="space-y-4">
                        <a v-for="(link, i) in navLinks" :key="i" :href="link.href"
                            class="flex items-center gap-3 text-xs font-bold text-white/60 hover:text-nebula-cyan transition-colors group">
                            <span
                                class="w-1.5 h-1.5 rounded-full bg-white/10 group-hover:bg-nebula-cyan transition-colors"></span>
                            {{ link.name }}
                        </a>
                    </nav>
                </div>

                <!-- AI Help Card -->
                <div v-if="showAri"
                    class="p-6 bg-gradient-to-br from-nebula-primary/20 via-nebula-primary/5 to-transparent border border-nebula-primary/30 rounded-3xl relative overflow-hidden group">
                    <div class="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Cpu class="w-24 h-24 text-nebula-primary" />
                    </div>
                    <div class="relative z-10">
                        <div class="flex items-center gap-2 mb-4">
                            <Sparkles class="w-4 h-4 text-nebula-primary" />
                            <span class="text-[10px] font-black text-nebula-primary uppercase tracking-widest">Aria AI
                                Assistant</span>
                        </div>
                        <p class="text-xs text-white/60 mb-6 leading-relaxed">
                            ¿Tienes dudas sobre los verbos irregulares o la estructura? Aria puede ayudarte en tiempo
                            real.
                        </p>
                        <UiButton label="CHAT CON ARIA" variant="primary" size="sm"
                            class="w-full text-[10px] font-black tracking-widest" @click="navigateTo('/message')" />
                    </div>
                </div>
            </aside>
        </div>
    </main>
    <Footer />
</template>

<script setup>
import { WifiOff, Video, Sparkles, Cpu } from 'lucide-vue-next'
import { ref, onMounted, onUnmounted } from 'vue'
const route = useRoute()
const store = useGameStore()
const isOnline = ref(true)

// Ari (AI assistant) is only available when there is an active session
// i.e. there is a session parameter in the URL, that session is valid/active,
// and they've gone past the start screen and are in the game environment
const showAri = computed(() => {
    const isSessionValid = store.session.valid && store.status.hasStarted
    return isSessionValid
})

const navLinks = [
    { name: 'Introducción', href: '#intro' },
    { name: 'Fórmula', href: '#formula' },
    { name: 'Uso', href: '#usage' },
    { name: 'Palabras clave', href: '#keywords' },
    { name: 'Verbos', href: '#verbs' }
]

const checkOnline = () => {
    isOnline.value = navigator.onLine
}

onMounted(() => {
    checkOnline()
    window.addEventListener('online', checkOnline)
    window.addEventListener('offline', checkOnline)
})

onUnmounted(() => {
    window.removeEventListener('online', checkOnline)
    window.removeEventListener('offline', checkOnline)
})
</script>