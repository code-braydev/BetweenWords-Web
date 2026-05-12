<template>
  <div class="space-y-8">
    <div
      class="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-slate-50 dark:bg-black/20 rounded-2xl border border-slate-200 dark:border-white/5">
      <div>
        <p class="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 dark:text-white/40 mb-1">Total</p>
        <p class="text-2xl font-black text-slate-900 dark:text-white">15 preguntas</p>
      </div>
      <div>
        <p class="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 dark:text-white/40 mb-1">Aciertos</p>
        <p class="text-2xl font-black text-nebula-cyan">{{ correctCount }}/15</p>
      </div>
      <div>
        <p class="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 dark:text-white/40 mb-1">Progreso</p>
        <p class="text-2xl font-black text-nebula-primary">{{ completedCount }}/15</p>
      </div>
    </div>

    <div v-for="(q, idx) in questions" :key="q.id"
      class="p-6 bg-slate-50 dark:bg-black/20 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm transition-all"
      :class="{ 'border-emerald-500/50 bg-emerald-500/5': results[idx] === 'correct' }">

      <div class="flex items-center justify-between gap-3 mb-4">
        <div class="flex items-center gap-3 flex-wrap">
          <span class="text-[10px] font-black text-nebula-secondary uppercase tracking-widest">Pregunta {{ idx + 1 }} /
            {{ questions.length }}</span>
          <span class="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full border"
            :class="sectionBadgeClass(q.section)">{{ q.section }}</span>
        </div>
        <div v-if="results[idx]" class="flex items-center gap-2">
          <span v-if="results[idx] === 'correct'" class="text-xs text-emerald-500 font-bold">✅ Correcto</span>
          <span v-else class="text-xs text-red-500 font-bold">❌ Incorrecto</span>
        </div>
      </div>

      <p class="text-sm font-bold text-slate-800 dark:text-white mb-4 leading-tight">{{ q.question }}</p>

      <div v-if="q.type === 'multiple' || q.type === 'listening'" class="grid grid-cols-1 gap-3">
        <div v-if="q.type === 'listening'" class="flex justify-center mb-2">
          <button @click="playAudio(q.audioUrl)"
            class="w-16 h-16 rounded-full bg-nebula-primary/10 border border-nebula-primary/30 flex items-center justify-center hover:bg-nebula-primary/20 transition-all group active:scale-90">
            <Volume2 class="w-8 h-8 text-nebula-primary group-hover:scale-110 transition-transform" />
          </button>
        </div>

        <button v-for="(opt, oIdx) in q.options" :key="oIdx" @click="selectOption(idx, oIdx)"
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

      <div v-else-if="q.type === 'fill' || q.type === 'text'" class="space-y-3">
        <div
          class="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-slate-400 dark:text-white/35">
          <span>{{ q.type === 'fill' ? 'Completa el espacio' : 'Escribe tu respuesta' }}</span>
        </div>
        <div class="flex flex-col sm:flex-row gap-3">
          <input v-model="textAnswers[idx]" type="text" :placeholder="q.placeholder || 'Escribe aquí...'
            " :disabled="results[idx] !== null"
            class="flex-1 px-4 py-3 rounded-xl border bg-white dark:bg-black/40 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white outline-none focus:border-nebula-primary/50 transition-colors" />
          <UiButton label="COMPROBAR" variant="primary" size="sm" :disabled="results[idx] !== null"
            @click="submitTextAnswer(idx)" />
        </div>
        <p v-if="results[idx] !== null" class="text-xs text-slate-500 dark:text-white/50">
          Respuesta esperada: <span class="font-bold text-nebula-cyan">{{ q.acceptedAnswers[0] }}</span>
        </p>
      </div>

      <div v-else-if="q.type === 'speaking'" class="space-y-4">
        <div class="flex flex-col items-center gap-4 py-2 text-center">
          <p class="text-lg font-bold text-slate-800 dark:text-white leading-tight">"{{ q.text }}"</p>

          <div class="flex items-center gap-4 mt-2">
            <button @click="playAudio(q.audioUrl)"
              class="p-2 rounded-full bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-white/40 hover:text-nebula-cyan transition-colors">
              <Volume2 class="w-5 h-5" />
            </button>

            <button @click="toggleRecord(idx)" :disabled="results[idx] === 'perfect'"
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
              <span v-if="isRecording && currentIdx === idx"
                class="text-[9px] text-nebula-cyan animate-pulse font-black uppercase">Escuchando...</span>
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

      <div v-if="results[idx] === 'correct' && q.type !== 'speaking'" class="mt-4 text-xs font-bold text-emerald-500">
        Respuesta correcta.
      </div>
      <div v-else-if="results[idx] === 'incorrect' && q.type !== 'speaking'"
        class="mt-4 text-xs font-bold text-red-500">
        Respuesta incorrecta.
      </div>
      <div v-else-if="results[idx] === 'perfect'" class="mt-4 text-xs font-bold text-emerald-500">
        Pronunciación correcta.
      </div>
      <div v-else-if="results[idx] === 'low'" class="mt-4 text-xs font-bold text-red-500">
        Pronunciación incompleta.
      </div>
    </div>

    <!-- Final Score Card -->
    <div v-if="isFinished" v-motion :initial="{ opacity: 0, scale: 0.9 }" :enter="{ opacity: 1, scale: 1 }"
      class="p-12 bg-gradient-to-br from-nebula-primary/10 to-nebula-cyan/10 rounded-3xl border border-white/10 text-center space-y-6">
      <h3 class="text-4xl font-black text-white uppercase tracking-tighter">Final Quiz Completo</h3>
      <div class="flex items-center justify-center gap-8">
        <div class="text-center">
          <p class="text-[10px] text-white/40 uppercase tracking-widest mb-1">Score</p>
          <p class="text-5xl font-black text-nebula-cyan">{{ Math.round((correctCount / questions.length) * 100) }}%</p>
        </div>
        <div class="w-px h-16 bg-white/10"></div>
        <div class="text-center">
          <p class="text-[10px] text-white/40 uppercase tracking-widest mb-1">Correctas</p>
          <p class="text-5xl font-black text-nebula-primary">{{ correctCount }}/{{ questions.length }}</p>
        </div>
      </div>
      <p class="text-sm text-white/60 italic max-w-sm mx-auto">Evaluación final completada. Tu resultado fue guardado en
        el registro académico.</p>
      <div class="flex flex-col sm:flex-row justify-center gap-4">
        <UiButton v-if="!store.user.fullName" label="COMPLETE ACADEMIC RECORD" variant="primary" size="lg"
          @click="store.status.hasStarted = true; $emit('open-settings')" />
        <UiButton label="RESTART QUIZ" variant="outline" size="lg" @click="resetQuiz" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import confetti from 'canvas-confetti'
