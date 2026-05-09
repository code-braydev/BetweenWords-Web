<template>
    <div class="w-full space-y-1">
        <div class="flex justify-between text-[10px] font-mono text-slate-600 dark:text-nebula-text uppercase transition-colors">
            <span>{{ label }}</span>
            <span>{{ Math.round(progress) }}%</span>
        </div>
        <div class="h-2 w-full bg-slate-200 dark:bg-white/5 rounded-full overflow-hidden border border-slate-300 dark:border-white/10 transition-colors">
            <div class="h-full bg-gradient-to-r from-nebula-secondary to-nebula-cyan transition-all duration-1000 dark:shadow-neon-cyan"
                :style="{ width: `${progress}%` }"></div>
        </div>
    </div>
</template>

<script setup>
defineProps({ progress: { type: Number, default: 0 }, label: String })
</script>