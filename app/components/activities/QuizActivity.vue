<template>
  <div class="space-y-8">
    <div v-for="(q, idx) in questions" :key="idx" 
      class="p-6 bg-slate-50 dark:bg-black/20 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm transition-all"
      :class="{ 'border-emerald-500/50 bg-emerald-500/5': results[idx] === 'correct' }">
      
      <div class="flex items-center justify-between mb-4">
        <span class="text-[10px] font-black text-nebula-secondary uppercase tracking-widest">Question {{ idx + 1 }} / {{ questions.length }}</span>
        <div v-if="results[idx]" class="flex items-center gap-2">
          <span v-if="results[idx] === 'correct'" class="text-xs text-emerald-500 font-bold">✅ Correct answer</span>
          <span v-else class="text-xs text-red-500 font-bold">❌ Incorrect answer</span>
        </div>
      </div>

      <p class="text-sm font-bold text-slate-800 dark:text-white mb-6 leading-tight">{{ q.question }}</p>

      <div class="grid grid-cols-1 gap-3">
        <button v-for="(opt, oIdx) in q.options" :key="oIdx"
          @click="selectOption(idx, oIdx)"
          :disabled="results[idx] !== null"
          class="p-4 rounded-xl border transition-all text-sm font-medium text-left flex items-center gap-4 group"
          :class="getOptionClass(idx, oIdx)">
          <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors"
            :class="getBadgeClass(idx, oIdx)">
            <span class="text-[10px]">{{ String.fromCharCode(65 + oIdx) }}</span>
          </div>
          {{ opt }}
        </button>
      </div>
    </div>

    <!-- Final Score Card -->
    <div v-if="isFinished" v-motion :initial="{ opacity: 0, scale: 0.9 }" :enter="{ opacity: 1, scale: 1 }"
      class="p-12 bg-gradient-to-br from-nebula-primary/10 to-nebula-cyan/10 rounded-3xl border border-white/10 text-center space-y-6">
      <h3 class="text-4xl font-black text-white uppercase tracking-tighter">Quiz Complete!</h3>
      <div class="flex items-center justify-center gap-8">
        <div class="text-center">
          <p class="text-[10px] text-white/40 uppercase tracking-widest mb-1">Score</p>
          <p class="text-5xl font-black text-nebula-cyan">{{ Math.round((correctCount / questions.length) * 100) }}%</p>
        </div>
        <div class="w-px h-16 bg-white/10"></div>
        <div class="text-center">
          <p class="text-[10px] text-white/40 uppercase tracking-widest mb-1">Correct</p>
          <p class="text-5xl font-black text-nebula-primary">{{ correctCount }}/{{ questions.length }}</p>
        </div>
      </div>
      <p class="text-sm text-white/60 italic max-w-sm mx-auto">Great job! Your results have been saved to your academic record.</p>
      <div class="flex flex-col sm:flex-row justify-center gap-4">
        <UiButton v-if="!store.user.fullName" label="COMPLETE ACADEMIC RECORD" variant="primary" size="lg" @click="store.status.hasStarted = true; $emit('open-settings')" />
        <UiButton label="RESTART QUIZ" variant="outline" size="lg" @click="resetQuiz" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import confetti from 'canvas-confetti'
import { useGameStore } from '@/stores/useGameStore'

const store = useGameStore()

const questions = [
  {
    question: "Choose the correct Present Perfect sentence:",
    options: ["She has gone to school", "She goes to school", "She going school"],
    correct: 0
  },
  {
    question: "What is the auxiliary verb used for 'I, You, We, They' in Present Perfect?",
    options: ["Has", "Have", "Am"],
    correct: 1
  },
  {
    question: "Complete: I ____ (live) in this city since I was a child.",
    options: ["have lived", "has lived", "lived"],
    correct: 0
  },
  {
    question: "Which word is a past participle?",
    options: ["Eating", "Eaten", "Eats"],
    correct: 1
  },
  {
    question: "Select the correct negative form:",
    options: ["They haven't finished", "They hasn't finished", "They don't finished"],
    correct: 0
  },
  {
    question: "We use 'Just' in Present Perfect for:",
    options: ["Actions that happened a long time ago", "Very recent actions", "Future plans"],
    correct: 1
  },
  {
    question: "Choose the correct question form:",
    options: ["Have you ever been to London?", "Has you ever been to London?", "Do you been to London?"],
    correct: 0
  },
  {
    question: "The auxiliary verb for 'He, She, It' is:",
    options: ["Have", "Has", "Is"],
    correct: 1
  },
  {
    question: "Which sentence uses 'Since' correctly?",
    options: ["I have lived here since 5 years", "I have lived here since 2018", "I have lived here for since Monday"],
    correct: 1
  },
  {
    question: "Choose the correct negative sentence:",
    options: ["We haven't saw that film", "We haven't seen that film", "We hasn't seen that film"],
    correct: 1
  },
  {
    question: "Select the correct question:",
    options: ["Has she already left?", "Have she already left?", "She has already left?"],
    correct: 0
  },
  {
    question: "The past participle of 'Write' is:",
    options: ["Wrote", "Writing", "Written"],
    correct: 2
  }
]

const userAnswers = ref(new Array(questions.length).fill(null))
const results = ref(new Array(questions.length).fill(null))

const correctCount = computed(() => results.value.filter(r => r === 'correct').length)
const isFinished = computed(() => results.value.every(r => r !== null))

const selectOption = (qIdx, oIdx) => {
  userAnswers.value[qIdx] = oIdx
  if (oIdx === questions[qIdx].correct) {
    results.value[qIdx] = 'correct'
    confetti({
      particleCount: 40,
      spread: 40,
      origin: { y: 0.9 },
      colors: ['#00f2ff']
    })
  } else {
    results.value[qIdx] = 'incorrect'
  }

  if (isFinished.value) {
    const finalScore = Math.round((correctCount.value / questions.length) * 100)
    store.setScore(finalScore)
    if (finalScore >= 80) {
      confetti({
        particleCount: 200,
        spread: 120,
        origin: { y: 0.5 }
      })
    }
  }
}

const getOptionClass = (qIdx, oIdx) => {
  if (results.value[qIdx] === null) return 'bg-white dark:bg-black/40 text-slate-600 dark:text-white/60 border-slate-200 dark:border-white/10 hover:border-nebula-primary/30 group-hover:bg-slate-50'
  
  if (oIdx === questions[qIdx].correct) return 'bg-emerald-500 border-emerald-400 text-white'
  if (userAnswers.value[qIdx] === oIdx && oIdx !== questions[qIdx].correct) return 'bg-red-500 border-red-400 text-white'
  
  return 'bg-white dark:bg-black/40 text-slate-400 dark:text-white/20 border-slate-100 dark:border-white/5 opacity-50'
}

const getBadgeClass = (qIdx, oIdx) => {
  if (results.value[qIdx] === null) return 'border-slate-200 dark:border-white/10 text-slate-400 dark:text-white/30 group-hover:border-nebula-primary group-hover:text-nebula-primary'
  return 'border-white/30 text-white'
}

const resetQuiz = () => {
  userAnswers.value = new Array(questions.length).fill(null)
  results.value = new Array(questions.length).fill(null)
}
</script>
