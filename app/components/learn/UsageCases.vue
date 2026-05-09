<template>
    <section v-motion :initial="{ opacity: 0, y: 40 }" :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 200, ease: 'easeOut' } }" class="mt-6 p-4 sm:p-6 lg:p-8">
        <UiCard>
            <template #header>
                <div class="flex items-center gap-3">
                    <div class="w-2.5 h-2.5 rounded-full bg-nebula-cyan animate-pulse"></div>
                    <h2 class="text-base sm:text-lg font-bold text-slate-900 dark:text-nebula-text uppercase transition-colors">¿Cuándo Usar Present Perfect?
                    </h2>
                </div>
            </template>

            <p class="text-slate-400 dark:text-nebula-text/40 mb-4 font-mono text-[10px] uppercase tracking-[0.3em] transition-colors">Protocolos de
                Aplicación Contextual
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-for="(item, i) in usageData" :key="item.title"
                    v-motion :initial="{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }"
                    :enter="{ opacity: 1, x: 0, transition: { duration: 500, delay: 300 + i * 100 } }"
                    class="group p-4 bg-slate-50 dark:bg-white/5 rounded-lg border border-slate-200 dark:border-white/10 transition-all hover:border-nebula-primary/30">
                    <h3
                        :class="`font-black text-sm mb-2 uppercase tracking-wider flex items-center gap-2 ${item.colorText}`">
                        <span :class="`w-1 h-4 rounded-full opacity-70 ${item.colorBg}`"></span>
                        {{ item.title }}
                    </h3>

                    <p class="text-slate-600 dark:text-nebula-text/90 text-sm mb-3 leading-relaxed transition-colors">{{ item.description }}</p>

                    <div class="bg-white dark:bg-black/60 p-3 rounded-lg border border-slate-200 dark:border-white/10 font-mono transition-colors">
                        <p class="text-sm text-slate-800 dark:text-nebula-text leading-relaxed transition-colors">"{{ item.examplePart1 }} <span
                                :class="`font-bold ${item.colorText}`">{{ item.exampleVerb }}</span> {{
                            item.examplePart2 }}"</p>

                        <div class="mt-3 pt-3 border-t border-slate-100 dark:border-white/5 flex items-start gap-2 transition-colors">
                            <span :class="`text-[10px] font-black uppercase tracking-widest ${item.colorText}`">// {{
                                item.logType
                                }}:</span>
                            <span class="text-[10px] text-slate-500 dark:text-nebula-text/60 uppercase font-bold tracking-wider transition-colors">{{ item.log
                                }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </UiCard>
    </section>
</template>

<script setup>
const usageData = [
    {
        title: 'Acciones Continuas',
        description: 'Situaciones iniciadas en el pasado que siguen vigentes en el presente.',
        examplePart1: 'I',
        exampleVerb: 'have lived',
        examplePart2: 'here since 2020.',
        logType: 'STATUS',
        log: 'Todavía vivo aquí',
        colorText: 'text-nebula-primary',
        colorBg: 'bg-nebula-primary'
    },
    {
        title: 'Periodos no Concluidos',
        description: 'Cuando el lapso de tiempo (semana/año/día) aún no termina.',
        examplePart1: 'She',
        exampleVerb: 'has been',
        examplePart2: 'twice this week.',
        logType: 'STATUS',
        log: 'La semana no acaba',
        colorText: 'text-nebula-secondary',
        colorBg: 'bg-nebula-secondary'
    },
    {
        title: 'Acciones Repetidas',
        description: 'Eventos que se han reiterado en un tiempo inespecífico.',
        examplePart1: 'We',
        exampleVerb: 'have visited',
        examplePart2: 'Portugal many times.',
        logType: 'LOG',
        log: 'Frecuencia acumulada',
        colorText: 'text-nebula-primary',
        colorBg: 'bg-nebula-primary'
    },
    {
        title: 'Pasado Muy Reciente',
        description: "Acciones terminadas hace solo un instante, indicado con 'just'.",
        examplePart1: 'I',
        exampleVerb: 'have just finished',
        examplePart2: 'my work.',
        logType: 'EVENT',
        log: 'Recién completado',
        colorText: 'text-nebula-cyan',
        colorBg: 'bg-nebula-cyan'
    }
];
</script>