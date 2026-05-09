<template>
    <button @click="$emit('update:modelValue', !modelValue)" class="flex items-center gap-3 group">
        <div :class="[
            'w-10 h-5 rounded-full transition-all duration-300 relative border',
            modelValue ? 'bg-nebula-primary border-nebula-primary shadow-neon-fuchsia' : 'bg-slate-200 dark:bg-white/10 border-slate-300 dark:border-white/20'
        ]">
            <div :class="[
                'absolute top-1 w-3 h-3 rounded-full transition-all duration-300',
                modelValue ? 'left-6 bg-white' : 'left-1 bg-slate-400 dark:bg-white/40'
            ]"></div>
        </div>
        <span v-if="label" class="text-xs font-mono text-slate-600 dark:text-white/70 group-hover:text-nebula-primary dark:group-hover:text-nebula-cyan transition-colors">{{ label }}</span>
    </button>
</template>

<script setup>
defineProps(['modelValue', 'label'])
defineEmits(['update:modelValue'])
</script>