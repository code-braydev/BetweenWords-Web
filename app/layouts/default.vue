<template>
    <div class="h-screen w-screen overflow-hidden font-sans bg-[#050505]">
        <ClientOnly>
            <!-- Pantalla de Inicio -->
            <Transition enter-active-class="transition duration-1000 ease-out" enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-700 ease-in"
                leave-from-class="opacity-100" leave-to-class="opacity-0 scale-110">
                <StartScreen v-if="!store.status.hasStarted" @start="handleStart" @learning="goToLearning" />
            </Transition>

            <!-- Main Work Area (Sidebar + Apps) -->
            <div v-if="store.status.hasStarted" :class="[
                'h-full w-full relative transition-colors duration-500 overflow-hidden',
                isAppFullscreen ? 'flex bg-black' : 'flex flex-col sm:flex-row bg-slate-50 dark:bg-nebula-dark'
            ]">
                <!-- Sidebar -->
                <Sidebar v-if="!isAppFullscreen" class="relative z-20" :glass="$route.path === '/'"
                    @settings="showSettingsModal = !showSettingsModal" />

                <!-- App Container -->
                <main :class="[
                    'relative z-10 overflow-hidden',
                    isAppFullscreen ? 'fixed inset-0 w-screen h-screen' : 'flex-1'
                ]">
                    <!-- Background Dinámico (Desktop Only) -->
                    <div v-if="$route.path === '/'"
                        class="absolute inset-0 bg-space-desktop bg-cover bg-center transition-all duration-700"
                        :class="{ 'blur-sm scale-105 opacity-50': store.status.currentStep === 'login' }">
                        <div
                            class="absolute inset-0 bg-gradient-to-br from-nebula-dark/40 via-transparent to-nebula-dark/80">
                        </div>
                    </div>

                    <div :class="[
                        'relative z-10 h-full w-full flex flex-col',
                        isAppFullscreen ? 'p-0 overflow-hidden' : 'overflow-y-auto custom-scrollbar pb-4 sm:pb-0'
                    ]">
                        <div class="flex-1 min-h-0">
                            <slot />
                        </div>
                    </div>
                </main>
            </div>

            <!-- macOS Style Dock (Only on Desktop after login) -->
            <GameTaskbar v-if="store.status.isPcUnlocked && $route.path === '/' && !isAppFullscreen"
                @settings="showSettingsModal = !showSettingsModal" />

            <!-- Registro de Estudiante / Settings -->
            <StudentModal :show="shouldShowModal" @registered="showSettingsModal = false"
                @cancel="showSettingsModal = false" />
        </ClientOnly>
    </div>
</template>

<style>
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(245, 44, 245, 0.4);
    border-radius: 10px;
}

@media (prefers-color-scheme: dark) {
    .custom-scrollbar::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.2);
    }

    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(245, 44, 245, 0.6);
    }
}
</style>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import StudentModal from '@/components/StudentModal.vue'

const route = useRoute()
const store = useGameStore()

const isUserInfoComplete = computed(() => store.user.fullName && store.user.grade && store.user.group)
const showSettingsModal = ref(false)
const isMounted = ref(false)
onMounted(() => {
    isMounted.value = true
    if (store.status.isPcUnlocked || route.path !== '/') {
        store.status.hasStarted = true
    }
})

watch(() => route.path, (newPath) => {
    if (newPath !== '/') {
        store.status.hasStarted = true
    }
})

const shouldShowModal = computed(() => {
    if (!isMounted.value) return false
    return showSettingsModal.value
})

const isAppFullscreen = computed(() => route.path === '/' && store.status.isMaximized)

const goToLearning = () => {
    store.status.hasStarted = true
    navigateTo('/learning')
}

const handleStart = () => {
    store.status.hasStarted = true
    store.status.currentStep = 'login'
    store.status.isPcUnlocked = false
    store.status.isWhatsappUnlocked = false
    store.status.isFileUnlocked = false
    store.status.isMaximized = false
    store.status.runningApps = []
    store.resetSecurity()
}
</script>