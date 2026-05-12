<template>
  <div class="space-y-8">
    <div v-for="(q, idx) in sentences" :key="idx"
      class="p-6 bg-slate-50 dark:bg-black/20 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm transition-all"
      :class="{ 'border-emerald-500/50 bg-emerald-500/5': results[idx] === 'perfect' }">

      <div class="flex items-center justify-between mb-4">
        <span class="text-[10px] font-black text-nebula-cyan uppercase tracking-widest">Speaking Practice {{ idx + 1
          }}</span>
        <div class="flex items-center gap-2">
          <span v-if="results[idx] === 'perfect'" class="text-xs text-emerald-500 font-bold">✅ Good pronunciation</span>
          <span v-else-if="results[idx] === 'low'" class="text-xs text-red-500 font-bold">❌ Repeat the pronunciation</span>
          <span v-else-if="isRecording && currentIdx === idx" class="text-[9px] text-slate-400 font-mono uppercase">{{ debugStatus }}</span>
        </div>
      </div>

      <div class="flex flex-col items-center gap-4 py-4 text-center">
        <p class="text-lg font-bold text-slate-800 dark:text-white leading-tight">"{{ q.text }}"</p>

        <div class="flex items-center gap-4 mt-2">
          <button @click="listen(q.audio)"
            class="p-2 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white/40 hover:text-nebula-cyan transition-colors">
            <Volume2 class="w-5 h-5" />
          </button>

          <button @click="toggleRecord(idx, q)" :disabled="results[idx] === 'perfect'"
            class="w-16 h-16 rounded-full flex items-center justify-center transition-all relative"
            :class="isRecording && currentIdx === idx ? 'bg-red-500 scale-110 shadow-[0_0_20px_rgba(239,68,68,0.5)]' : 'bg-nebula-primary text-white shadow-lg shadow-nebula-primary/20 hover:scale-105 active:scale-95 disabled:opacity-30'">
            <Mic v-if="!(isRecording && currentIdx === idx)" class="w-8 h-8" />
            <Square v-else class="w-6 h-6 animate-pulse" />

            <div v-if="isRecording && currentIdx === idx"
              class="absolute -inset-2 border-2 border-red-500 rounded-full animate-ping opacity-20"></div>
          </button>
        </div>

        <div v-if="transcripts[idx] || (isRecording && currentIdx === idx)"
          class="mt-4 p-3 bg-white/50 dark:bg-black/20 rounded-lg border border-slate-200 dark:border-white/5 w-full max-w-sm">
          <div class="flex justify-between items-center mb-1">
            <p class="text-[10px] text-slate-400 uppercase tracking-widest">Tu pronunciación:</p>
            <span v-if="isRecording && currentIdx === idx" class="text-[9px] text-nebula-cyan animate-pulse font-black uppercase">Escuchando...</span>
          </div>
          <p class="text-sm font-mono italic">"{{ transcripts[idx] }}"</p>
          <div class="mt-2 h-1.5 w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
            <div class="h-full bg-nebula-primary transition-all duration-1000" :style="{ width: `${scores[idx]}%` }">
            </div>
          </div>
          <p class="text-[10px] mt-1 text-right font-bold text-nebula-primary">{{ scores[idx] }}% Similitud</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Mic, Square, Volume2 } from 'lucide-vue-next'
import fuzzy from 'fuzzy'
import confetti from 'canvas-confetti'
import { useGameStore } from '@/stores/useGameStore'

const store = useGameStore()

const sentences = [
  { text: "I have traveled to many countries", audio: "/audios/speaking-1.mp3" },
  { text: "She has worked in this company for five years", audio: "/audios/speaking-2.mp3" },
  { text: "We have seen that movie twice already", audio: "/audios/speaking-3.mp3" },
  { text: "He has just finished his homework", audio: "/audios/speaking-4.mp3" },
  { text: "They have lived in London since last year", audio: "/audios/speaking-5.mp3" },
  { text: "I have already seen that movie", audio: "/audios/speaking-6.mp3" },
  { text: "She has never visited New York", audio: "/audios/speaking-7.mp3" },
  { text: "We have finished our homework", audio: "/audios/speaking-8.mp3" },
  { text: "He has lost his mobile phone", audio: "/audios/speaking-9.mp3" },
  { text: "You have done a great job", audio: "/audios/speaking-10.mp3" }
]

