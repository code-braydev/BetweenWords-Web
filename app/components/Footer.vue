<template>
  <footer class="relative w-full bg-transparent pt-12 pb-8 px-6 mt-auto overflow-hidden transition-colors duration-500">
    <div class="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-slate-200 dark:via-white/10 to-transparent">
    </div>

    <div
      class="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-fuchsia-500/5 blur-[120px] rounded-full pointer-events-none opacity-0 dark:opacity-100">
    </div>

    <div class="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">

      <div class="flex items-center gap-2 sm:gap-4 grayscale dark:grayscale-0 opacity-80 dark:opacity-100 transition-all">
        <img src="/logoUniversity.png" alt="Universidad de Córdoba" class="h-12 w-auto" />
        <div class="h-8 w-px bg-slate-200 dark:bg-white/10 hidden md:block"></div>
        <img src="/acreditacion.png" alt="Acreditación" class="h-12 w-auto" />
      </div>

      <div class="text-center">
        <p class="text-slate-500 dark:text-slate-400 text-[13px] font-medium tracking-tight mb-1 transition-colors">
          © 2026 <span class="text-slate-900 dark:text-white/80">Between Words</span> | <span class="text-slate-500 dark:text-white/50 font-bold">Objeto Virtual de Aprendizaje</span>
        </p>
        <p class="text-slate-400 dark:text-white/20 text-[10px] uppercase tracking-[0.3em] font-light transition-colors">
          Lic. en Informática | F. Educación y Ciencias Humanas
        </p>
        <p class="text-slate-400 dark:text-white/20 text-[10px] uppercase tracking-[0.3em] font-light transition-colors">
          Universidad de Córdoba
        </p>
      </div>

      <div class="flex flex-col items-center md:items-end group">
        <div class="flex items-center gap-2 mb-2">
          <span
            class="text-[10px] uppercase tracking-widest text-slate-400 dark:text-white/30 group-hover:text-slate-600 dark:group-hover:text-white/50 transition-colors">Desarrollado por:</span>
          <span class="text-slate-700 dark:text-white/70 font-mono text-xs tracking-tighter transition-colors">BrayDev</span>
        </div>

        <div
          class="flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 rounded-md backdrop-blur-md transition-all">
          <span class="text-[9px] font-bold text-fuchsia-600 dark:text-fuchsia-400/80 uppercase tracking-widest transition-colors">Brayan Avila Orozco</span>
        </div>
      </div>

    </div>
  </footer>
</template>