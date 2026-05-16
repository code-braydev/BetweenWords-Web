<template>
    <div class="h-full w-full flex flex-col items-center justify-center p-4">
        <ClientOnly>
            <!-- GNOME Style Clock & Hint -->
            <div v-motion :initial="{ opacity: 0, y: -20 }" :enter="{ opacity: 1, y: 0, transition: { duration: 800 } }"
                class="flex flex-col items-center mb-12 sm:mb-20">
                <GameClock />
                <p class="mt-4 px-6 py-2 bg-black/20 backdrop-blur-md border border-white/5 rounded-full text-[10px] sm:text-xs text-white/60 font-mono italic tracking-wide">
                    "I have visited the city known as the <span class="text-nebula-cyan font-bold">Pearl of the Sinú</span>."
                </p>
            </div>

            <UiCard v-motion :initial="{ opacity: 0, scale: 0.95 }" :enter="{ opacity: 1, scale: 1 }"
                class="w-full max-w-[320px] shadow-2xl relative z-10" :glass="true">

                <div class="flex flex-col items-center gap-6 py-4">
                    <div class="relative group">
                        <div
                            class="absolute -inset-1 bg-gradient-to-r from-nebula-primary to-nebula-cyan rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000">
                        </div>
                        <div
                            class="relative w-20 h-20 rounded-full overflow-hidden bg-nebula-dark/50 border border-white/10">
                            <img src="/images/avatar.jpg" class="w-full h-full object-cover" alt="User" />
                        </div>
                    </div>

                    <div class="text-center">
                        <h2 class="text-white font-mono text-base tracking-[0.2em] uppercase">
                            {{ store.user.nickname || 'GUEST_USER' }}
                        </h2>
                    </div>

                    <form @submit.prevent="handleAccess" class="w-full space-y-4">
                        <div class="relative">
                            <UiInput v-model="password" type="password" label="Contraseña de la PC" placeholder="••••••••"
                                :icon="Lock" :glass="true"
                                :error="store.security.isLocked ? `SISTEMA BLOQUEADO: ${store.security.lockTime}s` : loginError"
                                :disabled="store.security.isLocked" />
                            
                            <div v-if="store.security.isLocked" 
                                class="absolute inset-0 bg-black/40 backdrop-blur-[2px] rounded-xl flex items-center justify-center">
                                <span class="text-[10px] font-mono text-red-400 animate-pulse uppercase tracking-tighter">Acceso restringido</span>
                            </div>
                        </div>

                        <UiButton type="submit" label="DESBLOQUEAR" variant="primary"
                            class="w-full shadow-lg shadow-nebula-primary/20" :icon="LogIn" :loading="isLoading"
                            :disabled="store.security.isLocked || !password" />
                    </form>

                    <div class="flex gap-2">
                        <span class="w-1.5 h-1.5 rounded-full" :class="store.security.attempts > 0 ? 'bg-red-500 shadow-[0_0_5px_red]' : 'bg-white/10'"></span>
                        <span class="w-1.5 h-1.5 rounded-full" :class="store.security.attempts > 1 ? 'bg-red-500 shadow-[0_0_5px_red]' : 'bg-white/10'"></span>
                        <span class="w-1.5 h-1.5 rounded-full animate-pulse" :class="store.security.attempts > 2 ? 'bg-red-500 shadow-[0_0_5px_red]' : 'bg-white/10'"></span>
                    </div>
                </div>
            </UiCard>
        </ClientOnly>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Lock, LogIn } from 'lucide-vue-next'
import { useGameStore } from '@/stores/useGameStore'

const store = useGameStore()
const password = ref('')
const loginError = ref('')
const isLoading = ref(false)

const emit = defineEmits(['unlocked'])

const handleAccess = async () => {
    if (store.security.isLocked) return

    isLoading.value = true
    loginError.value = ''

    // Simulated check
    setTimeout(() => {
        if (password.value.toLowerCase().trim() === 'monteria') {
            emit('unlocked')
            password.value = ''
        } else {
            password.value = ''
            loginError.value = 'ERROR: Credenciales inválidas'
            store.registerFailure()
        }
        isLoading.value = false
    }, 800)
}
</script>