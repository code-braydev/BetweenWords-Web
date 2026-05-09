<template>
    <div class="relative flex items-center group">
        <slot />
        <div
            class="absolute left-full ml-3 px-2 py-1 bg-slate-800 dark:bg-nebula-secondary text-white dark:text-nebula-text text-[10px] font-mono rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-slate-700 dark:border-nebula-cyan/30 shadow-lg dark:shadow-neon-cyan">
            {{ text }}
        </div>
    </div>
</template>

<script setup>
defineProps({ text: String })
</script>