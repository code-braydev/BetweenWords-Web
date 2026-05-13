<template>
    <div class="space-y-8">
        <!-- Stats header -->
        <div
            class="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-slate-50 dark:bg-black/20 rounded-2xl border border-slate-200 dark:border-white/5">
            <div>
                <p class="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 dark:text-white/40 mb-1">
                    Total</p>
                <p class="text-2xl font-black text-slate-900 dark:text-white">15 preguntas</p>
            </div>
            <div>
                <p class="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 dark:text-white/40 mb-1">
                    Respondidas</p>
                <p class="text-2xl font-black text-nebula-cyan">{{ answeredCount }}/15</p>
            </div>
            <div>
                <p class="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 dark:text-white/40 mb-1">
                    Estado</p>
                <p class="text-2xl font-black text-nebula-primary">{{ submitted ? "Enviado" : "En proceso" }}</p>
            </div>
        </div>

        <!-- Questions loop -->
        <div v-for="(q, idx) in questions" :key="q.id"
            class="p-6 bg-slate-50 dark:bg-black/20 rounded-2xl border border-slate-200 dark:border-white/5 shadow-sm transition-all"
            :class="{ 'border-emerald-500/50 bg-emerald-500/5': submitted && isCorrect(idx) }">
            <!-- Question header -->
            <div class="flex items-center justify-between gap-3 mb-4">
                <div class="flex items-center gap-3 flex-wrap">
                    <span class="text-[10px] font-black text-nebula-secondary uppercase tracking-widest">
                        Pregunta {{ idx + 1 }} / {{ questions.length }}
                    </span>
                    <span class="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full border"
                        :class="sectionBadgeClass(q.section)">
                        {{ q.section }}
                    </span>
                </div>
                <div v-if="submitted" class="flex items-center gap-2">
                    <span v-if="isCorrect(idx)" class="text-xs text-emerald-500 font-bold">✅ Correcto</span>
                    <span v-else class="text-xs text-red-500 font-bold">❌ Incorrecto</span>
                </div>
            </div>

            <p class="text-sm font-bold text-slate-800 dark:text-white mb-4 leading-tight">
                {{ q.question }}
            </p>

            <!-- ✅ MULTIPLE -->
            <div v-if="q.type === 'multiple'" class="grid grid-cols-1 gap-3">
                <button v-for="(opt, oIdx) in q.options" :key="oIdx" @click="selectOption(idx, oIdx)"
                    :disabled="submitted"
                    class="p-4 rounded-xl border transition-all text-sm font-medium text-left flex items-center gap-4 group"
                    :class="getOptionClass(idx, oIdx)">
                    <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors"
                        :class="getBadgeClass(idx, oIdx)">
                        <span class="text-[10px]">{{ String.fromCharCode(65 + oIdx) }}</span>
                    </div>
                    {{ opt }}
                </button>
            </div>

            <!-- ✅ WRITING -->
            <div v-else-if="q.type === 'writing'" class="space-y-3">
                <div
                    class="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-slate-400 dark:text-white/35">
                    <span>Escribe la oración completa</span>
                </div>
                <input v-model="textAnswers[idx]" type="text" :placeholder="q.placeholder || 'Escribe aquí...'"
                    :disabled="submitted"
                    class="w-full px-4 py-3 rounded-xl border bg-white dark:bg-black/40 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white outline-none focus:border-nebula-primary/50 transition-colors" />
                <p v-if="submitted" class="text-xs text-slate-500 dark:text-white/50">
                    Respuesta esperada:
                    <span class="font-bold text-nebula-cyan">{{ q.acceptedAnswers?.[0] ?? '—' }}</span>
                </p>
            </div>

            <!-- ✅ ORAL -->
            <div v-else class="space-y-4">
                <div class="flex flex-col items-center gap-4 py-2 text-center">
                    <button @click="playAudio(q.audioUrl!)"
                        class="w-16 h-16 rounded-full bg-nebula-primary/10 border border-nebula-primary/30 flex items-center justify-center hover:bg-nebula-primary/20 transition-all group active:scale-90">
                        <Volume2 class="w-8 h-8 text-nebula-primary group-hover:scale-110 transition-transform" />
                    </button>

                    <div class="max-w-2xl space-y-1">
                        <p class="text-[10px] uppercase tracking-[0.25em] font-black text-slate-400 dark:text-white/35">
                            {{ q.mode === "repeat" ? "Repite la oración" : "Responde en voz alta" }}
                        </p>
                        <p class="text-lg font-bold text-slate-800 dark:text-white leading-tight">
                            {{ q.mode === "repeat" ? q.targetText : q.prompt }}
                        </p>
                    </div>

                    <button @click="toggleRecord(idx)" :disabled="submitted"
                        class="w-16 h-16 rounded-full flex items-center justify-center transition-all relative"
                        :class="isRecording && currentIdx === idx
                            ? 'bg-red-500 scale-110 shadow-[0_0_20px_rgba(239,68,68,0.5)]'
                            : 'bg-nebula-primary text-white shadow-lg shadow-nebula-primary/20 hover:scale-105 active:scale-95 disabled:opacity-30'">
                        <Mic v-if="!(isRecording && currentIdx === idx)" class="w-8 h-8" />
                        <Square v-else class="w-6 h-6 animate-pulse" />
                        <div v-if="isRecording && currentIdx === idx"
                            class="absolute -inset-2 border-2 border-red-500 rounded-full animate-ping opacity-20" />
                    </button>

                    <div v-if="transcripts[idx] || (isRecording && currentIdx === idx)"
                        class="mt-4 p-3 bg-white/50 dark:bg-black/20 rounded-lg border border-slate-200 dark:border-white/5 w-full max-w-sm">
                        <div class="flex justify-between items-center mb-1">
                            <p class="text-[10px] text-slate-400 uppercase tracking-widest">Tu pronunciación:</p>
                            <span v-if="isRecording && currentIdx === idx"
                                class="text-[9px] text-nebula-cyan animate-pulse font-black uppercase">Escuchando...</span>
                        </div>
                        <p class="text-sm font-mono italic">"{{ transcripts[idx] }}"</p>
                        <div v-if="submitted"
                            class="mt-2 h-1.5 w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden">
                            <div class="h-full bg-nebula-primary transition-all duration-1000"
                                :style="{ width: `${scores[idx]}%` }" />
                        </div>
                        <p v-if="submitted" class="text-[10px] mt-1 text-right font-bold text-nebula-primary">
                            {{ scores[idx] }}% Similitud
                        </p>
                    </div>
                </div>
            </div>

            <!-- Feedback de resultado -->
            <template v-if="submitted">
                <div v-if="q.type !== 'oral' && isCorrect(idx)" class="mt-4 text-xs font-bold text-emerald-500">
                    Respuesta correcta.</div>
                <div v-else-if="q.type !== 'oral' && !isCorrect(idx)" class="mt-4 text-xs font-bold text-red-500">
                    Respuesta incorrecta.</div>
                <div v-else-if="q.type === 'oral' && isCorrect(idx)" class="mt-4 text-xs font-bold text-emerald-500">
                    Pronunciación correcta.</div>
                <div v-else-if="q.type === 'oral' && !isCorrect(idx)" class="mt-4 text-xs font-bold text-red-500">
                    Pronunciación incompleta.</div>
            </template>
        </div>

        <!-- Submit -->
        <div v-if="!submitted" class="flex justify-center pt-4">
            <UiButton label="ENVIAR EXAMEN" variant="primary" size="lg" @click="submitExam" />
        </div>

        <!-- Results -->
        <div v-else class="space-y-6">
            <div
                class="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-slate-50 dark:bg-black/20 rounded-2xl border border-slate-200 dark:border-white/5">
                <div>
                    <p class="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 dark:text-white/40 mb-1">
                        Resultado</p>
                    <p class="text-2xl font-black text-slate-900 dark:text-white">
                        {{ finalGrade !== null ? finalGrade.toFixed(1) + " / 5.0" : Math.round((correctCount /
                            questions.length)
                            * 100) + "%" }}
                    </p>
                </div>
                <div>
                    <p class="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 dark:text-white/40 mb-1">
                        Correctas</p>
                    <p class="text-2xl font-black text-nebula-cyan">{{ correctCount }}/15</p>
                </div>
                <div>
                    <p class="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 dark:text-white/40 mb-1">
                        Revisión
                    </p>
                    <p class="text-2xl font-black text-nebula-primary">{{ viewModeLabel }}</p>
                </div>
            </div>

            <div class="flex flex-col sm:flex-row justify-center gap-4">
                <UiButton label="REVISAR EXAMEN" variant="outline" size="lg" @click="viewMode = 'review'" />
                <UiButton label="VER NOTA" variant="primary" size="lg" @click="viewMode = 'grade'" />
                <UiButton label="REINTENTAR" variant="ghost" size="lg" @click="resetQuiz" />
            </div>

            <div v-if="viewMode === 'review'" class="space-y-4">
                <div class="p-6 rounded-2xl border border-slate-200 dark:border-white/10 bg-white/60 dark:bg-white/5">
                    <p class="text-sm font-bold text-slate-700 dark:text-white/80">
                        Revisión del examen: ahora puedes ver cuáles respuestas fueron correctas y cuáles necesitan
                        repaso.
                    </p>
                </div>
            </div>

            <div v-else-if="viewMode === 'grade'" v-motion :initial="{ opacity: 0, scale: 0.96 }"
                :enter="{ opacity: 1, scale: 1 }"
                class="p-12 bg-gradient-to-br from-nebula-primary/10 to-nebula-cyan/10 rounded-3xl border border-white/10 text-center space-y-6">
                <h3 class="text-4xl font-black text-white uppercase tracking-tighter">Nota Final</h3>
                <div class="flex items-center justify-center gap-8">
                    <div class="text-center">
                        <p class="text-[10px] text-white/40 uppercase tracking-widest mb-1">Score</p>
                        <p class="text-5xl font-black text-nebula-cyan">
                            {{ finalGrade !== null ? finalGrade.toFixed(1) + " / 5.0" : Math.round((correctCount /
                                questions.length) * 100) + "%" }}
                        </p>
                    </div>
                    <div class="w-px h-16 bg-white/10" />
                    <div class="text-center">
                        <p class="text-[10px] text-white/40 uppercase tracking-widest mb-1">Correctas</p>
                        <p class="text-5xl font-black text-nebula-primary">{{ correctCount }}/{{ questions.length }}</p>
                    </div>
                </div>
                <p class="text-sm text-white/60 italic max-w-sm mx-auto">
                    Tu calificación ya fue registrada en el sistema académico.
                </p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { Mic, Square, Volume2 } from "lucide-vue-next";
