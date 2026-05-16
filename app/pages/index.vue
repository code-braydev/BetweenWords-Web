<template>
    <div v-if="sessionState === 'loading'"
        class="fixed inset-0 z-[999] flex items-center justify-center bg-[#050505] text-white px-4">
        <div
            class="max-w-md rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl p-8 text-center shadow-2xl">
            <p class="text-xs uppercase tracking-[0.35em] text-white/40 mb-3 font-mono">Validando sesión</p>
            <h1 class="text-2xl font-black mb-2">Comprobando enlace de práctica</h1>
            <p class="text-white/60">Espera un momento mientras verificamos tu acceso.</p>
        </div>
    </div>

    <div v-else-if="sessionState === 'invalid'"
        class="fixed inset-0 z-[999] flex items-center justify-center bg-[#050505] text-white px-4">
        <div
            class="max-w-xl rounded-3xl border border-red-500/20 bg-red-500/10 backdrop-blur-2xl p-8 text-center shadow-2xl">
            <p class="text-xs uppercase tracking-[0.35em] text-red-300/70 mb-3 font-mono">Acceso no disponible</p>
            <h1 class="text-2xl sm:text-3xl font-black mb-4">Lo sentimos, este link de práctica no existe o ha expirado.
                Contacta a tu docente.</h1>
            <p class="text-white/70">Si recibiste este enlace recientemente, pide a tu docente que genere uno nuevo.</p>
        </div>
    </div>

    <div class="min-h-screen flex items-center justify-center text-nebula-text relative overflow-hidden">
        <div class="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
            :style="{ backgroundImage: `url(${backgroundImage})` }"></div>

        <!-- Game Content -->
        <div class="absolute inset-0 flex items-center justify-center">
            <GameLoginSystem v-if="store.status.currentStep === 'login'" class="relative z-10"
                @unlocked="store.unlockPC()" />
            <GameDesktop v-else class="relative z-10 w-full h-full" @settings="$emit('settings')" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import backgroundImage from '~/assets/backgrounds/bg-1.png';
import { useGameStore } from '~/stores/useGameStore';

const route = useRoute();
const store = useGameStore();
const emit = defineEmits(['settings']);

const sessionState = ref<'idle' | 'loading' | 'valid' | 'invalid'>('idle');

const sessionId = computed(() => {
    const value = route.query.session;
    return Array.isArray(value) ? value[0] ?? '' : (value ?? '');
});

const validateSession = async () => {
    if (!sessionId.value) {
        sessionState.value = 'idle';
        store.clearSession();
        return;
    }

    sessionState.value = 'loading';

    try {
        const response = await $fetch<{ valid: boolean; session?: Record<string, any> }>(`/api/sessions/${sessionId.value}`);

        if (!response.valid || !response.session) {
            store.clearSession();
            sessionState.value = 'invalid';
            return;
        }

        store.setSession({
            id: response.session.id ?? sessionId.value,
            topic: response.session.topic ?? response.session.theme ?? '',
            sheetUrl: response.session.sheetUrl ?? '',
            expiresAt: response.session.expiresAt ?? 0,
        });
        sessionState.value = 'valid';
    } catch (error) {
        console.error('Session validation failed:', error);
        store.clearSession();
        sessionState.value = 'invalid';
    }
};

onMounted(() => {
    void validateSession();
});

watch(sessionId, () => {
    void validateSession();
});
</script>