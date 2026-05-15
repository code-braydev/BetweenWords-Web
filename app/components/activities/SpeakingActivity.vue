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
          <span v-else-if="isRecording && currentIdx === idx" class="text-[9px] text-slate-400 font-mono uppercase">
            {{ debugStatus }}
          </span>
        </div>
      </div>

      <div class="flex flex-col items-center gap-4 py-4 text-center">
        <p class="text-lg font-bold text-slate-800 dark:text-white leading-tight">"{{ q.text }}"</p>

        <div class="flex items-center gap-4 mt-2">
          <button @click.stop="listen(q.audio)"
            class="p-2 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white/40 hover:text-nebula-cyan transition-colors">
            <Volume2 class="w-5 h-5" />
          </button>

          <button @click.stop.prevent="handleToggle(idx)" :disabled="results[idx] === 'perfect' || isProcessing"
            class="w-16 h-16 rounded-full flex items-center justify-center transition-all relative"
            :class="isRecording && currentIdx === idx
              ? 'bg-red-500 scale-110 shadow-[0_0_20px_rgba(239,68,68,0.5)]'
              : 'bg-nebula-primary text-white shadow-lg shadow-nebula-primary/20 hover:scale-105 active:scale-95 disabled:opacity-30'">

            <template v-if="isProcessing && currentIdx === idx">
              <!-- Spinner while processing -->
              <svg class="w-6 h-6 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </template>
            <template v-else>
              <Mic v-if="!(isRecording && currentIdx === idx)" class="w-8 h-8" />
              <Square v-else class="w-6 h-6 animate-pulse" />
            </template>

            <div v-if="isRecording && currentIdx === idx"
              class="absolute -inset-2 border-2 border-red-500 rounded-full animate-ping opacity-20" />
          </button>
        </div>

        <!-- Error feedback -->
        <p v-if="micError && currentIdx === idx" class="text-[11px] text-red-400 font-medium">{{ micError }}</p>

        <div v-if="transcripts[idx] || (isRecording && currentIdx === idx)"
          class="mt-4 p-3 bg-white/50 dark:bg-black/20 rounded-lg border border-slate-200 dark:border-white/5 w-full max-w-sm">
          <div class="flex justify-between items-center mb-1">
            <p class="text-[10px] text-slate-400 uppercase tracking-widest">Tu pronunciación:</p>
            <span v-if="isRecording && currentIdx === idx"
              class="text-[9px] text-nebula-cyan animate-pulse font-black uppercase">Escuchando...</span>
            <span v-else-if="isProcessing && currentIdx === idx"
              class="text-[9px] text-yellow-400 animate-pulse font-black uppercase">Procesando...</span>
          </div>
          <p class="text-sm font-mono italic">"{{ transcripts[idx] || '...' }}"</p>

          <div class="mt-2 h-1.5 w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
            <div class="h-full bg-nebula-primary transition-all duration-500" :style="{ width: `${speechScores[idx]}%` }" />
          </div>
          <p class="text-[10px] mt-1 text-right font-bold text-nebula-primary">{{ speechScores[idx] }}% Similitud</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Mic, Square, Volume2 } from 'lucide-vue-next'

interface Sentence {
  text: string
  audio: string
  keyword: string[]
}

type ResultStatus = 'perfect' | 'low' | null

const sentences: Sentence[] = [
  { text: 'I have traveled to many countries', audio: '/audios/speaking-1.mp3', keyword: ['have', 'traveled'] },
  { text: 'She has worked in this company for five years', audio: '/audios/speaking-2.mp3', keyword: ['has', 'worked'] },
  { text: 'We have seen that movie twice already', audio: '/audios/speaking-3.mp3', keyword: ['have', 'seen'] },
  { text: 'He has just finished his homework', audio: '/audios/speaking-4.mp3', keyword: ['has', 'finished'] },
  { text: 'They have lived in London since last year', audio: '/audios/speaking-5.mp3', keyword: ['have', 'lived'] },
  { text: 'I have already seen that movie', audio: '/audios/speaking-6.mp3', keyword: ['have', 'seen'] },
  { text: 'She has never visited New York', audio: '/audios/speaking-7.mp3', keyword: ['has', 'visited'] },
  { text: 'We have finished our homework', audio: '/audios/speaking-8.mp3', keyword: ['have', 'finished'] },
  { text: 'He has lost his mobile phone', audio: '/audios/speaking-9.mp3', keyword: ['has', 'lost'] },
  { text: 'You have done a great job', audio: '/audios/speaking-10.mp3', keyword: ['have', 'done'] },
]

