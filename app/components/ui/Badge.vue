<template>
    <span :class="[
        'px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase tracking-widest border shadow-sm transition-colors duration-300',
        variants[variant]
    ]">
        <slot />
    </span>
</template>

<script setup>
defineProps({ variant: { type: String, default: 'primary' } })
const variants = {
    primary: 'bg-nebula-primary/10 dark:bg-nebula-primary/20 border-nebula-primary text-nebula-primary shadow-neon-fuchsia',
    cyan: 'bg-nebula-cyan/10 dark:bg-nebula-cyan/20 border-nebula-cyan text-nebula-cyan shadow-neon-cyan',
    danger: 'bg-red-500/10 dark:bg-red-500/20 border-red-500 text-red-500 dark:text-red-400'
}
</script>