<template>
    <div class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] transition-all duration-500">
        <div
            class="px-4 py-3 bg-white/10 dark:bg-black/20 backdrop-blur-3xl border border-white/20 rounded-[24px] flex items-center gap-3 shadow-2xl">
            <!-- App Icons -->
            <div class="flex items-center gap-4">
                <!-- WhatsApp -->
                <div class="relative group">
                    <button @click="store.openApp('whatsapp')"
                        class="w-12 h-12 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg transform group-hover:scale-125 group-hover:-translate-y-2 transition-all duration-300">
                        <MessageSquare class="w-6 h-6 text-white" />
                    </button>
                    <div v-if="store.status.runningApps.includes('whatsapp')"
                        class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full shadow-[0_0_5px_#fff]">
                    </div>
                    <!-- Tooltip -->
                    <span
                        class="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/80 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none uppercase font-bold tracking-widest">WhatsApp</span>
                </div>

                <!-- Browser -->
                <div class="relative group">
                    <button @click="store.openApp('browser')" :class="[
                        'w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-125 group-hover:-translate-y-2'
                    ]">
                        <Globe class="w-6 h-6 text-white" />
                    </button>
                    <div v-if="store.status.runningApps.includes('browser')"
                        class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full shadow-[0_0_5px_#fff]">
                    </div>
                    <span v-if="store.status.isWhatsappUnlocked"
                        class="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/80 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none uppercase font-bold tracking-widest">Browser</span>
                </div>

                <!-- Excel -->
                <div class="relative group">
                    <button @click="store.openApp('excel')" :class="[
                        'w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg transform transition-all duration-300 group-hover:scale-125 group-hover:-translate-y-2'
                    ]">
                        <Table class="w-6 h-6 text-white" />
                    </button>
                    <div v-if="store.status.runningApps.includes('excel')"
                        class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full shadow-[0_0_5px_#fff]">
                    </div>
                    <span v-if="store.status.isFileUnlocked"
                        class="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/80 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none uppercase font-bold tracking-widest">Excel</span>
                </div>
            </div>

            <!-- Separator -->
            <div class="h-8 w-[1px] bg-white/20 mx-1"></div>

            <!-- Settings -->
            <div class="relative group">
                <button @click="$emit('settings')"
                    class="w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center shadow-lg transform group-hover:scale-125 group-hover:-translate-y-2 transition-all duration-300">
                    <Settings class="w-6 h-6 text-white/80" />
                </button>
                <span
                    class="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/80 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none uppercase font-bold tracking-widest">Settings</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { MessageSquare, Globe, Table, Settings } from 'lucide-vue-next'
import { useGameStore } from '@/stores/useGameStore'

const store = useGameStore()
const currentTime = ref('')

const updateTime = () => {
    const now = new Date()
    currentTime.value = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

let timer
onMounted(() => {
    updateTime()
    timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
    clearInterval(timer)
})
</script>
