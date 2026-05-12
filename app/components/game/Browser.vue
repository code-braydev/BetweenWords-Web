<template>
    <div
        class="flex h-full flex-col bg-slate-50/90 dark:bg-black/80 backdrop-blur-3xl rounded-2xl overflow-hidden border border-slate-300 dark:border-white/10 shadow-2xl relative">
        <!-- Browser Toolbar -->
        <div
            class="h-12 bg-slate-200/80 dark:bg-black/60 backdrop-blur-xl border-b border-slate-300 dark:border-white/10 flex items-center px-4 gap-4 shrink-0 z-50 shadow-lg">
            <!-- Window Controls -->
            <GameWindowControls />
            <!-- Navigation -->
            <div class="flex gap-2 text-slate-500 dark:text-white/40">
                <ChevronLeft
                    class="w-5 h-5 cursor-pointer hover:text-slate-800 dark:hover:text-white transition-colors" />
                <ChevronRight
                    class="w-5 h-5 cursor-pointer hover:text-slate-800 dark:hover:text-white transition-colors" />
                <RotateCw
                    class="w-4 h-4 mt-0.5 cursor-pointer hover:text-slate-800 dark:hover:text-white transition-colors" />
            </div>
            <!-- URL Bar -->
            <div
                class="flex-1 bg-white/50 dark:bg-black/40 border border-slate-300 dark:border-white/10 rounded-lg h-8 flex items-center px-3 gap-2">
                <Lock class="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span
                    class="text-xs font-mono text-slate-700 dark:text-white/80 select-all">http://exam.local/level1</span>
            </div>
        </div>

        <!-- Browser Content (Exam) -->
        <div class="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-12 relative bg-white dark:bg-transparent">
            <div class="max-w-3xl mx-auto">
                <div v-if="!submitted">
                    <div class="mb-8 border-b border-slate-200 dark:border-white/10 pb-6">
                        <h1 class="text-2xl font-bold text-slate-800 dark:text-white mb-2 uppercase tracking-wide">Final
                            Evaluation: Present Perfect</h1>
                        <p class="text-sm text-slate-600 dark:text-white/60">Demuestra tus conocimientos respondiendo
                            este cuestionario final.</p>
                    </div>

                    <QuizActivity />

                    <div
                        class="mt-12 p-6 bg-slate-50 dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10 text-center">
                        <p class="text-[10px] text-slate-400 dark:text-white/30 uppercase tracking-[0.2em] font-bold">
                            Tus resultados se sincronizarán con el reporte de notas en Excel.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { ChevronLeft, ChevronRight, RotateCw, Lock } from 'lucide-vue-next'
import QuizActivity from '@/components/activities/QuizActivity.vue'

const submitted = ref(false)
</script>