const confetti = require('canvas-confetti') as (opts?: confetti.Options) => Promise<null>

// ✅ Tipos definidos
type QuestionType = "multiple" | "writing" | "oral";
type QuestionMode = "mc" | "repeat" | "answer";

interface Question {
    id: string;
    section: string;
    type: QuestionType;
    mode?: QuestionMode;
    question: string;
    options?: string[];
    correct?: number;
    acceptedAnswers?: string[];
    placeholder?: string;
    audioUrl?: string;
    targetText?: string;
    prompt?: string;
    similarityThreshold?: number;
}

const store = useGameStore();

const questions: Question[] = [
    {
        id: "q1",
        section: "Selección múltiple",
        type: "multiple",
        question: "Choose the correct Present Perfect sentence:",
        options: [
            "She has gone to school",
            "She goes to school",
            "She going school",
        ],
        correct: 0,
    },
    {
        id: "q2",
        section: "Selección múltiple",
        type: "multiple",
        question: "What is the auxiliary verb used for I, You, We and They?",
        options: ["Has", "Have", "Is"],
        correct: 1,
    },
    {
        id: "q3",
        section: "Selección múltiple",
        type: "multiple",
        question: "Which sentence uses Present Perfect correctly?",
        options: [
            "I have studied English every day.",
            "I studied English every day.",
            "I am studied English every day.",
        ],
        correct: 0,
    },
    {
        id: "q4",
        section: "Selección múltiple",
        type: "multiple",
        question: "Select the correct negative form:",
        options: [
            "They haven't finished",
            "They hasn't finished",
            "They don't finished",
        ],
        correct: 0,
    },
    {
        id: "q5",
        section: "Selección múltiple",
        type: "multiple",
        question: "Choose the correct question form:",
        options: [
            "Have you ever been to London?",
            "Has you ever been to London?",
            "Do you been to London?",
        ],
        correct: 0,
    },
    {
        id: "q6",
        section: "Selección múltiple",
        type: "multiple",
        question: "The past participle of write is:",
        options: ["Wrote", "Writing", "Written"],
        correct: 2,
    },
    {
        id: "q7",
        section: "Escritura",
        type: "writing",
        question:
            "Write the sentence in Present Perfect: She / finish / her homework.",
        acceptedAnswers: ["she has finished her homework"],
        placeholder: "She has finished her homework",
    },
    {
        id: "q8",
        section: "Escritura",
        type: "writing",
        question: "Write the negative form: They / go / to school.",
        acceptedAnswers: [
            "they haven't gone to school",
            "they have not gone to school",
        ],
        placeholder: "They haven't gone to school",
    },
    {
        id: "q9",
        section: "Escritura",
        type: "writing",
        question: "Write the question form: you / ever / visit / Paris?",
        acceptedAnswers: [
            "have you ever visited paris",
            "have you ever been to paris",
        ],
        placeholder: "Have you ever visited Paris?",
    },
    {
        id: "q10",
        section: "Escritura",
        type: "writing",
        question: "Write one Present Perfect sentence using already.",
        acceptedAnswers: [
            "i have already seen that movie",
            "she has already left",
            "we have already finished",
        ],
        placeholder: "I have already seen that movie",
    },
    {
        id: "q11",
        section: "Listening",
        type: "oral",
        mode: "mc",
        question: "Listen and choose the correct answer.",
        audioUrl: "/audios/listening-1.mp3",
        options: ["Cleaned the kitchen", "Cooked dinner", "Slept", "Watched TV"],
        correct: 0,
    },
    {
        id: "q12",
        section: "Listening",
        type: "oral",
        mode: "repeat",
        question: "Repeat the sentence exactly as you hear it.",
        audioUrl: "/audios/speaking-1.mp3",
        targetText: "I have traveled to many countries",
        acceptedAnswers: ["I have traveled to many countries"],
        similarityThreshold: 0.8,
    },
    {
        id: "q13",
        section: "Listening",
        type: "oral",
        mode: "repeat",
        question: "Repeat the sentence exactly as you hear it.",
        audioUrl: "/audios/speaking-2.mp3",
        targetText: "She has worked in this company for five years",
        acceptedAnswers: ["She has worked in this company for five years"],
        similarityThreshold: 0.8,
    },
    {
        id: "q14",
        section: "Speaking",
        type: "oral",
        mode: "answer",
        question: "Respond to the question using Present Perfect.",
        audioUrl: "/audios/listening-2.mp3",
        prompt: "What did she lose?",
        acceptedAnswers: ["her phone", "phone"],
        similarityThreshold: 0.65,
    },
    {
        id: "q15",
        section: "Speaking",
        type: "oral",
        mode: "answer",
        question: "Respond to the question using Present Perfect.",
        audioUrl: "/audios/listening-3.mp3",
        prompt: "How long have they been married?",
        acceptedAnswers: ["twenty years"],
        similarityThreshold: 0.65,
    },
];

