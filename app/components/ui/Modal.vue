<template>
    <Teleport to="body">
        <div v-if="show"
            class="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/70 dark:bg-nebula-dark/80 backdrop-blur-sm transition-colors">
            <div v-motion :initial="{ opacity: 0, scale: 0.9 }" :enter="{ opacity: 1, scale: 1 }"
                :class="[
                    'rounded-2xl w-full max-w-lg shadow-xl dark:shadow-neon-fuchsia overflow-hidden border transition-colors',
                    variant === 'transparent' ? 'bg-white/0 dark:bg-black/0 border-slate-200/0 dark:border-white/0 backdrop-blur-xl' : 'bg-white dark:bg-black/60 border-slate-200 dark:border-transparent'
                ]">
                <div :class="[
                    'p-4 flex justify-between items-center border-b transition-colors',
                    variant === 'transparent' ? 'bg-white/0 dark:bg-black/0 border-slate-200/0 dark:border-white/0' : 'bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10'
                ]">
                    <h3 class="text-nebula-primary dark:text-nebula-cyan font-mono text-xs uppercase tracking-widest">{{ title }}</h3>
                    <button v-if="!preventClose" @click="$emit('close')" class="text-slate-400 hover:text-red-500 dark:text-white/40 dark:hover:text-red-500 transition-colors">
                        <XIcon class="w-5 h-5" />
                    </button>
                </div>
                <div class="p-6">
                    <slot />
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
import { X as XIcon } from 'lucide-vue-next'
defineProps({ 
    show: Boolean, 
    title: String,
    variant: { type: String, default: 'default' },
    preventClose: { type: Boolean, default: false }
})
defineEmits(['close'])
</script>