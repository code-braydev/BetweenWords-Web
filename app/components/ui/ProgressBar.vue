<template>
    <div class="flex flex-col gap-1">
        <div class="flex items-center justify-between">
            <span class="text-xs font-semibold text-slate-600 dark:text-white/70">{{ label }}</span>
            <span class="text-xs font-bold text-nebula-cyan">{{ Math.round(progress) }}%</span>
        </div>
        <div class="w-full h-2 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
            <div class="h-full bg-gradient-to-r from-nebula-cyan to-nebula-primary rounded-full transition-all duration-300"
                :style="{ width: `${progress}%` }" />
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps({
    progress: {
        type: Number,
        default: 0
    },
    label: {
        type: String,
        default: 'Progress'
    }
})
</script>