const userAnswers = ref<(number | null)[]>(
    new Array(questions.length).fill(null),
);
const textAnswers = ref<string[]>(new Array(questions.length).fill(""));
const results = ref<(string | null)[]>(new Array(questions.length).fill(null));
const scores = ref<number[]>(questions.map(() => 0));
const { transcripts, isRecording, currentIdx, toggleRecord } = useMicrophone(
    questions.length,
);
const submitted = ref(false);
const viewMode = ref<"review" | "grade">("review");
const finalGrade = ref<number | null>(null);

// ── Computed ─────────────────────────────────────────────────────────────────

const answeredCount = computed(
    () =>
        userAnswers.value.filter((v) => v !== null).length +
        textAnswers.value.filter((v) => v.trim().length > 0).length +
        transcripts.value.filter((v) => v.trim().length > 0).length,
);

const correctCount = computed(
    () => results.value.filter((r) => r === "correct" || r === "perfect").length,
);

const viewModeLabel = computed(() => {
    if (viewMode.value === "review") return "Revisar examen";
    if (viewMode.value === "grade") return "Ver nota";
    return "Pendiente";
});

// ── Helpers ───────────────────────────────────────────────────────────────────

const normalize = (value: string): string =>
    value
        .toLowerCase()
        .trim()
        .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
        .replace(/\s+/g, " ");

