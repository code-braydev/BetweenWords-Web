<template>
    <div class="absolute inset-0 flex flex-col overflow-hidden h-full w-full">
        <!-- Desktop Area (Apps) -->
        <div :class="[
            'flex-1 relative h-full w-full',
            store.status.isMaximized ? 'p-0' : 'p-4 lg:p-8'
        ]">
            <!-- WhatsApp App -->
            <GameWhatsapp v-if="store.status.currentStep === 'whatsapp'" :class="[
                'shadow-2xl transition-all duration-500 ease-in-out',
                store.status.isMaximized
                    ? 'fixed inset-0 z-[200] !w-screen !h-screen !rounded-none !border-0'
                    : 'mx-auto w-full max-w-4xl !h-[80%] mt-6 rounded-2xl relative z-50'
            ]" />

            <!-- Browser App -->
            <GameBrowser v-if="store.status.currentStep === 'browser'" :initial-mode="browserMode" :class="[
                'shadow-2xl transition-all duration-500 ease-in-out',
                store.status.isMaximized
                    ? 'fixed inset-0 z-[200] !w-screen !h-screen !rounded-none !border-0'
                    : 'mx-auto w-full max-w-4xl !h-[85%] rounded-2xl relative z-50'
            ]" />

            <!-- Excel App -->
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
import { useGameStore } from '@/stores/useGameStore'

// Explicit imports to ensure components are registered correctly
import GameWhatsapp from './Whatsapp.vue'
import GameBrowser from './Browser.vue'
import GameExcel from './Excel.vue'

const store = useGameStore()
const emit = defineEmits(['settings'])
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1200)

// Default to exam mode when opened from the dock; the user can navigate back to search from there
const browserMode = computed(() => 'home')

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
