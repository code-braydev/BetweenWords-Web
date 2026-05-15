<template>
    <div class="h-full w-full flex items-center justify-center p-4">
        <ClientOnly>
            <UiCard v-motion :initial="{ opacity: 0, y: 50 }" :enter="{ opacity: 1, y: 0 }"
                class="w-full max-w-[350px] shadow-2xl" :glass="true">

                <div class="flex flex-col items-center gap-6 py-4">
                    <div class="relative group">
                        <div
                            class="absolute -inset-1 bg-gradient-to-r from-nebula-primary to-nebula-cyan rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000">
                        </div>
                        <div
                            class="relative w-24 h-24 rounded-full overflow-hidden bg-nebula-dark/50 border border-white/10">
                            <img src="/images/avatar.jpg" class="w-full h-full object-cover" alt="User" />
                        </div>
                    </div>

                    <div class="text-center">
                        <h2 class="text-white font-mono text-lg tracking-[0.2em] uppercase">
                            {{ store.user.nickname || 'GUEST_USER' }}
                        </h2>
                        <p class="text-[10px] text-nebula-cyan font-mono opacity-60 tracking-widest">
                            SYSTEM_ID: NEBULA-01
                        </p>
                    </div>

                    <form @submit.prevent="handleAccess" class="w-full space-y-4">
                        <UiInput v-model="password" type="password" label="Password" placeholder="••••••••"
                            :icon="Lock" :glass="true"
                            :error="store.security.isLocked ? `LOCKED: ${store.security.lockTime}s` : loginError"
                            :disabled="store.security.isLocked" />


                        <UiButton type="submit" label="Unlock" variant="primary"
                            class="w-full shadow-lg shadow-nebula-primary/20" :icon="LogIn" :loading="isLoading"
                            :disabled="store.security.isLocked || !password" />
                    </form>

                    <div class="pt-4 flex flex-col items-center gap-2">
                        <p class="text-[9px] text-white/30 font-mono italic text-center">
                            "The virus **has arrived** to the city."
                        </p>
                        <div class="flex gap-2">
                            <span class="w-2 h-2 rounded-full bg-red-500/40 animate-pulse"></span>
                            <span class="w-2 h-2 rounded-full bg-yellow-500/40"></span>
                            <span class="w-2 h-2 rounded-full bg-green-500/40"></span>
                        </div>
                    </div>
                </div>
            </UiCard>
        </ClientOnly>
    </div>
</template>

<script setup>
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

    setTimeout(() => {
        if (password.value.toLowerCase() === 'monteria') {
            emit('unlocked')
            password.value = ''
        } else {
            password.value = ''
            loginError.value = 'I have visited the city known as the Pearl of the Sinú.'
            store.registerFailure()
        }
        isLoading.value = false
    }, 800)
}
</script>