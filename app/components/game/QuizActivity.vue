<template>
    <div class="space-y-8">
        <!-- Stats header -->
        <div
            class="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 bg-slate-50 dark:bg-black/20 rounded-2xl border border-slate-200 dark:border-white/5">
            <div>
                <p class="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 dark:text-white/40 mb-1">
                    Total</p>
                <p class="text-2xl font-black text-slate-900 dark:text-white">{{ TOTAL_QUESTIONS }} preguntas</p>
            </div>
            <div>
                <p class="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 dark:text-white/40 mb-1">
                    Respondidas</p>
                <p class="text-2xl font-black text-nebula-cyan">{{ answeredCount }}/{{ TOTAL_QUESTIONS }}</p>
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
            :class="{ 'border-emerald-500/50 bg-emerald-500/5': submitted && isCorrect(idx), 'border-red-500/50 bg-red-500/5': submitted && !isCorrect(idx) }">
            <!-- Question header -->
            <div class="flex items-center justify-between gap-3 mb-4">
                <div class="flex items-center gap-3 flex-wrap">
                    <span class="text-[10px] font-black text-nebula-secondary uppercase tracking-widest">
                        Pregunta {{ idx + 1 }} / {{ questions.length }}
                    </span>
                    <span v-if="q.section"
                        class="text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full border"
                        :class="sectionBadgeClass(q.section)">
                        {{ q.section }}
                    </span>
                </div>
                <div v-if="submitted" class="flex items-center gap-2">
                    <span v-if="isCorrect(idx)" class="text-xs text-emerald-500 font-bold">✅ ¡Correcto!</span>
                    <span v-else class="text-xs text-red-500 font-bold">❌ Incorrecto</span>
                </div>
            </div>

            <p class="text-sm font-bold text-slate-800 dark:text-white mb-4 leading-tight">
                {{ q.question }}
            </p>

            <!-- Audio player for Listening (applies to both types) -->
            <div v-if="q.audioUrl" class="flex flex-col items-center gap-3 py-2 mb-4">
                <button @click="playAudio(q.audioUrl)"
                    class="w-16 h-16 rounded-full bg-nebula-primary/10 border border-nebula-primary/30 flex items-center justify-center hover:bg-nebula-primary/20 transition-all group active:scale-90">
                    <Volume2 class="w-8 h-8 text-nebula-primary group-hover:scale-110 transition-transform" />
                </button>
                <span class="text-[10px] uppercase tracking-[0.2em] font-black text-nebula-primary/60">
                    Reproducir Audio
                </span>
            </div>

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

            <!-- ✅ WRITING / LISTENING -->
            <div v-else-if="q.type === 'writing'" class="space-y-4">
                <div
                    class="flex items-center gap-2 text-[10px] uppercase tracking-widest font-black text-slate-400 dark:text-white/35">
                    <span>{{ q.audioUrl ? 'Escucha y escribe la respuesta' : 'Escribe la oración completa' }}</span>
                </div>
                <UiInput v-model="textAnswers[idx]" type="text" :placeholder="q.placeholder || 'Escribe aquí...'"
                    :disabled="submitted" />
                <p v-if="submitted" class="text-xs mt-2 text-slate-500 dark:text-white/50">
                    Respuesta esperada:
                    <span class="font-bold text-nebula-cyan">{{ q.acceptedAnswers?.[0] ?? '—' }}</span>
                </p>
            </div>
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
                        {{ finalGrade !== null ? finalGrade.toFixed(1) + " / 5.0" : "0.0 / 5.0" }}
                    </p>
                </div>
                <div>
                    <p class="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 dark:text-white/40 mb-1">
                        Correctas</p>
                    <p class="text-2xl font-black text-nebula-cyan">{{ correctCount }}/{{ TOTAL_QUESTIONS }}</p>
                </div>
                <div>
                    <p class="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400 dark:text-white/40 mb-1">
                        Revisión</p>
                    <p class="text-2xl font-black text-nebula-primary">{{ viewModeLabel }}</p>
                </div>
            </div>

            <div class="flex flex-col sm:flex-row justify-center gap-4">
                <UiButton label="VER NOTA EN EXCEL" variant="primary" size="lg" @click="openExam" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from "vue";
import { questions, TOTAL_QUESTIONS } from "~/constant/answer";
import { Volume2 } from "lucide-vue-next";
import * as confetti from 'canvas-confetti';

const store = useGameStore()
const route = useRoute()

const openExam = () => {
    store.openApp('excel')
}


const userAnswers = ref<(number | null)[]>(new Array(TOTAL_QUESTIONS).fill(null));
const textAnswers = ref<string[]>(new Array(TOTAL_QUESTIONS).fill(""));
const results = ref<(string | null)[]>(new Array(TOTAL_QUESTIONS).fill(null));

const submitted = ref(false);
const viewMode = ref<"review" | "grade">("review");
const finalGrade = ref<number | null>(null);