// ✅ Instalación: npm i --save-dev @types/canvas-confetti
const playAudio = (url: string) => new Audio(url).play();

// ── Lógica de corrección ──────────────────────────────────────────────────────

const editDistance = (s1: string, s2: string): number => {
    const costs: number[] = [];
    for (let i = 0; i <= s1.length; i++) {
        let lastValue = i;
        for (let j = 0; j <= s2.length; j++) {
            if (i === 0) {
                costs[j] = j;
            } else if (j > 0) {
                let newValue = costs[j - 1]!;
                if (s1.charAt(i - 1) !== s2.charAt(j - 1)) {
                    newValue = Math.min(newValue, lastValue, costs[j]!) + 1;
                }
                costs[j - 1] = lastValue;
                lastValue = newValue;
            }
        }
        if (i > 0) costs[s2.length] = lastValue;
    }
    return costs[s2.length] ?? 0;
};

const calculateSimilarity = (s1: string, s2: string): number => {
    const clean = (v: string) =>
        v
            .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
            .replace(/\s+/g, " ")
            .trim()
            .toLowerCase();
    const n1 = clean(s1);
    const n2 = clean(s2);
    if (n1 === n2) return 1.0;
    const longer = n1.length > n2.length ? n1 : n2;
    const shorter = n1.length > n2.length ? n2 : n1;
    if (longer.length === 0) return 1.0;
    return (longer.length - editDistance(longer, shorter)) / longer.length;
};

