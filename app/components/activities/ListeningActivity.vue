<template>
  <div class="space-y-8">
    <div class="mb-6">
      <ProgressBar :progress="progressPercentage" label="Progreso General" />
    </div>
    <div v-for="(q, idx) in questions" :key="idx"
      class="p-6 bg-slate-50 dark:bg-black/20 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm transition-all"
      :class="{ 'border-emerald-500/50 bg-emerald-500/5': results[idx] === 'correct' }">

      <div class="flex items-center justify-between mb-4">
        <span class="text-[10px] font-black text-nebula-cyan uppercase tracking-widest">Listening Task {{ idx + 1
        }}</span>
        <div v-if="results[idx]" class="flex items-center gap-2">
          <span v-if="results[idx] === 'correct'" class="text-xs text-emerald-500 font-bold">✅ Correct answer</span>
          <span v-else class="text-xs text-red-500 font-bold">❌ Incorrect answer</span>
        </div>
      </div>

      <div class="flex flex-col items-center gap-6 py-4">
        <button @click="playAudio(q.audioUrl)"
          class="w-20 h-20 rounded-full bg-nebula-primary/10 border border-nebula-primary/30 flex items-center justify-center hover:bg-nebula-primary/20 transition-all group active:scale-90">
          <Volume2 class="w-10 h-10 text-nebula-primary group-hover:scale-110 transition-transform" />
        </button>
        <p class="text-sm font-bold text-slate-700 dark:text-white/90 italic text-center">{{ q.question }}</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
        <button v-for="opt in q.options" :key="opt" @click="selectOption(idx, opt)"
          :disabled="results[idx] === 'correct'" class="p-4 rounded-xl border transition-all text-sm font-medium"
          :class="[
            selectedAnswers[idx] === opt
              ? (results[idx] === 'correct' ? 'bg-emerald-500 text-white border-emerald-400' : 'bg-nebula-primary text-white border-nebula-primary/50')
              : 'bg-white dark:bg-black/40 text-slate-600 dark:text-white/60 border-slate-200 dark:border-white/10 hover:border-nebula-primary/30'
          ]">
          {{ opt }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { Volume2 } from 'lucide-vue-next'
import confetti from 'canvas-confetti'
import { useGameStore } from '@/stores/useGameStore'
import LISTEN_ACTIVITIES from '@/constant/listenActivities'
import ProgressBar from '@/components/ui/ProgressBar.vue'

type ResultStatus = 'correct' | 'incorrect' | null

const store = useGameStore()
const questions = LISTEN_ACTIVITIES

const selectedAnswers = ref<(string | null)[]>(questions.map(() => null))
const results = ref<ResultStatus[]>(questions.map(() => null))

const progressPercentage = computed(() => {
  const correct = results.value.filter(r => r === 'correct').length
  return (correct / questions.length) * 100
})

let winAudio: HTMLAudioElement | null = null

onMounted(() => {
  winAudio = new Audio('/audios/win.mp3')
})

onUnmounted(() => {
  if (winAudio) {
    winAudio.pause()
    winAudio.src = ''
    winAudio = null
  }
})

const playAudio = (url: string): void => {
  const audio = new Audio(url)
  audio.play()
}

const selectOption = (idx: number, opt: string): void => {
  selectedAnswers.value[idx] = opt
  const question = questions[idx]
  if (question && opt === question.correct) {
    results.value[idx] = 'correct'

    if (winAudio) {
      winAudio.currentTime = 0
      winAudio.play().catch(e => console.error(e))
    }

    confetti({
      particleCount: 80,
      spread: 50,
      origin: { y: 0.8 },
      colors: ['#00f2ff', '#ffffff']
    })
    store.academic.completedExercises++
  } else {
    results.value[idx] = 'incorrect'
    setTimeout(() => {
      if (results.value[idx] === 'incorrect') {
        results.value[idx] = null
        selectedAnswers.value[idx] = null
      }
    }, 1500)
  }
}
</script>
