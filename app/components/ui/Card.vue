<template>
    <div
        :class="[
            'border rounded-2xl overflow-hidden shadow-xl flex flex-col transition-all duration-500 hover:border-nebula-primary/20',
            glass
                ? 'bg-white/[0.03] backdrop-blur-xl border-white/10'
                : 'bg-white border-slate-200 dark:bg-black/40 dark:backdrop-blur-md dark:border-white/10'
        ]">
        <div v-if="$slots.header"
            :class="[
                'px-6 py-4 border-b flex items-center justify-between',
                glass ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100 dark:bg-white/5 dark:border-white/5'
            ]">
            <slot name="header" />
        </div>

        <div :class="['p-6 flex-1', bodyClass]">
            <slot />
        </div>

        <div v-if="$slots.footer" :class="[
            'px-6 py-3 border-t',
            glass ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100 dark:bg-white/5 dark:border-white/5'
        ]">
            <slot name="footer" />
        </div>
    </div>
</template>

<script setup>
defineProps({
    bodyClass: String,
    glass: { type: Boolean, default: false }
})
</script>