const isMultipleCorrect = (idx: number): boolean =>
    userAnswers.value[idx] === questions[idx]?.correct;

const isWritingCorrect = (idx: number): boolean => {
    const answer = normalize(textAnswers.value[idx] ?? "");
    const accepted = (questions[idx]?.acceptedAnswers ?? []).map(normalize);
    return accepted.includes(answer);
};

const isOralCorrect = (idx: number): boolean => {
    const transcript = transcripts.value[idx];
    if (!transcript) return false;
    const q = questions[idx]!;
    const accepted = q.acceptedAnswers ?? [q.targetText ?? ""];
    const similarity = Math.max(
        ...accepted.map((t) => calculateSimilarity(transcript, t)),
    );
    return similarity >= (q.similarityThreshold ?? 0.8);
};

const isCorrect = (idx: number): boolean => {
    if (!submitted.value) return false;
    const q = questions[idx]!;
    if (q.type === "multiple") return isMultipleCorrect(idx);
    if (q.type === "writing") return isWritingCorrect(idx);
    return isOralCorrect(idx);
};

// ── Acciones ──────────────────────────────────────────────────────────────────

const submitExam = () => {
    for (let idx = 0; idx < questions.length; idx++) {
        const q = questions[idx]!;
        if (q.type === "multiple") {
            results.value[idx] = isMultipleCorrect(idx) ? "correct" : "incorrect";
        } else if (q.type === "writing") {
            results.value[idx] = isWritingCorrect(idx) ? "correct" : "incorrect";
        } else {
            const transcript = transcripts.value[idx];
            if (transcript) {
                const accepted = q.acceptedAnswers ?? [q.targetText ?? ""];
                const similarity = Math.max(
                    ...accepted.map((t) => calculateSimilarity(transcript, t)),
                );
                scores.value[idx] = Math.round(similarity * 100);
            }
            results.value[idx] = isOralCorrect(idx) ? "perfect" : "low";
        }
    }

    submitted.value = true;
    viewMode.value = "review";

    const finalScore = Math.round((correctCount.value / questions.length) * 100);
    const scaled = parseFloat((1 + (finalScore / 100) * 4).toFixed(1));
    store.setScore(scaled);
    finalGrade.value = scaled;

    if (finalScore >= 80) {
        confetti({ particleCount: 200, spread: 120, origin: { y: 0.5 } });
    }
};

