<template>
    <section v-motion :initial="{ opacity: 0, y: 40 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 600, ease: 'easeOut' } }" class="p-4 sm:p-6 lg:p-8">
        <UiCard>
            <template #header>
                <div class="flex items-center gap-3">
                    <div class="w-2.5 h-2.5 rounded-full bg-nebula-primary shadow-[0_0_8px_rgba(245,44,245,0.4)]"></div>
                    <h2
                        class="text-sm sm:text-base font-black text-slate-900 dark:text-white uppercase tracking-wider transition-colors">
                        Concepto Base:
                    </h2>
                </div>
            </template>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

                <div class="space-y-6">
                    <p
                        class="text-[15px] text-slate-700 dark:text-white/90 leading-relaxed font-medium transition-colors">
                        El <strong
                            class="text-nebula-cyan font-black underline decoration-nebula-cyan/40 underline-offset-4">Present
                            Perfect</strong>
                        conecta el pasado con tu situación actual. No importa el "cuándo", importa el "qué" ha pasado
                        hasta ahora.
                    </p>

                    <div
                        class="bg-slate-50 dark:bg-black/40 p-6 rounded-2xl border-l-4 border-nebula-primary/60 transition-colors">
                        <span
                            class="text-nebula-primary/80 font-mono font-black uppercase text-xs block mb-2 tracking-widest">
                            // Definición Técnica
                        </span>
                        <p class="text-base text-slate-900 dark:text-white font-bold leading-snug transition-colors">
                            Acciones ocurridas en un tiempo <span
                                class="bg-nebula-secondary/20 text-nebula-secondary px-2 rounded">no definido</span> que
                            tienen
                            relevancia en el presente.
                        </p>
                    </div>

                    <p
                        class="text-[13px] text-slate-500 dark:text-white/70 leading-relaxed border-t border-slate-200 dark:border-white/5 pt-4 transition-colors">
                        * Ejemplo: Si has leído un libro, la acción terminó, pero el conocimiento vive en ti en este
                        momento.
                    </p>
                </div>

                <div
                    class="p-8 bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 rounded-3xl transition-colors">
                    <div
                        class="relative w-full h-1.5 bg-slate-200 dark:bg-white/10 rounded-full mb-16 flex items-center transition-colors">
                        <div
                            class="absolute left-0 h-full bg-gradient-to-r from-nebula-primary/40 to-nebula-cyan/40 w-full rounded-full">
                        </div>

                        <div
                            class="absolute left-0 w-5 h-5 bg-white dark:bg-nebula-dark border-2 border-nebula-primary/50 rounded-full shadow-lg transition-colors">
                        </div>
                        <span
                            class="absolute left-0 -bottom-8 text-[11px] font-black text-slate-400 dark:text-white/40 uppercase transition-colors">Pasado</span>

                        <div
                            class="absolute right-0 w-10 h-10 bg-white dark:bg-nebula-dark border-2 border-nebula-cyan rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,242,255,0.2)] transition-colors">
                            <div class="w-4 h-4 bg-nebula-cyan rounded-full"></div>
                        </div>
                        <span
                            class="absolute right-0 -bottom-10 text-[12px] font-black text-nebula-cyan uppercase tracking-widest">Ahora</span>
                    </div>

                    <div
                        class="bg-slate-100 dark:bg-black/60 p-5 rounded-xl border border-slate-200 dark:border-white/10 text-center shadow-2xl transition-colors">
                        <code
                            class="text-xl sm:text-2xl font-mono text-slate-900 dark:text-white block transition-colors">
                I <span class="text-nebula-cyan font-black">have lived</span> here
            </code>
                        <p class="mt-3 text-[11px] text-nebula-cyan/80 font-black uppercase tracking-[0.2em]">
                            Resultado: Sigo viviendo aquí
                        </p>
                    </div>
                </div>

            </div>
        </UiCard>
    </section>
</template>