<template>
    <div class="flex flex-col bg-slate-50/90 dark:bg-black/80 backdrop-blur-3xl rounded-2xl overflow-hidden border border-slate-300 dark:border-white/10 shadow-2xl">
        <!-- Browser Toolbar -->
        <div class="h-12 bg-slate-200 dark:bg-black/40 border-b border-slate-300 dark:border-white/10 flex items-center px-4 gap-4 shrink-0">
            <!-- Window Controls -->
            <div class="flex gap-2">
                <div class="w-3 h-3 rounded-full bg-red-500"></div>
                <div class="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div class="w-3 h-3 rounded-full bg-green-500"></div>
            </div>
            <!-- Navigation -->
            <div class="flex gap-2 text-slate-500 dark:text-white/40">
                <ChevronLeft class="w-5 h-5 cursor-pointer hover:text-slate-800 dark:hover:text-white transition-colors" />
                <ChevronRight class="w-5 h-5 cursor-pointer hover:text-slate-800 dark:hover:text-white transition-colors" />
                <RotateCw class="w-4 h-4 mt-0.5 cursor-pointer hover:text-slate-800 dark:hover:text-white transition-colors" />
            </div>
            <!-- URL Bar -->
            <div class="flex-1 bg-white dark:bg-black/60 border border-slate-300 dark:border-white/10 rounded-lg h-8 flex items-center px-3 gap-2">
                <Lock class="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                <span class="text-xs font-mono text-slate-700 dark:text-white/80 select-all">http://exam.local/level1</span>
            </div>
        </div>

        <!-- Browser Content (Exam) -->
        <div class="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-12 relative bg-white dark:bg-transparent">
            <div class="max-w-3xl mx-auto">
                <div v-if="!submitted">
                    <div class="mb-8 border-b border-slate-200 dark:border-white/10 pb-6">
                        <h1 class="text-2xl font-bold text-slate-800 dark:text-nebula-text mb-2 uppercase tracking-wide">Level 1: Present Perfect</h1>
                        <p class="text-sm text-slate-600 dark:text-white/60">Complete the following sentences using the correct form of the Present Perfect tense.</p>
                    </div>

                    <div class="space-y-8">
                        <!-- Question 1 -->
                        <div class="space-y-3">
                            <p class="text-slate-800 dark:text-white font-medium text-sm">
                                <span class="text-nebula-primary dark:text-nebula-cyan mr-2 font-bold font-mono">01.</span>
                                I <span class="border-b border-dashed border-slate-400 w-16 inline-block mx-1"></span> (never / visit) the city known as the Pearl of the Sinú.
                            </p>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-6">
                                <label v-for="opt in q1Options" :key="opt" :class="[
                                    'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all',
                                    answers.q1 === opt 
                                        ? 'border-nebula-primary bg-nebula-primary/10 shadow-[0_0_10px_rgba(124,34,228,0.2)] dark:shadow-[0_0_10px_rgba(0,242,255,0.2)]' 
                                        : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-50 dark:hover:bg-white/5'
                                ]">
                                    <input type="radio" :value="opt" v-model="answers.q1" class="hidden" />
                                    <div :class="[
                                        'w-4 h-4 rounded-full border flex items-center justify-center transition-colors',
                                        answers.q1 === opt ? 'border-nebula-primary bg-nebula-primary' : 'border-slate-400 dark:border-white/40'
                                    ]">
                                        <div v-if="answers.q1 === opt" class="w-2 h-2 rounded-full bg-white"></div>
                                    </div>
                                    <span class="text-sm text-slate-700 dark:text-white/80 font-mono">{{ opt }}</span>
                                </label>
                            </div>
                        </div>

                        <!-- Question 2 -->
                        <div class="space-y-3">
                            <p class="text-slate-800 dark:text-white font-medium text-sm">
                                <span class="text-nebula-primary dark:text-nebula-cyan mr-2 font-bold font-mono">02.</span>
                                She <span class="border-b border-dashed border-slate-400 w-16 inline-block mx-1"></span> (already / finish) her homework.
                            </p>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-6">
                                <label v-for="opt in q2Options" :key="opt" :class="[
                                    'flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all',
                                    answers.q2 === opt 
                                        ? 'border-nebula-primary bg-nebula-primary/10 shadow-[0_0_10px_rgba(124,34,228,0.2)] dark:shadow-[0_0_10px_rgba(0,242,255,0.2)]' 
                                        : 'border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 hover:bg-slate-50 dark:hover:bg-white/5'
                                ]">
                                    <input type="radio" :value="opt" v-model="answers.q2" class="hidden" />
                                    <div :class="[
                                        'w-4 h-4 rounded-full border flex items-center justify-center transition-colors',
                                        answers.q2 === opt ? 'border-nebula-primary bg-nebula-primary' : 'border-slate-400 dark:border-white/40'
                                    ]">
                                        <div v-if="answers.q2 === opt" class="w-2 h-2 rounded-full bg-white"></div>
                                    </div>
                                    <span class="text-sm text-slate-700 dark:text-white/80 font-mono">{{ opt }}</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    <div class="mt-12 flex justify-end">
                        <UiButton label="SUBMIT EXAM" variant="primary" :disabled="!isComplete" @click="submitExam" />
                    </div>
                </div>

                <!-- Submitted State -->
                <div v-else class="flex flex-col items-center justify-center py-20 text-center space-y-6">
                    <div class="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center mb-4">
                        <Check class="w-10 h-10 text-emerald-500" />
                    </div>
                    <h2 class="text-3xl font-bold text-slate-800 dark:text-white">Exam Submitted!</h2>
                    <p class="text-slate-500 dark:text-white/60 max-w-md">Your answers have been recorded in the database. The system has calculated your final grade.</p>
                    
                    <div class="pt-8">
                        <UiButton label="VER NOTA" variant="secondary" iconClass="text-white" :icon="FileSpreadsheet" size="lg" @click="viewGrade" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ChevronLeft, ChevronRight, RotateCw, Lock, Check, FileSpreadsheet } from 'lucide-vue-next'
import { useGameStore } from '@/stores/useGameStore'

const store = useGameStore()

const q1Options = [
    'has never visited',
    'have never visited',
    'never have visited',
    'never has visited'
]

const q2Options = [
    'has already finished',
    'have already finished',
    'already has finished',
    'has finished already'
]

const answers = ref({
    q1: '',
    q2: ''
})

const submitted = ref(false)

const isComplete = computed(() => answers.value.q1 && answers.value.q2)

const submitExam = () => {
    let score = 0
    if (answers.value.q1 === 'have never visited') score += 50
    if (answers.value.q2 === 'has already finished') score += 50
    
    store.setScore(score)
    submitted.value = true
}

const viewGrade = () => {
    store.openApp('excel')
}
</script>
