<template>
    <div class="h-screen w-screen overflow-hidden font-sans bg-[#050505]">
        <!-- Pantalla de Inicio: Solo este componente se muestra al inicializar -->
        <Transition enter-active-class="transition duration-1000 ease-out" enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-700 ease-in"
            leave-from-class="opacity-100" leave-to-class="opacity-0 scale-110">
            <StartScreen v-if="!hasStarted" @start="hasStarted = true" @learning="goToLearning" />
        </Transition>

        <!-- El resto de la app (Sidebar, Slot, etc) solo se monta si hasStarted es true -->
        <div v-if="hasStarted"
            class="h-full w-full flex bg-slate-50 dark:bg-nebula-dark relative transition-colors duration-500 overflow-hidden">
            <!-- Background Dinámico -->
            <div class="absolute inset-0 bg-space-desktop bg-cover bg-center transition-all duration-700 opacity-0 dark:opacity-100"
                :class="{ 'blur-sm scale-105': store.status.currentStep === 'login' }">
                <div class="absolute inset-0 bg-gradient-to-br from-nebula-dark/40 via-transparent to-nebula-dark/80">
                </div>
            </div>

            <!-- Sidebar solo visible tras iniciar -->
            <Sidebar class="relative z-20" :glass="$route.path === '/'"
                @settings="showSettingsModal = !showSettingsModal" />

            <main class="flex-1 relative z-10">
                <div class="relative z-10 h-full w-full overflow-y-auto custom-scrollbar flex flex-col">
                    <div class="flex-1">
                        <slot />
                    </div>
                </div>
            </main>
        </div>
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
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useGameStore } from '@/stores/useGameStore'
import { useVoice } from '@/composables/useVoice'

const route = useRoute()
const store = useGameStore()
const { speak } = useVoice()

const isUserInfoComplete = computed(() => store.user.fullName && store.user.grade && store.user.group)
const isModalForced = computed(() => !isUserInfoComplete.value)
const showSettingsModal = ref(false)
const isMounted = ref(false)

// Estado inicial: Falso para mostrar el botón de Play primero
const hasStarted = ref(false)

onMounted(() => {
    isMounted.value = true

    // Si ya hay progreso real (PC desbloqueado) o no estamos en el index, saltamos el inicio
    if (store.status.isPcUnlocked || route.path !== '/') {
        hasStarted.value = true
    }
})

const shouldShowModal = computed(() => {
    if (!isMounted.value) return false
    return showSettingsModal.value || isModalForced.value
})

const goToLearning = () => {
    hasStarted.value = true
    navigateTo('/learning')
}
</script>