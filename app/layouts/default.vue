<template>
    <div class="h-screen w-screen overflow-hidden font-sans bg-[#050505]">
        <ClientOnly>
            <!-- Pantalla de Inicio -->
            <Transition enter-active-class="transition duration-1000 ease-out" enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-700 ease-in"
                leave-from-class="opacity-100" leave-to-class="opacity-0 scale-110">
                <StartScreen v-if="!store.status.hasStarted" @start="handleStart" @identify="handleIdentify"
                    @learning="goToLearning" />
            </Transition>

            <!-- Main Work Area (Sidebar + Apps) -->
            <div v-if="store.status.hasStarted" :class="[
                'h-full w-full relative transition-colors duration-500 overflow-hidden',
                isAppFullscreen ? 'flex bg-black' : 'flex flex-col sm:flex-row bg-slate-50 dark:bg-nebula-dark'
            ]">
                <!-- Sidebar -->
                <Sidebar v-if="!isAppFullscreen" class="relative z-20" :glass="$route.path === '/'"
                    @settings="showIdentityModal = !showIdentityModal" />

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
                @settings="showIdentityModal = !showIdentityModal" />

            <!-- PROTOCOL_01: Student Identity Modal -->
            <StudentModal :show="showIdentityModal" @registered="handleStudentRegistered" />

            <!-- Onboarding Modal (shown once after fresh identity) -->
            <OnboardingModal :show="showOnboarding" @close="handleOnboardingDone" />

            <!-- Spotlight / System Menu -->
            <SpotlightMenu v-if="store.status.isPcUnlocked" />
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

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'

const route = useRoute()
const store = useGameStore()

const showIdentityModal = ref(false)
const showOnboarding = ref(false)
const isMounted = ref(false)

onMounted(() => {
    isMounted.value = true

    // Initialize store state (restart timers, etc.)
    store.startLockTimer()

    if (store.status.isPcUnlocked || route.path !== '/') {
        store.status.hasStarted = true
    }

    window.addEventListener('open-settings', handleOpenSettings)
})

onUnmounted(() => {
    window.removeEventListener('open-settings', handleOpenSettings)
})

const handleOpenSettings = () => {
    showIdentityModal.value = true
}

watch(() => route.path, (newPath) => {
    if (newPath !== '/') {
        store.status.hasStarted = true
    }
})

const isAppFullscreen = computed(() => route.path === '/' && store.status.isMaximized)

const goToLearning = () => {
    store.status.hasStarted = true
    navigateTo('/learning')
}

// Called when StartScreen emits 'start' (session already active)
const handleStart = () => {
    store.status.hasStarted = true
    
    // Check if onboarding is needed (only if never seen in this session)
    if (!store.status.guideSeen) {
        showOnboarding.value = true
    } else {
        store.status.currentStep = 'login'
        store.status.isPcUnlocked = false
        store.resetSecurity()
    }
}

// Called when StartScreen emits 'identify' (no session yet)
const handleIdentify = () => {
    showIdentityModal.value = true
}

// Called when StudentModal emits 'registered'
const handleStudentRegistered = () => {
    showIdentityModal.value = false
    // Only show onboarding for initial registration, not name edits from the desktop
    if (!store.status.isPcUnlocked) {
        showOnboarding.value = true
    }
}

// Called when OnboardingModal emits 'close'
const handleOnboardingDone = () => {
    showOnboarding.value = false
    store.markGuideAsSeen()
    handleStart()
}
</script>