const transcripts = ref(sentences.map(() => ''))
const scores = ref(sentences.map(() => 0))
const results = ref(sentences.map(() => null))
const isRecording = ref(false)
const currentIdx = ref(null)
const debugStatus = ref('Ready')
const accumulatedText = ref('')

let recognition = null

const startRecognition = (idx) => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SpeechRecognition) {
    debugStatus.value = 'Not supported'
    return
  }

  // Si ya existe una instancia, la detenemos
  if (recognition) {
    try { recognition.stop() } catch(e) {}
  }

  recognition = new SpeechRecognition()
  recognition.lang = 'en-US'
  recognition.continuous = true // Volvemos a continuo para probar en Vercel/SSL
  recognition.interimResults = true

  recognition.onstart = () => {
    debugStatus.value = 'Listening...'
    isRecording.value = true
  }

  recognition.onresult = (event) => {
    let final = ''
    let interim = ''
    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        final += event.results[i][0].transcript
      } else {
        interim += event.results[i][0].transcript
      }
    }
    const current = (final || interim).trim()
    if (current) {
      transcripts.value[idx] = current
      debugStatus.value = 'Heard: ' + current.substring(0, 15)
    }
  }

  recognition.onerror = (event) => {
    console.error('Error:', event.error)
    debugStatus.value = 'Error: ' + event.error
    isRecording.value = false
  }

  recognition.onend = () => {
    console.log('Mic ended')
    if (isRecording.value) {
      // Si se cortó pero seguimos en estado grabación, reintentamos
      try { recognition.start() } catch(e) {}
    } else {
      debugStatus.value = 'Analyzing...'
      processFinalResult()
    }
  }

  recognition.start()
}

onMounted(() => {
  // Ya no inicializamos aquí para evitar objetos "muertos"
})

const processFinalResult = () => {
  const transcript = transcripts.value[currentIdx.value]
  if (!transcript) {
    debugStatus.value = 'No speech detected'
    return
  }

  const target = sentences[currentIdx.value].text
  const similarity = calculateSimilarity(transcript, target)
  scores.value[currentIdx.value] = Math.round(similarity * 100)

  // Restaurado al 80% por petición del usuario (Rigor Académico)
  if (similarity >= 0.80) {
    results.value[currentIdx.value] = 'perfect'
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.5 },
      colors: ['#f52cf5', '#00f2ff']
    })
    store.academic.completedExercises++
    debugStatus.value = 'Excellent!'
  } else if (similarity >= 0.50) {
    results.value[currentIdx.value] = 'low'
    debugStatus.value = 'Close! Try again'
  } else {
    results.value[currentIdx.value] = 'low'
    debugStatus.value = 'Keep trying'
  }
}

const calculateSimilarity = (s1, s2) => {
  const clean = (s) => s.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").replace(/\s+/g, " ").trim().toLowerCase();
  const n1 = clean(s1);
  const n2 = clean(s2);
  if (n1 === n2) return 1.0;
  let longer = n1.length > n2.length ? n1 : n2;
  let shorter = n1.length > n2.length ? n2 : n1;
  if (longer.length === 0) return 1.0;
  return (longer.length - editDistance(longer, shorter)) / parseFloat(longer.length);
}

const editDistance = (s1, s2) => {
  let costs = new Array();
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i;
    for (let j = 0; j <= s2.length; j++) {
      if (i == 0) costs[j] = j;
      else {
        if (j > 0) {
          let newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

const listen = (url) => {
  const audio = new Audio(url)
  audio.play()
}

const toggleRecord = (idx) => {
  if (isRecording.value) {
    isRecording.value = false
    if (recognition) recognition.stop()
  } else {
    currentIdx.value = idx
    accumulatedText.value = ''
    transcripts.value[idx] = ''
    results.value[idx] = null
    startRecognition(idx)
  }
}
</script>
