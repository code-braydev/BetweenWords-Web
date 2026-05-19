<template>
    <div ref="container" class="relative">
        <label v-if="label" :class="[
            'block text-[10px] font-mono uppercase tracking-widest ml-1 transition-colors group-focus-within:text-nebula-primary',
            glass ? 'text-white/60' : 'text-slate-500 dark:text-nebula-cyan'
        ]">
            {{ label }}
        </label>

        <button type="button" @click="open = !open" :class="[
            'w-full rounded-lg border py-3 px-4 text-left font-mono text-xs transition-all flex justify-between items-center',
            glass
                ? 'bg-white/[0.06] backdrop-blur-md border-white/10 text-white focus:bg-white/[0.10] focus:border-nebula-primary/60 focus:shadow-neon-fuchsia'
                : 'bg-white dark:bg-black/40 text-slate-900 dark:text-nebula-text border-slate-300 dark:border-white/10 hover:border-nebula-primary focus:border-nebula-primary dark:focus:bg-black/60',
            disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        ]" :disabled="disabled">
            <span
                :class="glass ? (selected ? 'text-white' : 'text-white/40') : (selected ? 'text-slate-900 dark:text-nebula-text' : 'text-slate-400 dark:text-white/30')">
                {{ selected?.label || placeholder }}
            </span>
            <ChevronDown class="w-4 h-4 transition-transform" :class="[
                { 'rotate-180': open },
                glass ? 'text-white/40' : 'text-slate-400 dark:text-white/30'
            ]" />
        </button>

        <Transition enter-active-class="transition duration-100 ease-out"
            enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
            leave-active-class="transition duration-75 ease-in" leave-from-class="transform scale-100 opacity-100"
            leave-to-class="transform scale-95 opacity-0">
            <div v-if="open" :class="[
                'absolute z-50 mt-2 w-full origin-top-left overflow-hidden rounded-lg border shadow-lg',
                glass
                    ? 'bg-nebula-dark/90 backdrop-blur-xl border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.3)]'
                    : 'border-slate-200 dark:border-white/10 bg-white dark:bg-nebula-dark dark:shadow-neon-fuchsia'
            ]">
                <button v-for="option in options" :key="option.value" type="button" @click="selectOption(option.value)"
                    :class="[
                        'w-full px-4 py-2 text-left text-xs font-mono transition-all',
                        glass
                            ? 'text-white/80 hover:bg-white/10 hover:text-white'
                            : 'text-slate-700 dark:text-nebula-text hover:bg-slate-50 dark:hover:bg-nebula-primary/20 hover:text-nebula-primary dark:hover:text-nebula-cyan',
                        { 'bg-slate-100 dark:bg-nebula-primary/10 text-nebula-primary dark:text-nebula-cyan': !glass && option.value === modelValue },
                        { 'bg-white/20 text-white font-bold': glass && option.value === modelValue }
                    ]">
                    {{ option.label }}
                </button>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { ChevronDown } from 'lucide-vue-next'

const props = defineProps({
    options: { type: Array, default: () => [] },
    modelValue: [String, Number],
    label: String,
    placeholder: { type: String, default: 'Select an option' },
    disabled: Boolean,
    triggerClass: { type: String, default: '' },
    glass: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue'])

const open = ref(false)
const container = ref(null)

const selected = computed(() =>
    props.options.find((option) => option.value === props.modelValue)
)

const selectOption = (value) => {
    emit('update:modelValue', value)
    open.value = false
}

const handleClickOutside = (event) => {
    if (container.value && !container.value.contains(event.target)) {
        open.value = false
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
})

const focusButton = () => {
    container.value?.querySelector('button')?.focus()
}

defineExpose({
    open,
    focusButton
})
</script>