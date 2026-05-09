<template>
    <button v-motion :initial="{ scale: 1 }" :hovered="{ scale: 1.05 }" :tapped="{ scale: 0.95 }"
        :disabled="disabled || loading" @click="$emit('click')" :class="[
            'group relative font-mono font-bold tracking-widest transition-all duration-300 rounded-lg overflow-hidden flex items-center justify-center gap-2',
            variantClasses[variant],
            sizeClasses[size],
            disabled ? 'opacity-50 cursor-not-allowed filter grayscale' : 'cursor-pointer'
        ]">
        <div
            class="absolute inset-0 bg-black/5 dark:bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        </div>

        <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />

        <component :is="icon" v-if="icon && !loading"
            :class="['w-4 h-4 transition-all duration-300 group-hover:rotate-12', iconClass]" />

        <span v-if="label" class="relative z-10">{{ label }}</span>
        <slot v-else />

        <!-- Corner accents: adaptar al tema -->
        <div
            class="absolute top-0 left-0 w-1 h-1 border-t border-l border-slate-400/40 dark:border-white/40 group-hover:border-nebula-cyan transition-colors">
        </div>
        <div
            class="absolute bottom-0 right-0 w-1 h-1 border-b border-r border-slate-400/40 dark:border-white/40 group-hover:border-nebula-cyan transition-colors">
        </div>
    </button>
</template>

<script setup>
import { Loader2 } from 'lucide-vue-next'

const props = defineProps({
    label: String,
    disabled: Boolean,
    loading: Boolean,
    variant: { type: String, default: 'primary' },
    size: { type: String, default: 'md' },
    icon: [Object, Function],
    iconClass: String
})

defineEmits(['click'])

const variantClasses = {
    primary: 'bg-nebula-primary text-white shadow-neon-fuchsia border border-nebula-primary/50',
    secondary: 'bg-nebula-secondary text-white shadow-[0_0_10px_rgba(124,34,228,0.3)] border border-white/10',
    outline: 'bg-transparent border border-nebula-cyan text-nebula-cyan hover:bg-nebula-cyan/10 shadow-[inset_0_0_5px_rgba(0,242,255,0.2)]',
    danger: 'bg-red-600 text-white hover:bg-red-500 shadow-lg border border-red-400/50',
    success: 'bg-green-600 text-white hover:bg-green-500 shadow-lg border border-green-400/50',
    subtle: 'bg-transparent text-slate-700 dark:text-white/60 hover:text-nebula-primary dark:hover:text-nebula-cyan hover:bg-nebula-primary/5 dark:hover:bg-white/5'
}

const sizeClasses = {
    sm: 'px-3 py-1.5 text-[10px]',
    md: 'px-6 py-3 text-xs',
    lg: 'px-10 py-4 text-sm uppercase'
}
</script>