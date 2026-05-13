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
            <LucideVolume2 class="w-5 h-5" />
          </button>

          <button @click.stop.prevent="handleToggle(idx)" :disabled="results[idx] === 'perfect'"
            class="w-16 h-16 rounded-full flex items-center justify-center transition-all relative"
            :class="isRecording && currentIdx === idx
              ? 'bg-red-500 scale-110 shadow-[0_0_20px_rgba(239,68,68,0.5)]'
              : 'bg-nebula-primary text-white shadow-lg shadow-nebula-primary/20 hover:scale-105 active:scale-95 disabled:opacity-30'">

            <Mic v-if="!(isRecording && currentIdx === idx)" class="w-8 h-8" />
            <Square v-else class="w-6 h-6 animate-pulse" />

            <div v-if="isRecording && currentIdx === idx"
              class="absolute -inset-2 border-2 border-red-500 rounded-full animate-ping opacity-20" />
          </button>
        </div>

        <div v-if="transcripts[idx] || (isRecording && currentIdx === idx)"
          class="mt-4 p-3 bg-white/50 dark:bg-black/20 rounded-lg border border-slate-200 dark:border-white/5 w-full max-w-sm">
          <div class="flex justify-between items-center mb-1">
            <p class="text-[10px] text-slate-400 uppercase tracking-widest">Tu pronunciación:</p>
            <span v-if="isRecording && currentIdx === idx"
              class="text-[9px] text-nebula-cyan animate-pulse font-black uppercase">Escuchando...</span>
          </div>
          <p class="text-sm font-mono italic">"{{ transcripts[idx] || '...' }}"</p>

          <div class="mt-2 h-1.5 w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
            <div class="h-full bg-nebula-primary transition-all duration-500" :style="{ width: `${scores[idx]}%` }" />
          </div>
          <p class="text-[10px] mt-1 text-right font-bold text-nebula-primary">{{ scores[idx] }}% Similitud</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import fuzzy from 'fuzzy'
import nlp from 'compromise'
import { Mic, Square } from 'lucide-vue-next'

// Nota: No importamos Mic, Square ni Volume2 porque usas lucide-nuxt

interface Sentence {
  text: string
  audio: string
}

type ResultStatus = 'perfect' | 'low' | null

const sentences: Sentence[] = [
  { text: 'I have traveled to many countries', audio: '/audios/speaking-1.mp3' },
  { text: 'She has worked in this company for five years', audio: '/audios/speaking-2.mp3' },
  { text: 'We have seen that movie twice already', audio: '/audios/speaking-3.mp3' },
  { text: 'He has just finished his homework', audio: '/audios/speaking-4.mp3' },
  { text: 'They have lived in London since last year', audio: '/audios/speaking-5.mp3' },
  { text: 'I have already seen that movie', audio: '/audios/speaking-6.mp3' },
  { text: 'She has never visited New York', audio: '/audios/speaking-7.mp3' },
  { text: 'We have finished our homework', audio: '/audios/speaking-8.mp3' },
  { text: 'He has lost his mobile phone', audio: '/audios/speaking-9.mp3' },
  { text: 'You have done a great job', audio: '/audios/speaking-10.mp3' },
]

const store = useGameStore()
const { transcripts, isRecording, currentIdx, toggleRecord: voiceToggle } = useMicrophone(sentences.length)

const scores = ref<number[]>(sentences.map(() => 0))
const results = ref<ResultStatus[]>(sentences.map(() => null))
const debugStatus = ref('Ready')
const activeRecordingIdx = ref<number | null>(null)

// ── Lógica de Limpieza ──────────────────────────────────────────────────
const getCleanText = (text: string) => {
  return nlp(text).text().toLowerCase().trim().replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
}

// ── Lógica Fuzzy ────────────────────────────────────────────────────────
const calculateFuzzySimilarity = (input: string, target: string): number => {
  const cleanInput = getCleanText(input)
  const cleanTarget = getCleanText(target)

  if (!cleanInput) return 0
  if (cleanInput === cleanTarget) return 1.0

  const match = fuzzy.match(cleanInput, cleanTarget)
  if (!match) return 0

  // Normalización del score de la librería fuzzy
  return match.score / (cleanTarget.length * 2)
}

// ── Procesamiento de Resultados ─────────────────────────────────────────
const processFinalResult = async (idx: number) => {
  const transcript = transcripts.value[idx];

  // 1. Verificamos que el transcript exista
  if (!transcript || transcript.trim() === "") {
    debugStatus.value = 'No speech detected';
    return;
  }

  // 2. Verificamos que la sentencia exista (Solución al error TS)
  const targetSentence = sentences[idx]?.text;

  if (!targetSentence) {
    console.error(`No se encontró la sentencia en el índice ${idx}`);
    return;
  }

  // 3. Ahora comparamos con total seguridad
  const similarity = calculateFuzzySimilarity(transcript, targetSentence);
  const finalScore = Math.min(Math.round(similarity * 100 * 1.5), 100)
  scores.value[idx] = finalScore

  if (finalScore >= 80) {
    results.value[idx] = 'perfect'
    debugStatus.value = 'Excellent!'

    const confetti = await import('canvas-confetti')
    confetti.default({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: ['#f52cf5', '#00f2ff']
    })

    if (store?.academic) store.academic.completedExercises++
  } else {
    results.value[idx] = 'low'
    debugStatus.value = finalScore >= 50 ? 'Close! Try again' : 'Keep trying'
  }
}

// ── Control de Grabación ────────────────────────────────────────────────
const handleToggle = (idx: number) => {
  // Si ya estamos grabando en este mismo índice, detenemos
  if (isRecording.value && currentIdx.value === idx) {
    voiceToggle(idx)
    return
  }

  // Si estamos grabando en otro, detenemos el anterior e iniciamos este
  if (isRecording.value && currentIdx.value !== idx) {
    voiceToggle(currentIdx.value!)
  }

  // Inicializamos estado para este índice
  activeRecordingIdx.value = idx
  transcripts.value[idx] = ''
  results.value[idx] = null
  scores.value[idx] = 0
  debugStatus.value = 'Listening...'

  voiceToggle(idx)
}

// ── Watcher para procesar al terminar ──────────────────────────────────
watch(isRecording, (isNow, wasBefore) => {
  if (!isNow && wasBefore && activeRecordingIdx.value !== null) {
    // Esperamos a que el API de voz termine de volcar el texto
    setTimeout(() => {
      processFinalResult(activeRecordingIdx.value!)
      // No reseteamos activeRecordingIdx inmediatamente para evitar conflictos
    }, 250)
  }
})

const listen = (url: string) => {
  new Audio(url).play().catch(e => console.error("Audio error:", e))
}
</script>