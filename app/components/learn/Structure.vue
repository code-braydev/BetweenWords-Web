<template>
    <section v-motion :initial="{ opacity: 0, y: 40 }" :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 100, ease: 'easeOut' } }" class="mt-8 p-4 sm:p-6 lg:px-8">
        <UiCard>

            <template #header>
                <div class="flex items-center gap-3">
                    <div class="w-3 h-3 rounded-full bg-nebula-secondary shadow-[0_0_10px_rgba(168,85,247,0.4)]"></div>
                    <h2 class="text-base sm:text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider transition-colors">
                        02. ¿Cómo se arman las oraciones?
                    </h2>
                </div>
            </template>

            <div class="space-y-8">
                <div class="bg-slate-50 dark:bg-black/40 p-6 rounded-2xl border border-slate-200 dark:border-white/5 transition-colors">
                    <p class="text-sm font-bold text-slate-600 dark:text-white/70 mb-6 text-center uppercase tracking-widest transition-colors">
                        Necesitas <span class="text-nebula-cyan font-black">dos piezas</span> trabajando juntas:
                    </p>

                    <div class="flex flex-col md:flex-row items-center justify-center gap-6">
                        <div class="flex flex-col items-center">
                            <div
                                class="px-6 py-3 bg-nebula-primary/10 border-2 border-nebula-primary/40 rounded-2xl text-nebula-primary font-black text-xl shadow-[0_0_15px_rgba(245,44,245,0.1)]">
                                HAVE / HAS
                            </div>
                            <span class="text-[12px] font-bold mt-3 text-slate-500 dark:text-white/50 uppercase tracking-tight transition-colors">El
                                ayudante</span>
                        </div>

                        <span class="text-nebula-cyan text-4xl font-light">+</span>

                        <div class="flex flex-col items-center">
                            <div
                                class="px-6 py-3 bg-nebula-secondary/10 border-2 border-nebula-secondary/40 rounded-2xl text-nebula-secondary font-black text-xl shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                                PARTICIPIO
                            </div>
                            <span class="text-[12px] font-bold mt-3 text-slate-500 dark:text-white/50 uppercase tracking-tight transition-colors">La acción
                                principal</span>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div class="p-6 bg-slate-50 dark:bg-white/[0.03] rounded-2xl border border-slate-200 dark:border-white/10 flex flex-col justify-between transition-colors">
                        <div>
                            <h3
                                class="text-base font-black text-slate-900 dark:text-white mb-4 uppercase tracking-wider flex items-center gap-2 transition-colors">
                                <span class="w-1.5 h-4 bg-nebula-cyan rounded-full"></span>
                                Verbos Fáciles (Regulares)
                            </h3>
                            <p class="text-[13px] text-slate-500 dark:text-white/60 mb-4 transition-colors">Solo tienes que añadir la terminación al final del
                                verbo:</p>

                            <div class="bg-white dark:bg-black/50 p-5 rounded-xl mb-6 border border-slate-200 dark:border-white/5 text-center shadow-inner transition-colors">
                                <p class="text-2xl font-bold text-slate-900 dark:text-white tracking-tighter transition-colors">Verbo + <span
                                        class="text-nebula-cyan font-black underline underline-offset-8 decoration-nebula-cyan/30">-ED</span>
                                </p>
                            </div>
                        </div>

                        <div class="flex flex-wrap gap-3">
                            <span v-for="verb in ['played', 'arrived', 'looked']" :key="verb"
                                class="px-4 py-2 bg-white dark:bg-nebula-dark border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold text-slate-700 dark:text-white/90 transition-colors">
                                {{ verb }}
                            </span>
                        </div>
                    </div>

                    <div class="rounded-2xl border border-slate-200 dark:border-white/10 overflow-hidden bg-white dark:bg-black/30 shadow-xl dark:shadow-2xl transition-colors">
                        <table class="w-full text-left border-collapse">
                            <thead class="bg-slate-100 dark:bg-white/10 text-slate-600 dark:text-white/60 font-bold text-xs uppercase tracking-widest transition-colors">
                                <tr>
                                    <th class="p-4 border-b border-slate-200 dark:border-white/5 transition-colors">Tipo</th>
                                    <th class="p-4 border-b border-slate-200 dark:border-white/5 transition-colors">Cómo se escribe</th>
                                </tr>
                            </thead>
                            <tbody class="text-slate-800 dark:text-white font-medium text-[14px] transition-colors">
                                <tr class="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors">
                                    <td class="p-4 text-nebula-primary font-black uppercase">Afirmar</td>
                                    <td class="p-4">Persona + <span class="text-nebula-primary">have/has</span> +
                                        Participio</td>
                                </tr>
                                <tr class="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors">
                                    <td class="p-4 text-red-500 dark:text-red-400 font-black uppercase">Negar</td>
                                    <td class="p-4">Persona + <span
                                            class="text-red-500 dark:text-red-400">haven't/hasn't</span> +
                                        Participio</td>
                                </tr>
                                <tr class="hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors">
                                    <td class="p-4 text-nebula-cyan font-black uppercase">Preguntar</td>
                                    <td class="p-4"><span class="text-nebula-cyan">Have/Has</span> + Persona +
                                        Participio?</td>
                                </tr>
                            </tbody>
                        </table>

                        <div class="p-4 bg-slate-50 dark:bg-nebula-cyan/5 border-t border-slate-100 dark:border-white/5 text-center transition-colors">
                            <p class="text-sm text-nebula-cyan dark:text-nebula-cyan/80 font-bold">
                                Ejemplo: "She <span class="text-slate-900 dark:text-white underline decoration-white/20">has visited</span>
                                Paris."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </UiCard>
    </section>
</template>