import { Mic, Square, Volume2 } from 'lucide-vue-next'
import { useGameStore } from '@/stores/useGameStore'

const store = useGameStore()

const questions = [
  {
    id: 'q1',
    section: 'Multiple Choice',
    type: 'multiple',
    question: 'Choose the correct Present Perfect sentence:',
    options: ['She has gone to school', 'She goes to school', 'She going school'],
    correct: 0
  },
  {
    id: 'q2',
    section: 'Fill in the Blank',
    type: 'fill',
    question: 'Complete: I ____ English every day.',
    acceptedAnswers: ['study'],
    placeholder: 'Type the missing verb'
  },
  {
    id: 'q3',
    section: 'Fill in the Blank',
    type: 'fill',
    question: 'Complete: She has ____ the movie already.',
    acceptedAnswers: ['seen'],
    placeholder: 'Type the missing participle'
  },
  {
    id: 'q4',
    section: 'Written Answer',
    type: 'text',
    question: 'Write the auxiliary verb used with I, You, We and They.',
    acceptedAnswers: ['have'],
    placeholder: 'Write the auxiliary verb'
  },
  {
    id: 'q5',
    section: 'Written Answer',
    type: 'text',
    question: 'Write the past participle of go.',
    acceptedAnswers: ['gone'],
    placeholder: 'Write one word'
  },
  {
    id: 'q6',
    section: 'Multiple Choice',
    type: 'multiple',
    question: 'Select the correct negative form:',
    options: ['They haven\'t finished', 'They hasn\'t finished', 'They don\'t finished'],
    correct: 0
  },
  {
    id: 'q7',
    section: 'Listening',
    type: 'listening',
    question: 'Listen and choose the correct answer.',
    audioUrl: '/audios/listening-1.mp3',
    options: ['Cleaned the kitchen', 'Cooked dinner', 'Slept'],
    correct: 0
  },
  {
    id: 'q8',
    section: 'Listening',
    type: 'listening',
    question: 'Listen and choose the correct answer.',
    audioUrl: '/audios/listening-2.mp3',
    options: ['Her keys', 'Her wallet', 'Her phone'],
    correct: 2
  },
  {
    id: 'q9',
    section: 'Listening',
    type: 'listening',
    question: 'Listen and choose the correct answer.',
    audioUrl: '/audios/listening-3.mp3',
    options: ['Ten years', 'Twenty years', 'Fifty years'],
    correct: 1
  },
  {
    id: 'q10',
    section: 'Speaking',
    type: 'speaking',
    question: 'Speak the sentence exactly as shown.',
    text: 'I have traveled to many countries',
    audioUrl: '/audios/speaking-1.mp3'
  },
  {
    id: 'q11',
    section: 'Speaking',
    type: 'speaking',
    question: 'Speak the sentence exactly as shown.',
    text: 'She has worked in this company for five years',
    audioUrl: '/audios/speaking-2.mp3'
  },
  {
    id: 'q12',
    section: 'Fill in the Blank',
    type: 'fill',
    question: 'Complete: I have lived here ____ 2018.',
    acceptedAnswers: ['since'],
    placeholder: 'since / for'
  },
  {
    id: 'q13',
    section: 'Multiple Choice',
    type: 'multiple',
    question: 'Choose the correct option:',
    options: ['Has she already left?', 'Have she already left?', 'She has already left?'],
    correct: 0
  },
  {
    id: 'q14',
    section: 'Written Answer',
    type: 'text',
    question: 'Write one correct Present Perfect sentence with I and study.',
    acceptedAnswers: ['i have studied', 'i have been studying'],
    placeholder: 'Example: I have studied...'
  },
  {
    id: 'q15',
    section: 'Multiple Choice',
    type: 'multiple',
    question: 'What skill improves with listening activities?',
    options: ['Writing', 'Reading', 'Listening comprehension'],
    correct: 2
  }
]

