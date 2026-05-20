<template>
    <div v-motion :initial="{ opacity: 0, x: -20 }" :enter="{ opacity: 1, x: 0 }" class="w-full space-y-1.5 group">
        <label v-if="label" :class="[
            'block text-[10px] font-mono uppercase tracking-widest ml-1 transition-colors group-focus-within:text-nebula-primary',
            glass ? 'text-white/60' : 'text-slate-500 dark:text-nebula-cyan'
        ]">
            {{ label }}
        </label>

        <div class="relative flex items-center">
            <div v-if="icon" :class="[
                'absolute left-3 transition-colors group-focus-within:text-nebula-primary',
                glass ? 'text-white/30' : 'text-slate-400 dark:text-white/40'
            ]">
                <component :is="icon" class="w-4 h-4" />
            </div>

            <textarea v-if="type === 'textarea'" :value="modelValue"
                @input="$emit('update:modelValue', $event.target.value)" :placeholder="placeholder" :disabled="disabled"
                :rows="rows" :class="[
                    'w-full rounded-lg h-12 py-3 px-4 font-mono text-md outline-none transition-all duration-300 resize-none',
                    icon ? 'pl-10' : 'pl-4',
                    // Glass mode (for root page)
                    glass
                        ? 'bg-white/[0.06] backdrop-blur-md border text-white placeholder:text-white/25 focus:bg-white/[0.10]'
                        : 'bg-white dark:bg-black/40 border text-slate-900 dark:text-nebula-text placeholder:text-slate-400 dark:placeholder:text-white/30',
                    // Border & focus
                    error
                        ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                        : glass
                            ? 'border-white/10 focus:border-nebula-primary/60 focus:shadow-neon-fuchsia'
                            : 'border-slate-300 dark:border-white/10 focus:border-nebula-primary focus:shadow-neon-fuchsia dark:focus:bg-black/60'
                ]"></textarea>

            <input v-else :type="type" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
                :placeholder="placeholder" :disabled="disabled" :class="[
                    'w-full rounded-lg py-3 px-4 font-mono text-xs outline-none transition-all duration-300',
                    icon ? 'pl-10' : 'pl-4',
                    // Glass mode (for root page)
                    glass
                        ? 'bg-white/[0.06] backdrop-blur-md border text-white placeholder:text-white/25 focus:bg-white/[0.10]'
                        : 'bg-white dark:bg-black/40 border text-slate-900 dark:text-nebula-text placeholder:text-slate-400 dark:placeholder:text-white/30',
                    // Border & focus
                    error
                        ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                        : glass
                            ? 'border-white/10 focus:border-nebula-primary/60 focus:shadow-neon-fuchsia'
                            : 'border-slate-300 dark:border-white/10 focus:border-nebula-primary focus:shadow-neon-fuchsia dark:focus:bg-black/60'
                ]" />

            <div
                class="absolute top-0 right-0 w-2 h-2 border-t border-r border-nebula-primary opacity-0 group-focus-within:opacity-100 transition-opacity rounded-tr-lg">
            </div>
        </div>

        <p v-if="error"
            :class="['text-[10px] mt-1 ml-1 flex items-center gap-1', glass ? 'text-red-400' : 'text-red-500 dark:text-red-400']">
            <AlertCircle class="w-3 h-3" />
            {{ error }}
        </p>
    </div>
</template>

<script setup>
import { AlertCircle } from 'lucide-vue-next'

defineProps({
    modelValue: [String, Number],
    label: String,
    placeholder: String,
    type: { type: String, default: 'text' },
    icon: [Object, Function],
    error: String,
    disabled: Boolean,
    glass: { type: Boolean, default: false }, // glassmorphism mode (root page)
    rows: { type: [Number, String], default: 3 }
})

defineEmits(['update:modelValue'])
</script>

<style scoped>
input::-ms-reveal,
input::-ms-clear {
    display: none;
}

.scrollbar-custom::-webkit-scrollbar,
.custom-scrollbar::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}

.scrollbar-custom::-webkit-scrollbar-track,
.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.scrollbar-custom::-webkit-scrollbar-thumb,
.custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(100, 100, 100, 0.28);
    border-radius: 12px;
    border: 2px solid transparent;
    background-clip: padding-box;
}

.scrollbar-custom textarea::-webkit-scrollbar,
.scrollbar-custom input::-webkit-scrollbar,
.custom-scrollbar textarea::-webkit-scrollbar,
.custom-scrollbar input::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

.scrollbar-custom textarea::-webkit-scrollbar-thumb,
.scrollbar-custom input::-webkit-scrollbar-thumb,
.custom-scrollbar textarea::-webkit-scrollbar-thumb,
.custom-scrollbar input::-webkit-scrollbar-thumb {
    background: rgba(100, 100, 100, 0.32);
    border-radius: 10px;
}

/* Firefox support */
.scrollbar-custom,
.custom-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: rgba(100, 100, 100, 0.32) transparent;
}
</style>