const selectOption = (qIdx: number, oIdx: number) => {
    if (submitted.value) return;
    userAnswers.value[qIdx] = oIdx;
};

const getOptionClass = (qIdx: number, oIdx: number): string => {
    const q = questions[qIdx]!;
    if (!submitted.value) {
        return userAnswers.value[qIdx] === oIdx
            ? "bg-nebula-primary text-white border-nebula-primary/60"
            : "bg-white dark:bg-black/40 text-slate-600 dark:text-white/60 border-slate-200 dark:border-white/10 hover:border-nebula-primary/30 group-hover:bg-slate-50";
    }
    if (oIdx === q.correct) return "bg-emerald-500 border-emerald-400 text-white";
    if (userAnswers.value[qIdx] === oIdx)
        return "bg-red-500 border-red-400 text-white";
    return "bg-white dark:bg-black/40 text-slate-400 dark:text-white/20 border-slate-100 dark:border-white/5 opacity-50";
};

const getBadgeClass = (qIdx: number, oIdx: number): string => {
    if (!submitted.value) {
        return userAnswers.value[qIdx] === oIdx
            ? "border-white/30 text-white"
            : "border-slate-200 dark:border-white/10 text-slate-400 dark:text-white/30 group-hover:border-nebula-primary group-hover:text-nebula-primary";
    }
    return "border-white/30 text-white";
};

const sectionBadgeClass = (section: string): string => {
    if (section === "Listening")
        return "border-nebula-cyan/40 text-nebula-cyan bg-nebula-cyan/5";
    if (section === "Escritura")
        return "border-emerald-500/40 text-emerald-500 bg-emerald-500/5";
    if (section === "Selección múltiple")
        return "border-slate-300 dark:border-white/10 text-slate-500 dark:text-white/40 bg-white/50 dark:bg-white/5";
    if (section === "Speaking")
        return "border-nebula-primary/40 text-nebula-primary bg-nebula-primary/5";
    return "border-slate-300 dark:border-white/10 text-slate-500 dark:text-white/40 bg-white/50 dark:bg-white/5";
};

const resetQuiz = () => {
    userAnswers.value = new Array(questions.length).fill(null)
    textAnswers.value = new Array(questions.length).fill('')
    results.value = new Array(questions.length).fill(null)
    transcripts.value = questions.map(() => '')
    scores.value = questions.map(() => 0)
    isRecording.value = false
    currentIdx.value = null
    submitted.value = false
    viewMode.value = 'review'
    finalGrade.value = null
}
</script>