const store = useGameStore()
const {
  transcripts,
  scores: speechScores,  // Use scores from useSpeech directly
  isRecording,
  isProcessing,
  currentIdx,
  micError,
  clearError,
  toggleRecord: voiceToggle,
} = useSpeech(sentences.length, {
  isExam: false,
  getExpectedText: (idx: number) => sentences[idx]?.text,
  getExpectedKeywords: (idx: number) => sentences[idx]?.keyword,
})

const results = ref<ResultStatus[]>(sentences.map(() => null))
const debugStatus = ref('Ready')
const activeRecordingIdx = ref<number | null>(null)

// ── Procesamiento de Resultados ─────────────────────────────────────────
const processFinalResult = (idx: number) => {
  const transcript = transcripts.value[idx]
  const score = speechScores.value[idx] ?? 0

  if (!transcript || transcript.trim() === '') {
    debugStatus.value = 'No speech detected'
    return
  }

  // Use the score already computed by useSpeech (handles both native and upload modes)
  if (score >= 85) {
    results.value[idx] = 'perfect'
    debugStatus.value = 'Excellent!'

    import('canvas-confetti').then((confetti) => {
      confetti.default({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#f52cf5', '#00f2ff']
      })
    })

    if (store?.academic) store.academic.completedExercises++
  } else {
    results.value[idx] = 'low'
    debugStatus.value = score >= 70 ? 'Close! Try again' : 'Keep trying'
  }
}

// ── Control de Grabación ────────────────────────────────────────────────
const handleToggle = async (idx: number) => {
  // If already recording this index, stop it
  if (isRecording.value && currentIdx.value === idx) {
    await voiceToggle(idx)
    return
  }

  // If recording a different index, stop it first
  if (isRecording.value && currentIdx.value !== null && currentIdx.value !== idx) {
    await voiceToggle(currentIdx.value)
  }

  // Reset state for this index
  activeRecordingIdx.value = idx
  transcripts.value[idx] = ''
  results.value[idx] = null
  speechScores.value[idx] = 0
  debugStatus.value = 'Listening...'
  clearError()

  await voiceToggle(idx)
}

// ── Watcher: process result when recording stops ────────────────────────
// Watch both isRecording and isProcessing to handle both native and upload modes
watch([isRecording, isProcessing], ([nowRecording, nowProcessing], [wasRecording, wasProcessing]) => {
  // Trigger when recording just stopped
  if (!nowRecording && wasRecording && activeRecordingIdx.value !== null) {
    if (micError.value) return
    debugStatus.value = 'Processing...'
  }

  // Trigger when processing just finished (upload mode finishes here)
  if (!nowProcessing && wasProcessing && activeRecordingIdx.value !== null) {
    if (micError.value) return
    // Small delay to ensure reactive refs have settled
    setTimeout(() => {
      processFinalResult(activeRecordingIdx.value!)
    }, 100)
  }

  // Native mode: processing is not used, so trigger when recording stops with a transcript
  if (!nowRecording && wasRecording && !nowProcessing && activeRecordingIdx.value !== null) {
    if (micError.value) return
    setTimeout(() => {
      // Only process if it hasn't been triggered by the processing watcher
      if (results.value[activeRecordingIdx.value!] === null && transcripts.value[activeRecordingIdx.value!]) {
        processFinalResult(activeRecordingIdx.value!)
      }
    }, 300)
  }
})

watch(micError, (errorText) => {
  if (errorText) {
    debugStatus.value = errorText
  }
})

const listen = (url: string) => {
  new Audio(url).play().catch(e => console.error('Audio error:', e))
}
</script>