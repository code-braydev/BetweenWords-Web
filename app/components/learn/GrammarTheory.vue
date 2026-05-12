<template>
    <div v-motion :initial="{ opacity: 0, y: 40 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 100, ease: 'easeOut' } }"
        class="space-y-8 p-4 sm:p-6 lg:p-8">
        <section id="formula" class="scroll-mt-24">
            <UiCard>
                <template #header>
                    <div class="flex items-center gap-3">
                        <div class="w-3 h-3 rounded-full bg-nebula-cyan shadow-[0_0_10px_rgba(0,242,255,0.4)]"></div>
                        <h2
                            class="text-base sm:text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider transition-colors">
                            Fórmula
                        </h2>
                    </div>
                </template>

                <div
                    class="p-6 bg-slate-50 dark:bg-black/40 rounded-2xl border border-slate-200 dark:border-white/5 transition-colors">
                    <p
                        class="text-sm font-bold text-slate-600 dark:text-white/70 mb-6 text-center uppercase tracking-widest transition-colors">
                        Formula base del Present Perfect
                    </p>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div class="p-4 bg-nebula-primary/5 rounded-xl border border-nebula-primary/20 text-center">
                            <p class="text-[10px] font-black text-nebula-primary uppercase tracking-widest mb-2">
                                Afirmativa</p>
                            <p class="text-sm sm:text-base font-bold text-slate-800 dark:text-white font-mono">Subject +
                                have/has + P.P.
                            </p>
                            <p class="mt-3 text-[11px] text-slate-500 dark:text-white/50 italic">I have finished my
                                work.</p>
                        </div>
                        <div class="p-4 bg-nebula-cyan/5 rounded-xl border border-nebula-cyan/20 text-center">
                            <p class="text-[10px] font-black text-nebula-cyan uppercase tracking-widest mb-2">Negativa
                            </p>
                            <p class="text-sm sm:text-base font-bold text-slate-800 dark:text-white font-mono">Subject +
                                have not/has
                                not + P.P.</p>
                            <p class="mt-3 text-[11px] text-slate-500 dark:text-white/50 italic">She has not seen the
                                movie.</p>
                        </div>
                        <div
                            class="p-4 bg-white dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/10 text-center transition-colors">
                            <p
                                class="text-[10px] font-black text-slate-500 dark:text-white/50 uppercase tracking-widest mb-2">
                                Interrogativa</p>
                            <p class="text-sm sm:text-base font-bold text-slate-800 dark:text-white font-mono">Have/Has
                                + Subject +
                                P.P.?</p>
                            <p class="mt-3 text-[11px] text-slate-500 dark:text-white/50 italic">Have you ever been to
                                London?</p>
                        </div>
                    </div>
                </div>
            </UiCard>
        </section>

        <section id="usage" class="scroll-mt-24">
            <UiCard>
                <template #header>
                    <div class="flex items-center gap-3">
                        <div class="w-3 h-3 rounded-full bg-nebula-primary shadow-[0_0_10px_rgba(245,44,245,0.35)]">
                        </div>
                        <h2
                            class="text-base sm:text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider transition-colors">
                            Uso
                        </h2>
                    </div>
                </template>

                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div v-for="(use, i) in usage" :key="use.title"
                        class="p-4 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5 flex gap-3 transition-colors">
                        <span
                            class="w-7 h-7 rounded-full bg-white dark:bg-black/30 border border-slate-200 dark:border-white/10 flex items-center justify-center shrink-0 text-[11px] font-black text-nebula-primary">{{
                                i + 1 }}</span>
                        <div>
                            <p class="text-sm font-black text-slate-800 dark:text-white mb-1">{{ use.title }}</p>
                            <p class="text-xs text-slate-500 dark:text-white/55 leading-relaxed">{{ use.desc }}</p>
                        </div>
                    </div>
                </div>
            </UiCard>
        </section>

        <section id="keywords" class="scroll-mt-24">
            <UiCard>
                <template #header>
                    <div class="flex items-center gap-3">
                        <div class="w-3 h-3 rounded-full bg-nebula-secondary shadow-[0_0_10px_rgba(168,85,247,0.35)]">
                        </div>
                        <h2
                            class="text-base sm:text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider transition-colors">
                            Palabras clave
                        </h2>
                    </div>
                </template>

                <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    <div v-for="word in keywords" :key="word.term"
                        class="p-3 bg-slate-50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5 text-center transition-colors">
                        <p class="text-xs font-black text-nebula-primary">{{ word.term }}</p>
                        <p class="text-[10px] text-slate-500 dark:text-white/50 uppercase tracking-wide">{{ word.meaning
                        }}</p>
                    </div>
                </div>
            </UiCard>
        </section>

        <section id="verbs" class="scroll-mt-24">
            <UiCard>
                <template #header>
                    <div class="flex items-center gap-3">
                        <div class="w-3 h-3 rounded-full bg-nebula-cyan shadow-[0_0_10px_rgba(0,242,255,0.4)]"></div>
                        <h2
                            class="text-base sm:text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider transition-colors">
                            Verbos
                        </h2>
                    </div>
                </template>

                <div class="rounded-xl border border-slate-200 dark:border-white/10 overflow-hidden transition-colors">
                    <table class="w-full text-left">
                        <thead
                            class="bg-slate-100 dark:bg-white/10 text-[10px] uppercase font-black tracking-widest text-slate-600 dark:text-white/60 transition-colors">
                            <tr>
                                <th class="px-4 py-3">Infinitivo</th>
                                <th class="px-4 py-3">Pasado</th>
                                <th class="px-4 py-3 text-nebula-cyan">Participio</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white dark:bg-black/20 divide-y divide-slate-200 dark:divide-white/5">
                            <tr v-for="verb in verbs" :key="verb.inf"
                                class="transition-colors hover:bg-slate-50 dark:hover:bg-white/5">
                                <td class="px-4 py-3 text-xs font-semibold text-slate-700 dark:text-white/90">{{
                                    verb.inf }}
                                </td>
                                <td class="px-4 py-3 text-xs text-slate-500 dark:text-white/55">{{ verb.past }}</td>
                                <td class="px-4 py-3 text-xs font-black text-nebula-cyan">{{ verb.pp }}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </UiCard>
        </section>
    </div>
