<template>
    <main
        class="min-h-screen bg-transparent text-slate-900 dark:text-nebula-text flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 transition-colors duration-300">
        <header v-motion :initial="{ opacity: 0, y: -20 }"
            :enter="{ opacity: 1, y: 0, transition: { duration: 500, ease: 'easeOut' } }" class="mb-8 sm:mb-8 lg:mb-4">
            <div class="flex flex-col gap-4 mb-4">
                <div class="flex items-center gap-2 sm:gap-3 flex-wrap">
                    <UiBadge variant="secondary" class="text-xs sm:text-sm">ACTIVIDADES</UiBadge>
                    <h1 class="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-2">
                        Learning <span class="text-nebula-primary">Lab</span>
                    </h1>
                </div>
            </div>
            <p
                class="text-slate-600 dark:text-white/70 font-mono text-xs sm:text-sm pl-3 sm:pl-4 border-l-2 border-nebula-primary italic max-w-2xl leading-relaxed transition-colors">
                Practica y evalúa tus conocimientos en Present Perfect mediante ejercicios de escritura, escucha, habla
                y una evaluación final.
            </p>
        </header>
        <ActivitiesPractice />
    </main>
    <Footer />
</template>

<script setup>
useHead({
    title: 'Actividades - Between Words',
    meta: [
        { name: 'description', content: 'Practica Present Perfect con actividades interactivas de Writing, Listening, Speaking y Quiz.' },
    ],
})
</script>
