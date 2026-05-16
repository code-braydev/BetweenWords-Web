<template>
  <div class="space-y-8">
    <div v-for="(q, idx) in sentences" :key="idx"
      class="p-6 bg-slate-50 dark:bg-black/20 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm transition-all"
      :class="{ 'border-emerald-500/50 bg-emerald-500/5': results[idx] === 'correct' }">

      <div class="flex items-center justify-between mb-4">
        <span class="text-[10px] font-black text-nebula-cyan uppercase tracking-widest">Sentence {{ idx + 1 }}</span>
        <div v-if="results[idx]" class="flex items-center gap-2">
          <span v-if="results[idx] === 'correct'" class="text-xs text-emerald-500 font-bold">✅ Correct sentence</span>
          <span v-else class="text-xs text-red-500 font-bold">❌ Try again</span>
        </div>
      </div>

      <!-- Drop Area -->
      <div
        class="min-h-[60px] p-4 bg-white dark:bg-black/40 rounded-xl border-2 border-dashed border-slate-200 dark:border-white/10 flex flex-wrap gap-2 items-center transition-colors">
        <div v-for="(word, wIdx) in userSentences[idx]" :key="wIdx"
          class="px-3 py-1.5 bg-nebula-primary text-white rounded-lg text-sm font-medium shadow-md cursor-pointer hover:scale-105 transition-transform"
          @click="removeWord(idx, wIdx)">
          {{ word }}
        </div>
        <p v-if="userSentences[idx] && userSentences[idx].length === 0"
          class="text-xs text-slate-400 dark:text-white/20 italic">Arrastra las palabras aquí...</p>
      </div>

      <!-- Words Pool -->
      <div class="mt-4 flex flex-wrap gap-2">
        <button v-for="(word, wIdx) in shuffledWords[idx]" :key="wIdx" @click="addWord(idx, wIdx)"
          :disabled="results[idx] === 'correct'"
          class="px-3 py-1.5 bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-white/70 rounded-lg text-sm hover:bg-slate-200 dark:hover:bg-white/10 transition-all border border-slate-200 dark:border-white/5 disabled:opacity-30 disabled:cursor-not-allowed">
          {{ word }}
        </button>
      </div>

      <div class="mt-4 flex justify-end">
        <UiButton v-if="results[idx] !== 'correct'" label="CHECK" size="sm" variant="primary"
          :disabled="userSentences[idx].length === 0" @click="checkSentence(idx)" />
        <UiButton v-else label="RESET" size="sm" variant="subtle" @click="resetSentence(idx)" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import nlp from 'compromise'
import confetti from 'canvas-confetti'
import { useGameStore } from '@/stores/useGameStore'
import WRITE_ACTIVITIES from '@/constant/writeActivities'

const store = useGameStore()
const sentences = WRITE_ACTIVITIES

// Initialize arrays with empty values to avoid render errors
const shuffledWords = ref(sentences.map(() => []))
const userSentences = ref(sentences.map(() => []))
const results = ref(sentences.map(() => null))

let winAudio: HTMLAudioElement | null = null

onMounted(() => {
  sentences.forEach((s, idx) => {
    const words = s.split(' ')
    shuffledWords.value[idx] = [...words].sort(() => Math.random() - 0.5)
  })
  winAudio = new Audio('/audios/win.mp3')
})

onUnmounted(() => {
  if (winAudio) {
    winAudio.pause()
    winAudio.src = ''
    winAudio = null
  }
})

const addWord = (sIdx, wIdx) => {
  const word = shuffledWords.value[sIdx][wIdx]
  userSentences.value[sIdx].push(word)
  shuffledWords.value[sIdx].splice(wIdx, 1)
}

const removeWord = (sIdx, wIdx) => {
  if (results.value[sIdx] === 'correct') return
  const word = userSentences.value[sIdx][wIdx]
  shuffledWords.value[sIdx].push(word)
  userSentences.value[sIdx].splice(wIdx, 1)
}

const checkSentence = (idx) => {
  const userStr = userSentences.value[idx].join(' ')
  const targetStr = sentences[idx]

  // Use compromise for some basic normalization if needed, 
  // but for drag and drop exact match is usually expected.
  const docUser = nlp(userStr).normalize().text()
  const docTarget = nlp(targetStr).normalize().text()

  if (docUser === docTarget) {
    results.value[idx] = 'correct'

    if (winAudio) {
      winAudio.currentTime = 0
      winAudio.play().catch(e => console.error(e))
    }

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#f52cf5', '#00f2ff', '#ffffff']
    })
    store.academic.completedExercises++
  } else {
    results.value[idx] = 'incorrect'
    setTimeout(() => {
      if (results.value[idx] === 'incorrect') results.value[idx] = null
    }, 2000)
  }
}

const resetSentence = (idx) => {
  const words = sentences[idx].split(' ')
  shuffledWords.value[idx] = [...words].sort(() => Math.random() - 0.5)
  userSentences.value[idx] = []
  results.value[idx] = null
}
</script>
