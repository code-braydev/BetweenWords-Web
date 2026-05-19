<template>
    <!-- Sleep Mode Overlay -->
    <div v-if="isSleeping" class="fixed inset-0 bg-black z-[9999] flex items-end justify-end p-4">
        <p class="text-white/20 text-[10px] font-mono select-none">Press [Esc] to wake up</p>
    </div>

    <!-- Spotlight Menu -->
    <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
    >
        <div v-if="isOpen && !isSleeping" class="fixed inset-0 z-[9998] flex items-start justify-center pt-[15vh]">
            <!-- Backdrop -->
            <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="close"></div>
            
            <!-- Menu Container -->
            <div class="relative w-full max-w-2xl bg-white/10 dark:bg-black/40 backdrop-blur-md border border-white/20 shadow-2xl rounded-2xl overflow-hidden flex flex-col mx-4 sm:mx-0">
                <!-- Search Input -->
                <div class="flex items-center px-4 py-3 border-b border-white/10">
                    <Search class="w-5 h-5 text-white/50 mr-3 shrink-0" />
                    <input 
                        ref="searchInput"
                        v-model="searchQuery"
                        type="text" 
                        placeholder="Search system..." 
                        class="w-full bg-transparent border-none outline-none text-white placeholder-white/40 font-mono text-lg focus:ring-0 focus:outline-none"
                        @keydown.esc="close"
                    />
                    <div class="flex items-center gap-1 text-[10px] text-white/30 font-mono ml-2 shrink-0">
                        <span class="px-1.5 py-0.5 border border-white/10 rounded">ESC</span>
                    </div>
                </div>

                <!-- Results / Menu Items -->
                <div class="p-2 max-h-[60vh] overflow-y-auto custom-scrollbar">
                    <!-- Sections -->
                    <div class="mb-4">
                        <p class="px-3 py-1 text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">Sections</p>
                        <button @click="navigate('/learning')" class="w-full text-left px-3 py-2 rounded-xl hover:bg-white/10 text-white/80 transition-colors flex items-center gap-3">
                            <Gamepad2 class="w-4 h-4 text-nebula-primary" />
                            <span>Práctica (Learning)</span>
                        </button>
                        <button @click="navigate('/')" class="w-full text-left px-3 py-2 rounded-xl hover:bg-white/10 text-white/80 transition-colors flex items-center gap-3">
                            <BookOpen class="w-4 h-4 text-nebula-cyan" />
                            <span>Examen (Desktop)</span>
                        </button>
                        <button v-if="!store.status.nameChangedFromDesktop" @click="openProfile" class="w-full text-left px-3 py-2 rounded-xl hover:bg-white/10 text-white/80 transition-colors flex items-center gap-3">
                            <User class="w-4 h-4 text-emerald-400" />
                            <span>Perfil</span>
                        </button>
                    </div>

                    <!-- System Actions -->
                    <div>
                        <p class="px-3 py-1 text-[10px] uppercase tracking-widest text-white/40 font-bold mb-1">System</p>
                        <button @click="handleSleep" class="w-full text-left px-3 py-2 rounded-xl hover:bg-white/10 text-white/80 transition-colors flex items-center gap-3 group">
                            <Moon class="w-4 h-4 text-yellow-200 group-hover:scale-110 transition-transform" />
                            <span>Sleep Mode</span>
                        </button>
                        <button @click="handleLogout" class="w-full text-left px-3 py-2 rounded-xl hover:bg-white/10 text-white/80 transition-colors flex items-center gap-3 group">
                            <LogOut class="w-4 h-4 text-red-400 group-hover:scale-110 transition-transform" />
                            <span>Cerrar Sesión</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { Search, Gamepad2, BookOpen, User, Moon, LogOut } from 'lucide-vue-next'
import { useGameStore } from '@/stores/useGameStore'
import { useRouter } from 'vue-router'

const store = useGameStore()
const router = useRouter()

const isOpen = ref(false)
const isSleeping = ref(false)
const searchQuery = ref('')
const searchInput = ref(null)

const toggleMenu = () => {
    if (isSleeping.value) return;
    isOpen.value = !isOpen.value
    if (isOpen.value) {
        searchQuery.value = ''
        setTimeout(() => {
            searchInput.value?.focus()
        }, 50)
    }
}

const close = () => {
    isOpen.value = false
}

const handleSleep = () => {
    close()
    isSleeping.value = true
}

const handleLogout = () => {
    // Clean student info
    store.user.fullName = ''
    store.user.nickname = ''
    store.resetGame()
    store.status.hasStarted = false
    close()
    router.push('/')
}

const navigate = (path) => {
    close()
    router.push(path)
}

const openProfile = () => {
    close()
    // Could dispatch an event or open settings modal if on root
    window.dispatchEvent(new CustomEvent('open-settings'))
}

const handleKeydown = (e) => {
    // Trigger on Cmd+K or Ctrl+K
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        toggleMenu()
    }
    
    if (e.key === 'Escape') {
        if (isSleeping.value) {
            // Wake up & reset for security
            isSleeping.value = false
            handleLogout()
        } else if (isOpen.value) {
            close()
        }
    }
}

onMounted(() => {
    window.addEventListener('keydown', handleKeydown)
    window.addEventListener('open-spotlight', toggleMenu)
})

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown)
    window.removeEventListener('open-spotlight', toggleMenu)
})
</script>
