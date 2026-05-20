<template>
  <div class="space-y-8">
    <div v-for="(q, idx) in sentences" :key="idx"
      class="p-6 bg-slate-50 dark:bg-black/20 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm transition-all"
      :class="{ 'border-emerald-500/50 bg-emerald-500/5': results[idx] === 'perfect' }">

      <div class="flex items-center justify-between mb-4">
        <span class="text-[10px] font-black text-nebula-cyan uppercase tracking-widest">
          Speaking Practice {{ idx + 1 }}
        </span>
        <div class="flex items-center gap-2">
          <span v-if="results[idx] === 'perfect'" class="text-xs text-emerald-500 font-bold">✅ Good pronunciation</span>
          <span v-else-if="results[idx] === 'low'" class="text-xs text-red-500 font-bold">❌ Repeat the
            pronunciation</span>
          <span v-else-if="isRecording && activeRecordingIdx === idx"
            class="text-[9px] text-slate-400 font-mono uppercase">
            {{ debugStatus }}
          </span>
        </div>
      </div>

      <div class="flex flex-col items-center gap-4 py-4 text-center">
        <p class="text-lg font-bold text-slate-800 dark:text-white leading-tight">"{{ q.text }}"</p>

        <div class="flex items-center gap-4 mt-2">
          <button type="button" @click.stop.prevent="listen(q.audio)"
            class="relative z-10 p-2 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white/40 hover:text-nebula-cyan transition-colors">
            <Volume2 class="w-5 h-5 pointer-events-none" />
          </button>

          <button type="button" @click.stop.prevent="handleToggle(idx)"
            :disabled="(isProcessing && activeRecordingIdx === idx) || results[idx] === 'perfect'"
            class="relative z-10 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 group"
            :class="[
              // State 0: Idle
              !isRecording && !isProcessing && results[idx] === null ? 'bg-nebula-primary shadow-neon-fuchsia hover:scale-110' : '',

              // State 1: Recording
              isRecording && activeRecordingIdx === idx ? 'bg-red-500 shadow-[0_0_20px_rgba(239,68,68,0.6)] scale-110' : '',

              // State 2: Processing
              isProcessing && activeRecordingIdx === idx ? 'bg-slate-600 cursor-wait opacity-80' : '',

              // State 3: Feedback
              results[idx] === 'perfect' ? 'bg-emerald-500 shadow-neon-cyan' : '',
              results[idx] === 'low' && activeRecordingIdx === idx && !isRecording && !isProcessing ? 'bg-amber-500' : ''
            ]">

            <!-- State Icons -->
            <template v-if="isProcessing && activeRecordingIdx === idx">
              <Loader2 class="w-6 h-6 animate-spin text-white pointer-events-none" />
            </template>
            <template v-else-if="isRecording && activeRecordingIdx === idx">
              <Square class="w-6 h-6 text-white animate-pulse pointer-events-none" />
            </template>
            <template v-else-if="results[idx] === 'perfect'">
              <Check class="w-8 h-8 text-white pointer-events-none" />
            </template>
            <template v-else>
              <Mic class="w-7 h-7 text-white pointer-events-none"
                :class="{ 'animate-bounce': !isRecording && !results[idx] }" />
            </template>

            <!-- Pulse Effect for Idle -->
            <div v-if="!isRecording && !isProcessing && results[idx] === null"
              class="pointer-events-none absolute -inset-1 border border-nebula-primary rounded-full animate-ping opacity-30" />

            <!-- Pulse Effect for Recording -->
            <div v-if="isRecording && activeRecordingIdx === idx"
              class="pointer-events-none absolute -inset-2 border-2 border-red-500 rounded-full animate-ping opacity-40" />
          </button>
        </div>

        <!-- Error feedback -->
        <p v-if="micError && activeRecordingIdx === idx" class="text-[11px] text-red-400 font-medium">{{ micError }}</p>

        <div v-if="transcripts[idx] || (isRecording && activeRecordingIdx === idx)"
          class="mt-4 p-3 bg-white/50 dark:bg-black/20 rounded-lg border border-slate-200 dark:border-white/5 w-full max-w-sm">
          <div class="flex justify-between items-center mb-1">
            <p class="text-[10px] text-slate-400 uppercase tracking-widest">Tu pronunciación:</p>
            <span v-if="isRecording && activeRecordingIdx === idx"
              class="text-[9px] text-nebula-cyan animate-pulse font-black uppercase">Escuchando...</span>
            <span v-else-if="isProcessing && activeRecordingIdx === idx"
              class="text-[9px] text-yellow-400 animate-pulse font-black uppercase">Procesando...</span>
          </div>
          <p class="text-sm font-mono italic">"{{ transcripts[idx] || '...' }}"</p>

          <ProgressBar :progress="speechScores[idx] || 0" label="Similitud" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { Mic, Square, Volume2, Loader2, Check } from 'lucide-vue-next'
