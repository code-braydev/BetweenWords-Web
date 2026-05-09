<template>
    <section v-motion :initial="{ opacity: 0, y: 40 }" :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 300, ease: 'easeOut' } }" class="mt-8 p-4 sm:p-6 lg:px-8">
        <UiCard>
            <div class="mb-12">
                <div class="space-y-6 max-w-3xl">
                    <div v-for="(q, index) in selectionQuestions" :key="'sel-' + index"
                        class="p-6 bg-slate-50 dark:bg-black/20 rounded-2xl border border-slate-200 dark:border-white/5 shadow-xl transition-all duration-300">
                        <p
                            class="text-[15px] text-slate-900 dark:text-white/90 font-bold mb-5 leading-relaxed transition-colors">
                            <span class="text-slate-400 dark:text-nebula-cyan/40 font-mono mr-2">{{ index + 1 }}.</span>
                            {{ q.text }}
                        </p>
                        <div class="grid grid-cols-1 gap-3">
                            <UiButton v-for="option in q.options" :key="option" @click="checkSelection(index, option)"
                                :variant="getButtonVariant(index, option)" size="md"
                                :class="['text-start justify-start px-5 h-auto py-3.5 transition-all duration-500', getSelectionClass(index, option)]">
                                {{ option }}
                            </UiButton>
                        </div>

                        <transition name="fade">
                            <div v-if="showSelectionFeedback[index]" class="mt-3 p-3 rounded-md text-sm"
                                :class="userAnswers.selection[index] === q.correct ? 'bg-nebula-primary/5 border border-nebula-primary/20 text-nebula-primary' : 'bg-red-500/5 border border-red-400/20 text-red-500 dark:text-red-300'">
                                <p class="m-0">
                                    {{ userAnswers.selection[index] === q.correct ? '✓ Correcto —' : '× No escorrecto —'
                                    }} {{ q.feedback }}</p>
                            </div>
                        </transition>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 gap-4">
                <div v-for="(q, index) in fillQuestions" :key="'fill-' + index"
                    class="p-5 bg-slate-50 dark:bg-black/40 rounded-2xl border flex flex-col gap-4 shadow-lg transition-all"
                    :class="showFillFeedback[index] ? (isCorrect(index) ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5') : 'border-slate-200 dark:border-white/5'">

                    <label class="text-[14px] text-slate-700 dark:text-white/80 font-medium italic transition-colors">
                        <span class="text-slate-300 dark:text-white/20 font-mono font-black not-italic mr-2">{{ index +
                            1 < 10 ? '0' + (index + 1) : index + 1 }}</span>
                                {{ q.pre }} <span
                                    class="text-nebula-cyan/50 font-black border-b border-nebula-cyan/10 px-2 tracking-tighter">______</span>
                                {{ q.post }}
                    </label>

                    <div class="flex items-end gap-3">
                        <UiInput v-model="userAnswers.fill[index]" placeholder="Escribe la respuesta..." class="flex-1"
                            :error="showFillFeedback[index] && !isCorrect(index) ? 'Incorrecto' : undefined"
                            @keyup.enter="validateFill(index)" />
                        <UiButton @click="validateFill(index)"
                            :variant="showFillFeedback[index] ? (isCorrect(index) ? 'success' : 'danger') : 'outline'"
                            size="md" class="mb-1.5 min-w-[120px]"
                            :label="showFillFeedback[index] ? (isCorrect(index) ? 'Correcto' : 'Reintentar') : 'Validar'" />
                    </div>

                    <p v-if="showFillFeedback[index] && !isCorrect(index)"
                        class="text-[11px] text-red-500/70 dark:text-red-300/60 italic px-1 animate-pulse transition-colors">
                        {{ getGrammarHint(q.pre) }}
                    </p>
                    <p v-if="showFillFeedback[index] && isCorrect(index)"
                        class="text-[11px] text-emerald-600 dark:text-emerald-300 italic px-1 transition-colors">✓
                        Respuesta correcta.</p>
                </div>
            </div>
        </UiCard>
    </section>
</template>


<script setup>
import { reactive, ref, onMounted } from 'vue'

