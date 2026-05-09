<template>
    <div class="min-h-screen flex items-center justify-center text-nebula-text relative overflow-hidden">
        <div class="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
            :style="{ backgroundImage: `url(${backgroundImage})` }"></div>

        <!-- Start Screen -->
        <Transition enter-active-class="transition duration-1000 ease-out" enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-700 ease-in"
            leave-from-class="opacity-100" leave-to-class="opacity-0 scale-110">
            <div v-if="showStartScreen"
                class="absolute inset-0 z-50 flex flex-col items-center justify-center bg-nebula-dark/90 backdrop-blur-sm overflow-hidden perspective-1000">
                
                <!-- Floating Background Icons -->
                <div class="absolute inset-0 pointer-events-none overflow-hidden z-0">
                    <div class="absolute top-[15%] left-[10%] opacity-30 animate-[bounce_5s_infinite]">
                        <Sparkles class="w-12 h-12 text-nebula-cyan animate-[spin_10s_linear_infinite]" />
                    </div>
                    <div class="absolute top-[20%] right-[15%] opacity-40 animate-[pulse_3s_ease-in-out_infinite]">
                        <Star class="w-16 h-16 text-nebula-primary animate-[spin_8s_linear_infinite_reverse]" />
                    </div>
                    <div class="absolute bottom-[25%] left-[20%] opacity-30 animate-[bounce_6s_infinite]">
                        <Rocket class="w-10 h-10 text-white animate-[pulse_2s_ease-in-out_infinite]" />
                    </div>
                    <div class="absolute bottom-[20%] right-[25%] opacity-40 animate-[bounce_4s_infinite]">
                        <Zap class="w-14 h-14 text-yellow-400" />
                    </div>
                </div>

                <!-- Logo & Name -->
                <div v-motion :initial="{ opacity: 0, y: -80, rotateX: 45 }"
                    :enter="{ opacity: 1, y: 0, rotateX: 0, transition: { duration: 1000, type: 'spring', bounce: 0.5 } }"
                    class="flex flex-col items-center mb-20 relative z-10 group cursor-default">
                    <div class="relative">
                        <div class="absolute -inset-4 bg-nebula-primary rounded-full blur-2xl opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
                        <img src="/logo.png" alt="Between Words Logo"
                            class="w-32 h-32 sm:w-44 sm:h-44 mb-6 drop-shadow-[0_0_30px_rgba(245,44,245,0.7)] animate-[pulse_3s_ease-in-out_infinite] transform group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <h1
                        class="text-6xl sm:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-nebula-primary via-white to-nebula-cyan font-mono tracking-tighter uppercase drop-shadow-[0_10px_20px_rgba(0,0,0,0.8)] text-center px-4 hover:scale-105 transition-transform duration-300">
                        Between Words
                    </h1>
                    <div class="flex items-center gap-3 mt-6">
                        <div class="h-[1px] w-12 bg-gradient-to-r from-transparent to-nebula-cyan"></div>
                        <p class="text-nebula-cyan tracking-[0.4em] uppercase text-xs sm:text-sm font-mono text-center font-bold">
                            Interactive Learning Experience
                        </p>
                        <div class="h-[1px] w-12 bg-gradient-to-l from-transparent to-nebula-cyan"></div>
                    </div>
                </div>

                <!-- Giant Play Button -->
                <button @click="startGame" v-motion :initial="{ scale: 0, opacity: 0 }"
                    :enter="{ scale: 1, opacity: 1, transition: { duration: 1000, delay: 500, type: 'spring', bounce: 0.6 } }"
                    :hovered="{ scale: 1.15, rotate: 5 }" :tapped="{ scale: 0.9, rotate: -5 }" class="relative group mb-16 z-10 cursor-pointer">
                    <!-- Sonar Rings -->
                    <div class="absolute -inset-4 bg-nebula-cyan rounded-full opacity-0 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite]"></div>
                    <div class="absolute -inset-8 bg-nebula-primary rounded-full opacity-0 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite_1s]"></div>
                    
                    <div class="absolute -inset-6 bg-gradient-to-r from-nebula-primary to-nebula-cyan rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition duration-300 animate-[spin_3s_linear_infinite]"></div>
                    <div class="relative w-32 h-32 sm:w-40 sm:h-40 bg-black/80 backdrop-blur-3xl rounded-full border-2 border-white/30 flex items-center justify-center shadow-[0_0_40px_rgba(0,242,255,0.4)] group-hover:shadow-[0_0_80px_rgba(245,44,245,0.8)] group-hover:border-nebula-primary transition-all duration-300">
                        <Play class="w-14 h-14 sm:w-20 sm:h-20 text-white ml-3 drop-shadow-[0_0_15px_rgba(255,255,255,1)] group-hover:text-nebula-cyan transition-colors duration-300" />
                    </div>
                </button>

                <!-- Go to Learning Button -->
                <div v-motion :initial="{ opacity: 0, y: 50 }"
                    :enter="{ opacity: 1, y: 0, transition: { duration: 800, delay: 900, type: 'spring' } }" class="z-10">
                    <UiButton variant="subtle" size="lg" :icon="GraduationCap" label="REPASAR PRIMERO"
                        @click="navigateTo('/learning')"
                        class="hover:bg-white/10 border border-white/5 hover:border-white/20 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all duration-300" />
                </div>
            </div>
        </Transition>

        <!-- Game Content (Hidden while Start Screen is active) -->
        <div v-show="!showStartScreen" class="absolute inset-0 flex items-center justify-center">
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
import { ref, onMounted } from 'vue';
import { Play, GraduationCap, Sparkles, Star, Rocket, Zap } from 'lucide-vue-next';
import backgroundImage from '~/assets/backgrounds/bg-1.png';
import { useGameStore } from '~/stores/useGameStore';

const store = useGameStore();

// Si el usuario ya pasó del login, saltamos el start screen
const showStartScreen = ref(true);

onMounted(() => {
    if (store.status.currentStep !== 'login') {
        showStartScreen.value = false;
    }
});

const startGame = () => {
    showStartScreen.value = false;
};
</script>