</template>

<script setup>
const usage = [
    {
        title: 'Experiencias',
        desc: 'Hablar de cosas que viviste en algun momento de tu vida sin decir cuando exacto.'
    },
    {
        title: 'Tiempo no terminado',
        desc: 'Acciones iniciadas antes y que todavia conectan con el presente.'
    },
    {
        title: 'Acciones recientes',
        desc: 'Eventos que acaban de pasar, normalmente con just, already o yet.'
    },
    {
        title: 'Resultado actual',
        desc: 'Hechos del pasado que producen una consecuencia visible ahora.'
    }
]

const keywords = [
    { term: 'Ever', meaning: 'alguna vez' },
    { term: 'Never', meaning: 'nunca' },
    { term: 'Just', meaning: 'acabar de' },
    { term: 'Already', meaning: 'ya' },
    { term: 'Yet', meaning: 'todavia / ya' },
    { term: 'Since', meaning: 'desde' },
    { term: 'For', meaning: 'por / durante' }
]

const verbs = [
    { inf: 'Be', past: 'Was/Were', pp: 'Been' },
    { inf: 'Go', past: 'Went', pp: 'Gone' },
    { inf: 'See', past: 'Saw', pp: 'Seen' },
    { inf: 'Eat', past: 'Ate', pp: 'Eaten' },
    { inf: 'Write', past: 'Wrote', pp: 'Written' },
    { inf: 'Do', past: 'Did', pp: 'Done' },
    { inf: 'Have', past: 'Had', pp: 'Had' }
]
</script>