import ProgressBar from '@/components/ui/ProgressBar.vue'
import SPEAK_ACTIVITIES from '@/constant/speakActivities'
import confetti from 'canvas-confetti'

type ResultStatus = 'perfect' | 'low' | null

const sentences = SPEAK_ACTIVITIES

const store = useGameStore()
const {
  isRecording,
  isProcessing,
  transcript,
  attemptsLeft,
  micError,
  startRecording,
  stopRecording
} = useSpeech()

const transcripts = ref<string[]>(sentences.map(() => ''))
const speechScores = ref<number[]>(sentences.map(() => 0))
const results = ref<ResultStatus[]>(sentences.map(() => null))
const debugStatus = ref('Ready')
const activeRecordingIdx = ref<number | null>(null)

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

const calculateScore = (spoken: string, expected: string, keywords: string[]) => {
  if (!spoken) return 0
  const normalize = (text: string) => text.toLowerCase().replace(/[.,!?]/g, '').trim()
  const sText = normalize(spoken)
  const eText = normalize(expected)

  if (sText === eText) return 100

  const wordsSpoken = sText.split(' ')
  let matchedKeywords = 0
  for (const kw of keywords) {
    if (wordsSpoken.includes(kw.toLowerCase())) {
      matchedKeywords++
    }
  }

  const keywordScore = keywords.length > 0 ? (matchedKeywords / keywords.length) * 100 : 0

  if (keywordScore === 100) return 90
  if (keywordScore > 0) return 60
  return sText.length > 0 ? 30 : 0
}

// ── Procesamiento de Resultados ─────────────────────────────────────────
const processFinalResult = (idx: number) => {
  const t = transcripts.value[idx]
  const score = speechScores.value[idx] ?? 0

  if (!t || t.trim() === '') {
    debugStatus.value = 'No speech detected'
    return
  }

  if (score >= 85) {
    results.value[idx] = 'perfect'
    debugStatus.value = 'Excellent!'

    if (winAudio) {
      winAudio.currentTime = 0
      winAudio.play().catch(e => console.error('Audio play error:', e))
    }

    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#f52cf5', '#00f2ff']
    })

    if (store?.academic) store.academic.completedExercises++
  } else {
    results.value[idx] = 'low'
    debugStatus.value = score >= 70 ? 'Close! Try again' : 'Keep trying'
  }
}

// ── Control de Grabación ────────────────────────────────────────────────
const handleToggle = async (idx: number) => {
  if (isRecording.value && activeRecordingIdx.value === idx) {
    stopRecording()
    return
  }

  if (isRecording.value && activeRecordingIdx.value !== null && activeRecordingIdx.value !== idx) {
    stopRecording()
  }

  activeRecordingIdx.value = idx
  transcripts.value[idx] = ''
  results.value[idx] = null
  speechScores.value[idx] = 0
  debugStatus.value = 'Listening...'

  await startRecording()
}

// ── Watchers ────────────────────────────────────────────────────────────
watch(isProcessing, (nowProcessing, wasProcessing) => {
  if (!nowProcessing && wasProcessing && activeRecordingIdx.value !== null) {
    if (micError.value) return

    const idx = activeRecordingIdx.value
    transcripts.value[idx] = transcript.value || ''

    const expectedText = sentences[idx]?.text || ''
    const expectedKeywords = sentences[idx]?.keyword || []
    speechScores.value[idx] = calculateScore(transcripts.value[idx], expectedText, expectedKeywords)

    processFinalResult(idx)
  }
})

watch(isRecording, (nowRecording) => {
  if (nowRecording) {
    debugStatus.value = `Listening... (${attemptsLeft.value} attempts left)`
  } else if (isProcessing.value) {
    debugStatus.value = 'Processing...'
  }
})

const listen = (url: string) => {
  new Audio(url).play().catch(e => console.error('Audio error:', e))
}
</script>