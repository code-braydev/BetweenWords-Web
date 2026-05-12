<template>
    <main class="min-h-screen bg-transparent text-slate-900 dark:text-nebula-text flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 transition-colors duration-300">
        <header v-motion :initial="{ opacity: 0, y: -20 }" :enter="{ opacity: 1, y: 0, transition: { duration: 500, ease: 'easeOut' } }" class="mb-8 sm:mb-10 lg:mb-12">
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
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div class="lg:col-span-2 space-y-6 sm:space-y-8">
                <LearnIntro />
                <LearnStructure />
                <LearnUsageCases />
            </div>
            <div v-motion :initial="{ opacity: 0, x: 30 }" :enter="{ opacity: 1, x: 0, transition: { duration: 600, delay: 400, ease: 'easeOut' } }" class="lg:col-span-1 space-y-6 sm:space-y-8 h-fit sticky top-6">
                <UiCard class="border-nebula-cyan/30 p-4">
                    <div class="flex items-center gap-2 mb-3 pb-2 border-b border-slate-200 dark:border-nebula-cyan/10 transition-colors">
                        <div class="w-1.5 h-1.5 rounded-full bg-nebula-cyan animate-pulse"></div>
                        <h3 class="text-[10px] font-black text-nebula-cyan uppercase tracking-[0.2em]">Recurso en
                            Vídeo</h3>
                    </div>
                    <div
                        class="aspect-video bg-slate-100 dark:bg-nebula-dark/60 rounded-lg border border-slate-200 dark:border-white/5 overflow-hidden relative transition-colors">
                        <iframe v-if="isOnline" class="w-full h-full"
                            src="https://www.youtube-nocookie.com/embed/7aw7bQtPYCE?si=zauMx_S2872Qhu8&start=11"
                            title="YouTube video player" frameborder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen>
                        </iframe>
                        <div v-else
                            class="absolute inset-0 flex flex-col items-center justify-center bg-slate-200/50 dark:bg-black/40 backdrop-blur-sm transition-colors">
                            <WifiOff class="w-6 h-6 text-nebula-primary/60 mb-2" />
                            <p class="text-[10px] text-slate-500 dark:text-white/40 font-bold uppercase tracking-widest transition-colors">Sin conexión
                            </p>
                        </div>
                    </div>
                </UiCard>

                <div
                    class="p-4 bg-gradient-to-br from-nebula-primary/10 to-nebula-secondary/10 border border-slate-200 dark:border-white/10 rounded-2xl hover:border-nebula-primary/30 transition-all duration-300 shadow-lg">
                    <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center gap-2">
                            <div class="w-1.5 h-1.5 rounded-full bg-nebula-primary shadow-[0_0_8px_#f52cf5]"></div>
                            <span class="text-[10px] font-black text-nebula-primary uppercase tracking-widest">Aria
                                AI</span>
                        </div>
                        <div v-if="!isOnline"
                            class="flex items-center gap-1 text-[9px] text-red-500 dark:text-red-400 font-bold uppercase transition-colors">
                            <WifiOff class="w-3 h-3" /> Offline
                        </div>
                    </div>
                    <p class="text-[11px] text-slate-600 dark:text-white/70 font-medium leading-relaxed mb-4 transition-colors">
                        Asistencia en verbos y estructuras complejas.
                    </p>
                    <UiButton label="Consultar" variant="primary"
                        class="w-full text-[10px] py-2 h-auto uppercase font-black tracking-widest"
                        :disabled="!isOnline" @click="navigateTo('/message')" />
                </div>
                <UiCard class="border-nebula-secondary/30 p-5 shadow-2xl">
                    <div class="grid grid-cols-2 gap-6">

                        <div class="space-y-4">
                            <h3
                                class="text-[11px] font-black text-nebula-secondary uppercase tracking-[0.15em] border-b border-nebula-secondary/20 pb-2">
                                Conceptos
                            </h3>
                            <ul class="space-y-3">
                                <li v-for="item in ['Fecha inespecífica', 'Relevancia actual', 'Periodo abierto']"
                                    class="flex items-center gap-3 text-[11px] text-slate-800 dark:text-white font-bold uppercase tracking-tight transition-colors">
                                    <span
                                        class="w-2 h-2 bg-nebula-cyan rounded-full shrink-0 shadow-[0_0_8px_#a5b4fc]"></span>
                                    {{ item }}
                                </li>
                            </ul>
                        </div>

                        <div class="space-y-4 border-l border-slate-200 dark:border-white/10 pl-5 transition-colors">
                            <h3
                                class="text-[11px] font-black text-nebula-secondary uppercase tracking-[0.15em] border-b border-nebula-secondary/20 pb-2 text-center">
                                Tips
                            </h3>
                            <div class="space-y-2 font-mono text-[11px]">
                                <div
                                    class="flex justify-between items-center bg-slate-100 dark:bg-white/[0.07] px-3 py-2 rounded-md border border-slate-200 dark:border-white/10 shadow-sm transition-colors">
                                    <span class="text-slate-800 dark:text-white/80 font-bold transition-colors">I, YOU, WE...</span>
                                    <span
                                        class="text-nebula-cyan font-black tracking-widest bg-nebula-cyan/20 px-2 rounded">HAVE</span>
                                </div>
                                <div
                                    class="flex justify-between items-center bg-slate-100 dark:bg-white/[0.07] px-3 py-2 rounded-md border border-slate-200 dark:border-white/10 shadow-sm transition-colors">
                                    <span class="text-slate-800 dark:text-white/80 font-bold transition-colors">HE, SHE, IT...</span>
                                    <span
                                        class="text-nebula-primary font-black tracking-widest bg-nebula-primary/20 px-2 rounded">HAS</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </UiCard>
            </div>
        </div>
    </main>
    <Footer />
</template>

<script setup>
import { WifiOff } from 'lucide-vue-next'
import { ref, onMounted, onUnmounted } from 'vue'

const isOnline = ref(true)

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