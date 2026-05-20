<template>
    <div class="absolute inset-0 flex flex-col overflow-hidden h-full w-full">
        <div :class="[
            'flex-1 relative h-full w-full',
            store.status.isMaximized ? 'p-0' : 'p-4 lg:p-8'
        ]">
            <GameWhatsapp v-if="store.status.currentStep === 'whatsapp'" :class="[
                'shadow-2xl transition-all duration-500 ease-in-out',
                store.status.isMaximized
                    ? 'fixed inset-0 z-[200] !w-screen !h-screen !rounded-none !border-0'
                    : 'mx-auto w-full max-w-4xl !h-[80%] mt-6 rounded-2xl relative z-50'
            ]" />

            <GameBrowser v-if="store.status.currentStep === 'browser'" :initial-mode="browserMode" :class="[
                'shadow-2xl transition-all duration-500 ease-in-out',
                store.status.isMaximized
                    ? 'fixed inset-0 z-[200] !w-screen !h-screen !rounded-none !border-0'
                    : 'mx-auto w-full max-w-4xl !h-[85%] rounded-2xl relative z-50'
            ]" />

            <GameExcel v-if="store.status.currentStep === 'excel'" @settings="$emit('settings')" :class="[
                'shadow-2xl transition-all duration-500 ease-in-out',
                store.status.isMaximized
                    ? 'fixed inset-0 z-[200] !w-screen !h-screen !rounded-none !border-0'
                    : 'mx-auto w-full max-w-6xl !h-[90%] mt-4 rounded-2xl relative z-50'
            ]" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const store = useGameStore()
const emit = defineEmits(['settings'])

const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1200)
const browserMode = computed(() => store.status.browserMode || 'home')

const updateWidth = () => {
    windowWidth.value = window.innerWidth
}

onMounted(() => {
    window.addEventListener('resize', updateWidth)
})

onUnmounted(() => {
    window.removeEventListener('resize', updateWidth)
})
</script>
