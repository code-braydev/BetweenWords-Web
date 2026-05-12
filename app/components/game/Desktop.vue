<template>
    <div class="absolute inset-0 flex flex-col overflow-hidden">
        <!-- Desktop Area (Apps) -->
        <div :class="[
            'flex-1 relative',
            store.status.isMaximized ? 'p-0' : 'p-4 lg:p-8'
        ]">
            <Transition enter-active-class="transition duration-300 ease-out"
                enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-200 ease-in" leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0">
                <GameWhatsapp v-if="store.status.currentStep === 'whatsapp'" :class="[
                    'shadow-2xl transition-all duration-500 ease-in-out',
                    isMaximized('whatsapp')
                        ? 'fixed inset-0 z-[200] !w-screen !h-screen !rounded-none !border-0'
                        : 'mx-auto w-full max-w-4xl !h-[80%] mt-6 rounded-2xl'
                ]" />
            </Transition>

            <Transition enter-active-class="transition duration-300 ease-out"
                enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-200 ease-in" leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0">
                <GameBrowser v-if="store.status.currentStep === 'browser'" :class="[
                    'shadow-2xl transition-all duration-500 ease-in-out',
                    isMaximized('browser')
                        ? 'fixed inset-0 z-[200] !w-screen !h-screen !rounded-none !border-0'
                        : 'mx-auto w-full max-w-4xl !h-[80%] rounded-2xl'
                ]" />
            </Transition>

            <Transition enter-active-class="transition duration-300 ease-out"
                enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-200 ease-in" leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0">
                <GameExcel v-if="store.status.currentStep === 'excel'" @settings="$emit('settings')" :class="[
                    'shadow-2xl transition-all duration-500 ease-in-out',
                    isMaximized('excel')
                        ? 'fixed inset-0 z-[200] !w-screen !h-screen !rounded-none !border-0'
                        : 'mx-auto w-full max-w-6xl !h-[90%] mt-4 rounded-2xl'
                ]" />
            </Transition>
        </div>

    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useGameStore } from '@/stores/useGameStore'

const store = useGameStore()
const emit = defineEmits(['settings'])
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 1200)

const updateWidth = () => {
    windowWidth.value = window.innerWidth
}

onMounted(() => {
    window.addEventListener('resize', updateWidth)
})

onUnmounted(() => {
    window.removeEventListener('resize', updateWidth)
})

const isMaximized = () => store.status.isMaximized
</script>