const userAnswers = ref(new Array(questions.length).fill(null))
const textAnswers = ref(new Array(questions.length).fill(''))
const results = ref(new Array(questions.length).fill(null))
const transcripts = ref(questions.map(() => ''))
const scores = ref(questions.map(() => 0))
const isRecording = ref(false)
const currentIdx = ref(null)
let recognition = null

const completedCount = computed(() => results.value.filter(r => r !== null).length)
const correctCount = computed(() => results.value.filter(r => r === 'correct' || r === 'perfect').length)
const isFinished = computed(() => completedCount.value === questions.length)

const normalize = (value) => value
  .toLowerCase()
  .trim()
  .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
  .replace(/\s+/g, ' ')

const playAudio = (url) => {
  const audio = new Audio(url)
  audio.play()
}

const finishQuestion = () => {
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

const selectOption = (qIdx, oIdx) => {
  if (results.value[qIdx] !== null) return
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

  if (isFinished.value) finishQuestion()
}

const submitTextAnswer = (qIdx) => {
  if (results.value[qIdx] !== null) return
  const answer = normalize(textAnswers.value[qIdx] || '')
  const accepted = questions[qIdx].acceptedAnswers.map(normalize)
  if (accepted.includes(answer)) {
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

  if (isFinished.value) finishQuestion()
}

const startRecognition = (idx) => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  if (!SpeechRecognition) return

  if (recognition) {
    try { recognition.stop() } catch (error) { }
  }

  recognition = new SpeechRecognition()
  recognition.lang = 'en-US'
  recognition.continuous = true
  recognition.interimResults = true

  recognition.onstart = () => {
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
    }
  }

  recognition.onerror = () => {
    isRecording.value = false
  }

  recognition.onend = () => {
    if (isRecording.value) {
      try { recognition.start() } catch (error) { }
      return
    }

    const transcript = transcripts.value[idx]
    if (!transcript) return

    const target = questions[idx].text
    const similarity = calculateSimilarity(transcript, target)
    scores.value[idx] = Math.round(similarity * 100)

    if (similarity >= 0.8) {
      results.value[idx] = 'perfect'
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#f52cf5', '#00f2ff']
      })
    } else {
      results.value[idx] = 'low'
    }

    if (isFinished.value) finishQuestion()
  }

  recognition.start()
}

const calculateSimilarity = (s1, s2) => {
  const clean = (s) => s.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '').replace(/\s+/g, ' ').trim().toLowerCase()
  const n1 = clean(s1)
  const n2 = clean(s2)
  if (n1 === n2) return 1.0
  const longer = n1.length > n2.length ? n1 : n2
  const shorter = n1.length > n2.length ? n2 : n1
  if (longer.length === 0) return 1.0
  return (longer.length - editDistance(longer, shorter)) / parseFloat(longer.length)
}

const editDistance = (s1, s2) => {
  const costs = []
  for (let i = 0; i <= s1.length; i++) {
    let lastValue = i
    for (let j = 0; j <= s2.length; j++) {
      if (i === 0) {
        costs[j] = j
      } else if (j > 0) {
        let newValue = costs[j - 1]
        if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
          newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1
        }
        costs[j - 1] = lastValue
        lastValue = newValue
      }
    }
    if (i > 0) costs[s2.length] = lastValue
  }
  return costs[s2.length]
}

const toggleRecord = (idx) => {
  if (results.value[idx] === 'perfect') return

  if (isRecording.value) {
    isRecording.value = false
    if (recognition) recognition.stop()
    return
  }

  currentIdx.value = idx
  transcripts.value[idx] = ''
  results.value[idx] = null
  scores.value[idx] = 0
  startRecognition(idx)
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

const sectionBadgeClass = (section) => {
  if (section === 'Listening') return 'border-nebula-cyan/40 text-nebula-cyan bg-nebula-cyan/5'
  if (section === 'Speaking') return 'border-nebula-primary/40 text-nebula-primary bg-nebula-primary/5'
  if (section === 'Written Answer') return 'border-emerald-500/40 text-emerald-500 bg-emerald-500/5'
  if (section === 'Fill in the Blank') return 'border-amber-500/40 text-amber-500 bg-amber-500/5'
  return 'border-slate-300 dark:border-white/10 text-slate-500 dark:text-white/40 bg-white/50 dark:bg-white/5'
}

const resetQuiz = () => {
  userAnswers.value = new Array(questions.length).fill(null)
  textAnswers.value = new Array(questions.length).fill('')
  results.value = new Array(questions.length).fill(null)
  transcripts.value = questions.map(() => '')
  scores.value = questions.map(() => 0)
  isRecording.value = false
  currentIdx.value = null
}
</script>
