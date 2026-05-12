<template>
    <div class="absolute inset-0 flex flex-col overflow-hidden">
        <!-- Desktop Area (Apps) -->
        <div class="flex-1 relative p-4 lg:p-8">
            <Transition enter-active-class="transition duration-300 ease-out"
                enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-200 ease-in" leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0">
                <GameWhatsapp v-if="store.status.currentStep === 'whatsapp'"
                    :class="[
                        'mx-auto shadow-2xl transition-all duration-500 ease-in-out',
                        isMaximized('whatsapp')
                            ? 'w-full h-[calc(100vh-3.5rem)] mt-0 rounded-none' 
                            : 'w-full max-w-4xl h-[80%] mt-10 rounded-2xl'
                    ]" />
            </Transition>

            <Transition enter-active-class="transition duration-300 ease-out"
                enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-200 ease-in" leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0">
                <GameBrowser v-if="store.status.currentStep === 'browser'"
                    :class="[
                        'mx-auto shadow-2xl transition-all duration-500 ease-in-out',
                        isMaximized('browser')
                            ? 'w-full h-[calc(100vh-3.5rem)] mt-0 rounded-none' 
                            : 'w-full max-w-5xl h-[85%] mt-6 rounded-2xl'
                    ]" />
            </Transition>

            <Transition enter-active-class="transition duration-300 ease-out"
                enter-from-class="transform scale-95 opacity-0" enter-to-class="transform scale-100 opacity-100"
                leave-active-class="transition duration-200 ease-in" leave-from-class="transform scale-100 opacity-100"
                leave-to-class="transform scale-95 opacity-0">
                <GameExcel v-if="store.status.currentStep === 'excel'"
                    :class="[
                        'mx-auto shadow-2xl transition-all duration-500 ease-in-out',
                        isMaximized('excel')
                            ? 'w-full h-[calc(100vh-3.5rem)] mt-0 rounded-none' 
                            : 'w-full max-w-6xl h-[90%] mt-4 rounded-2xl'
                    ]" />
            </Transition>
        </div>

        <!-- Taskbar -->
        <div
            class="absolute bottom-0 h-14 w-full bg-black/40 backdrop-blur-xl border-t border-white/10 flex items-center justify-center px-4 z-50">
            <div class="flex items-center gap-2">
                <!-- Taskbar Icons -->
                <button @click="store.openApp('whatsapp')" :class="[
                    'p-2 rounded-lg transition-all duration-300 hover:bg-white/10 flex flex-col items-center gap-1 relative',
                    store.status.currentStep === 'whatsapp' ? 'bg-white/10 shadow-[0_0_15px_rgba(34,197,94,0.3)]' : ''
                ]">
                    <MessageSquare class="w-6 h-6 text-green-400" />
                    <div v-if="store.runningApps?.includes('whatsapp')"
                        class="absolute -bottom-1 w-1 h-1 bg-white rounded-full"></div>
                </button>

                <button @click="store.openApp('browser')" :class="[
                    'p-2 rounded-lg transition-all duration-300 hover:bg-white/10 flex flex-col items-center gap-1 relative',
                    store.status.currentStep === 'browser' ? 'bg-white/10 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : ''
                ]">
                    <Globe class="w-6 h-6 text-blue-400" />
                    <div v-if="store.runningApps?.includes('browser')"
                        class="absolute -bottom-1 w-1 h-1 bg-white rounded-full"></div>
                </button>

                <button @click="store.openApp('excel')" :class="[
                    'p-2 rounded-lg transition-all duration-300 hover:bg-white/10 flex flex-col items-center gap-1 relative',
                    store.status.currentStep === 'excel' ? 'bg-white/10 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : ''
                ]">
                    <Table class="w-6 h-6 text-emerald-500" />
                    <div v-if="store.runningApps?.includes('excel')"
                        class="absolute -bottom-1 w-1 h-1 bg-white rounded-full"></div>
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { MessageSquare, Globe, Table } from 'lucide-vue-next'
import { useGameStore } from '@/stores/useGameStore'

const store = useGameStore()
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

const isMobile = computed(() => windowWidth.value < 768)
const isMaximized = (app) => store.status.isMaximized || isMobile.value
</script>
