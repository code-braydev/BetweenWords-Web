<template>
    <div class="min-h-screen flex items-center justify-center text-nebula-text relative overflow-hidden">
        <div class="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
            :style="{ backgroundImage: `url(${backgroundImage})` }"></div>

        <!-- Game Content -->
        <div class="absolute inset-0 flex items-center justify-center">
            <ClientOnly>
                <div v-if="store.status.currentStep === 'login'" v-motion :initial="{ opacity: 0, x: -50 }"
                    :enter="{ opacity: 1, x: 0, transition: { duration: 800, type: 'spring', stiffness: 100, damping: 15 } }"
                    class="absolute top-[40%] left-10 sm:left-24 flex flex-col items-start z-0 hidden lg:flex">
                    <GameClock class="mb-2" />
                    <p
                        class="text-sm text-white/60 font-mono pl-3 mt-2 italic border-l border-nebula-primary/50 ml-1 drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                        The city I have enjoyed the most is...
                    </p>
                </div>
            </ClientOnly>

            <GameLoginSystem v-if="store.status.currentStep === 'login'" class="relative z-10"
                @unlocked="store.unlockPC()" />
            <GameDesktop v-else class="relative z-10 w-full h-full" />
        </div>
    </div>
</template>

<script setup lang="ts">
import backgroundImage from '~/assets/backgrounds/bg-1.png';
import { useGameStore } from '~/stores/useGameStore';

const store = useGameStore();
</script>