const selectionQuestions = [
    { text: "¿Cuál es la función principal del Present Perfect?", options: ["Vínculo entre presente y pasado", "Acción futura planeada", "Hábito en el presente"], correct: "Vínculo entre presente y pasado", feedback: "El Present Perfect conecta acciones pasadas con el presente, mostrando relevancia actual." },
    { text: "¿Qué palabra indica un pasado muy reciente?", options: ["Always", "Just", "Yesterday"], correct: "Just", feedback: "'Just' se usa para acciones que acaban de ocurrir en un pasado inmediato." },
    { text: "Si el tiempo no ha concluido (esta semana), usamos:", options: ["Past Simple", "Present Perfect", "Present Continuous"], correct: "Present Perfect", feedback: "El Present Perfect se utiliza para periodos de tiempo que aún no han terminado, como 'this week'." },
    { text: "¿Qué palabra indica un pasado muy reciente?", options: ["Always", "Just", "Yesterday"], correct: "Just", feedback: "'Just' se usa para acciones que acaban de ocurrir en un pasado inmediato." },
    { text: "Si el tiempo no ha concluido (esta semana), usamos:", options: ["Past Simple", "Present Perfect", "Present Continuous"], correct: "Present Perfect", feedback: "El Present Perfect se utiliza para periodos de tiempo que aún no han terminado, como 'this week'." }
]

const fillQuestions = [
    { pre: "I", post: "in Bristol since 1984. (live)", correct: ["have lived"], feedback: "Para 'I', usamos 'have' + participio pasado del verbo." },
    { pre: "She", post: "in the bank for five years. (work)", correct: ["has worked"], feedback: "Para 'She', usamos 'has' + participio pasado del verbo." },
    { pre: "We", post: "at that restaurant many times. (eat)", correct: ["have eaten"], feedback: "Para 'We', usamos 'have' + participio pasado del verbo." },
    { pre: "I", post: "just. (eat)", correct: ["have eaten"], feedback: "Para acciones recientes, usamos 'have' + participio pasado." },
    { pre: "Someone", post: "my soup! (eat)", correct: ["has eaten"], feedback: "'Someone' se trata como tercera persona singular, por eso usamos 'has'." },
    { pre: "You", post: "the piano since you were a child. (play)", correct: ["have played"], feedback: "Para 'You', usamos 'have' + participio pasado del verbo." },
    { pre: "He", post: "the report already. (finish)", correct: ["has finished"], feedback: "Para 'He', usamos 'has' + participio pasado del verbo." },
    { pre: "It", post: "raining all day. (stop)", correct: ["has stopped"], feedback: "Para 'It', usamos 'has' + participio pasado del verbo." },
    { pre: "They", post: "their homework. (not finish)", correct: ["haven't finished", "have not finished"], feedback: "Para 'They', usamos 'have' + participio pasado, y para la forma negativa agregamos 'not'." }
]

const userAnswers = reactive({ selection: {}, fill: [] })
const showFillFeedback = ref([])
const showSelectionFeedback = ref([])

// Inicializamos los arrays de feedback para que Vue detecte los cambios
onMounted(() => {
    showFillFeedback.value = new Array(fillQuestions.length).fill(false)
    showSelectionFeedback.value = new Array(selectionQuestions.length).fill(false)
})

const checkSelection = (index, option) => {
    userAnswers.selection[index] = option
    showSelectionFeedback.value[index] = true
}

const getButtonVariant = (index, option) => {
    const selected = userAnswers.selection[index]
    const feedback = !!showSelectionFeedback.value[index]
    if (!feedback) return 'subtle'
    if (option === selectionQuestions[index].correct) return 'success'
    if (option === selected && option !== selectionQuestions[index].correct) return 'danger'
    return 'subtle'
}

const getSelectionClass = (index, option) => {
    const selected = userAnswers.selection[index]
    const feedback = !!showSelectionFeedback.value[index]
    const correct = selectionQuestions[index].correct
    const base = 'border transition-all duration-200 text-start'
    if (!feedback) return `${base} border-white/5 bg-white/5 text-white/50 hover:bg-white/10`

    if (option === correct) return `${base} bg-emerald-500/10 border-emerald-400/30 text-emerald-300`
    if (option === selected && option !== correct) return `${base} bg-red-500/10 border-red-400/30 text-red-300`
    return `${base} opacity-50`
}

const validateFill = (index) => {
    if (userAnswers.fill[index]) {
        showFillFeedback.value[index] = true
    }
}

const isCorrect = (index) => {
    const answer = userAnswers.fill[index]?.trim().toLowerCase()
    return fillQuestions[index].correct.some(c => c.toLowerCase() === answer)
}

const getGrammarHint = (subject) => {
    const sub = subject.toLowerCase().trim()
    if (['he', 'she', 'it', 'someone'].includes(sub)) {
        return "💡 Tip: Para He, She, It, usamos 'Has'."
    }
    return "💡 Tip: Para I, You, We, They, usamos 'Have'."
}
</script>