let winAudio: HTMLAudioElement | null = null;

onMounted(() => {
    winAudio = new Audio('/audio/win.mp3');
});

onUnmounted(() => {
    if (winAudio) {
        winAudio.pause();
        winAudio.src = '';
        winAudio = null;
    }
});

// ── Computed ─────────────────────────────────────────────────────────────────

const answeredCount = computed(
    () =>
        userAnswers.value.filter((v) => v !== null).length +
        textAnswers.value.filter((v) => v.trim().length > 0).length
);

const correctCount = computed(
    () => results.value.filter((r) => r === "correct").length
);

const viewModeLabel = computed(() => {
    if (viewMode.value === "review") return "Revisar examen";
    if (viewMode.value === "grade") return "Ver nota";
    return "Pendiente";
});

const playAudio = (url: string) => new Audio(url).play();

// ── Lógica de corrección ──────────────────────────────────────────────────────

const isMultipleCorrect = (idx: number): boolean =>
    userAnswers.value[idx] === questions[idx]?.correct;

const isWritingCorrect = (idx: number): boolean => {
    const answer = (textAnswers.value[idx] ?? "").toLowerCase().trim();
    const accepted = (questions[idx]?.acceptedAnswers ?? []).map((a) => a.toLowerCase().trim());
    return accepted.includes(answer);
};

const isCorrect = (idx: number): boolean => {
    const q = questions[idx];
    if (!q) return false;
    if (q.type === "multiple") return isMultipleCorrect(idx);
    if (q.type === "writing") return isWritingCorrect(idx);
    return false;
};

// ── Acciones ──────────────────────────────────────────────────────────────────

const submitExam = async () => {
    let correctCountLocal = 0;
    for (let idx = 0; idx < questions.length; idx++) {
        const correct = isCorrect(idx);
        results.value[idx] = correct ? "correct" : "incorrect";
        if (correct) correctCountLocal++;
    }

    submitted.value = true;
    viewMode.value = "review";

    // "Asegúrate de que el puntaje final se calcule sobre el total de preguntas (15) para que el máximo sea 5.0."
    const scaled = parseFloat(((correctCountLocal / TOTAL_QUESTIONS) * 5.0).toFixed(1));

    store.setScore(scaled);
    store.academic.isExamCompleted = true;
    finalGrade.value = scaled;

    // ── Validación preventiva: obtener sessionId desde query params ─────────
    const sessionId = (route.query.session as string)?.trim();
    const sheetUrl = store.session.sheetUrl?.trim();
    const fullName = store.user.fullName?.trim();

    if (!sessionId || !sheetUrl || !fullName) {
        console.warn(
            "[QuizActivity] ⚠️ Envío de calificación omitido: " +
            (!sessionId ? "sin sesión activa" : !sheetUrl ? "sin URL de sheet" : "sin nombre de usuario")
        );
        return;
    }

    // ── Envío a Google Sheets ──────────────────────────────────────────────
    try {
        const submitUrl = `/api/sessions/${sessionId}/submit`;
        await $fetch(submitUrl, {
            method: "POST",
            body: {
                sheetUrl,
                name: fullName,
                score: scaled,
            },
        });
        console.info(`[QuizActivity] ✅ Grade sent to Sheets: ${scaled}/5.0`);
    } catch (submitError: any) {
        const msg = submitError?.data?.statusMessage ?? submitError?.message ?? String(submitError);
        console.error(`[QuizActivity] ❌ Google Sheets submit failed: ${msg}`, submitError);
    }

    if (scaled >= 4.0) {
        if (winAudio) {
            winAudio.currentTime = 0;
            winAudio.play().catch(e => console.error(e));
        }
        confetti.default({ particleCount: 200, spread: 120, origin: { y: 0.5 } });
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

const sectionBadgeClass = (section?: string): string => {
    if (!section) return "border-slate-300 dark:border-white/10 text-slate-500 dark:text-white/40 bg-white/50 dark:bg-white/5";
    if (section.includes("Listening"))
        return "border-nebula-cyan/40 text-nebula-cyan bg-nebula-cyan/5";
    if (section.includes("Building"))
        return "border-emerald-500/40 text-emerald-500 bg-emerald-500/5";
    if (section.includes("Selection"))
        return "border-slate-300 dark:border-white/10 text-slate-500 dark:text-white/40 bg-white/50 dark:bg-white/5";
    return "border-slate-300 dark:border-white/10 text-slate-500 dark:text-white/40 bg-white/50 dark:bg-white/5";
};

const resetQuiz = () => {
    userAnswers.value = new Array(questions.length).fill(null);
    textAnswers.value = new Array(questions.length).fill('');
    results.value = new Array(questions.length).fill(null);
    submitted.value = false;
    viewMode.value = 'review';
    finalGrade.value = null;
};
</script>
