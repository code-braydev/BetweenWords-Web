<template>
    <div class="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#050505] overflow-hidden transition-all duration-[1500ms] ease-in-out"
        :class="{ 'opacity-0 scale-95': isEntering }">

        <!-- Animated Background Starfield -->
        <div class="absolute inset-0 z-0">
            <ClientOnly>
                <div class="stars-container">
                    <div v-for="n in 40" :key="n" class="star" :style="generateStarStyle()"></div>
                </div>
            </ClientOnly>
            <div class="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60"></div>
        </div>

        <!-- Enhanced Floating Background Icons -->
        <div class="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-20">
            <ClientOnly>
                <div v-for="(icon, index) in floatingIcons" :key="index" class="absolute animate-float-random"
                    :style="icon.style">
                    <component :is="icon.component" :class="icon.class" />
                </div>
            </ClientOnly>
        </div>

        <!-- Logo & Name -->
        <div v-motion :initial="{ opacity: 0, y: -80, rotateX: 45 }"
            :enter="{ opacity: 1, y: 0, rotateX: 0, transition: { duration: 1000, type: 'spring', bounce: 0.5 } }"
            class="flex flex-col items-center mb-12 sm:mb-24 relative z-10 group cursor-default">
            <div class="relative">
                <div
                    class="absolute -inset-10 bg-nebula-primary rounded-full blur-[80px] opacity-5 group-hover:opacity-20 transition-opacity duration-1000">
                </div>
                <img src="/logo.png" alt="Between Words Logo"
                    class="w-24 h-24 sm:w-44 sm:h-44 mb-4 sm:mb-6 drop-shadow-[0_0_15px_rgba(245,44,245,0.3)] animate-[bounce_5s_infinite] transform group-hover:scale-105 transition-transform duration-700" />
            </div>
            <h1
                class="text-4xl sm:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-nebula-primary via-white to-nebula-cyan font-mono tracking-tighter uppercase drop-shadow-[0_5px_10px_rgba(0,0,0,0.5)] text-center px-4 hover:scale-105 transition-transform duration-500">
                Between Words
            </h1>
            <div class="flex items-center gap-4 mt-4 sm:mt-6">
                <div class="h-[1px] w-8 sm:w-12 bg-nebula-cyan/20"></div>
                <p
                    class="text-nebula-cyan/60 tracking-[0.3em] sm:tracking-[0.5em] uppercase text-[9px] sm:text-xs font-mono text-center font-bold">
                    Interactive Learning Experience
                </p>
                <div class="h-[1px] w-8 sm:w-12 bg-nebula-cyan/20"></div>
            </div>
        </div>

        <!-- Giant Play Button -->
        <button @click="handleStart" v-motion :initial="{ scale: 0, opacity: 0 }"
            :enter="{ scale: 1, opacity: 1, transition: { duration: 1200, delay: 500, type: 'spring', bounce: 0.4 } }"
            :hovered="{ scale: 1.05 }" :tapped="{ scale: 0.95 }" class="relative group mb-12 sm:mb-32 z-20 cursor-pointer">

            <!-- Sonar Rings -->
            <div class="absolute -inset-4 bg-nebula-cyan/5 rounded-full animate-[ping_4s_infinite]"></div>

            <!-- Orbiting Particle -->
            <div class="absolute inset-0 animate-[spin_8s_linear_infinite]">
                <div class="absolute -top-1 left-1/2 w-1.5 h-1.5 bg-white/20 rounded-full"></div>
            </div>

            <div
                class="absolute -inset-4 bg-gradient-to-r from-nebula-primary/10 via-nebula-cyan/10 to-nebula-primary/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition duration-700 animate-[spin_6s_linear_infinite]">
            </div>

            <div
                class="relative w-32 h-32 sm:w-48 sm:h-48 bg-black/10 backdrop-blur-xl rounded-full border border-white/5 flex items-center justify-center shadow-xl group-hover:border-nebula-primary/20 transition-all duration-700 overflow-hidden">
                <Play
                    class="w-10 h-10 sm:w-20 sm:h-20 text-white/80 ml-2 sm:ml-3 group-hover:text-white transition-all duration-700" />
            </div>
        </button>

        <!-- Go to Learning Button -->
        <div v-motion :initial="{ opacity: 0, y: 30 }"
            :enter="{ opacity: 1, y: 0, transition: { duration: 1000, delay: 1000 } }" class="z-10 mt-4 sm:mt-8 flex flex-col sm:flex-row gap-4">
            <UiButton variant="subtle" size="sm" :icon="GraduationCap" label="REPASAR PRIMERO"
                @click="$emit('learning')"
                class="opacity-60 hover:opacity-100 border border-white/5 hover:border-white/10 transition-all duration-700 px-6 sm:px-8 py-3 sm:py-4 text-[10px] sm:text-xs tracking-widest uppercase z-20" />
            
            <UiButton variant="subtle" size="sm" :icon="Users" label="MODO PROFESOR"
                @click="navigateTo('/professor')"
                class="opacity-60 hover:opacity-100 border border-white/5 hover:border-white/10 transition-all duration-700 px-6 sm:px-8 py-3 sm:py-4 text-[10px] sm:text-xs tracking-widest uppercase z-20" />
        </div>

        <!-- Colorful Explosion Tunnel Layer (Performance Optimized) -->
        <div v-if="isEntering" 
            class="fixed inset-0 z-[100] pointer-events-none flex items-center justify-center bg-[#050505]/20 animate-fade-in">
            <div class="w-20 h-20 rounded-full bg-gradient-to-r from-nebula-primary via-white to-nebula-cyan blur-3xl scale-0 animate-explosion"></div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
    Play, GraduationCap, Sparkles, Star, Rocket, Zap,
    Orbit, Atom, Brain, Compass, Trophy, Wand2,
    Gamepad2, BookOpen, Microscope, Palette, Lightbulb,
    Cpu, Globe, MessageSquare, Users
} from 'lucide-vue-next';


const emit = defineEmits(['start', 'learning']);
const isEntering = ref(false);

const handleStart = () => {
    isEntering.value = true;
    setTimeout(() => {
        emit('start');
    }, 800); 
};

const floatingIcons = [
    { component: Sparkles, class: 'w-8 h-8 text-nebula-cyan', style: { top: '12%', left: '8%', animationDelay: '0s' } },
    { component: Star, class: 'w-10 h-10 text-nebula-primary', style: { top: '18%', right: '12%', animationDelay: '1s' } },
    { component: Rocket, class: 'w-6 h-6 text-white', style: { bottom: '22%', left: '18%', animationDelay: '2s' } },
    { component: Zap, class: 'w-8 h-8 text-yellow-400', style: { bottom: '18%', right: '22%', animationDelay: '0.5s' } },
    { component: Orbit, class: 'w-12 h-12 text-nebula-cyan/30', style: { top: '45%', left: '10%', animationDelay: '1.5s' } },
    { component: Atom, class: 'w-8 h-8 text-purple-400', style: { bottom: '45%', right: '8%', animationDelay: '2.5s' } },
    { component: Brain, class: 'w-10 h-10 text-pink-400', style: { top: '8%', right: '35%', animationDelay: '3s' } },
    { component: Compass, class: 'w-6 h-6 text-emerald-400', style: { bottom: '8%', left: '45%', animationDelay: '1.2s' } },
    { component: Trophy, class: 'w-10 h-10 text-amber-400', style: { top: '65%', right: '18%', animationDelay: '0.8s' } },
    { component: Wand2, class: 'w-8 h-8 text-indigo-400', style: { top: '28%', left: '28%', animationDelay: '2.2s' } },
    { component: Gamepad2, class: 'w-10 h-10 text-rose-400', style: { top: '80%', left: '10%', animationDelay: '1.8s' } },
    { component: BookOpen, class: 'w-8 h-8 text-blue-400', style: { top: '5%', left: '60%', animationDelay: '0.3s' } },
    { component: Microscope, class: 'w-9 h-9 text-cyan-400', style: { bottom: '35%', left: '5%', animationDelay: '1.1s' } },
    { component: Palette, class: 'w-8 h-8 text-orange-400', style: { top: '35%', right: '25%', animationDelay: '2.8s' } },
    { component: Lightbulb, class: 'w-11 h-11 text-yellow-300', style: { bottom: '10%', right: '45%', animationDelay: '0.6s' } },
    { component: Globe, class: 'w-10 h-10 text-sky-400', style: { top: '55%', left: '35%', animationDelay: '3.2s' } },
    { component: MessageSquare, class: 'w-8 h-8 text-teal-400', style: { top: '15%', left: '45%', animationDelay: '1.4s' } },
    { component: Cpu, class: 'w-9 h-9 text-slate-400', style: { bottom: '60%', right: '30%', animationDelay: '2.1s' } },
];

const generateStarStyle = () => {
    return {
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        width: `${Math.random() * 2 + 0.5}px`,
        height: `${Math.random() * 2 + 0.5}px`,
        animationDelay: `${Math.random() * 5}s`,
        animationDuration: `${Math.random() * 4 + 3}s`,
        transform: 'translateZ(0)'
    };
};
</script>

<style scoped>
.stars-container {
    position: absolute;
    inset: 0;
}

.star {
    position: absolute;
    background: white;
    border-radius: 50%;
    opacity: 0.2;
    animation: twinkle linear infinite;
    will-change: opacity;
}

@keyframes twinkle {

    0%,
    100% {
        opacity: 0.1;
    }

    50% {
        opacity: 0.4;
    }
}

@keyframes fade-in {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

@keyframes explosion {
    0% { transform: scale(0); opacity: 0; }
    30% { opacity: 1; }
    100% { transform: scale(100); opacity: 0; }
}

.animate-fade-in {
    animation: fade-in 0.3s ease-out forwards;
}

.animate-explosion {
    animation: explosion 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
}

@keyframes float-random {

    0%,
    100% {
        transform: translate(0, 0);
    }

    25% {
        transform: translate(10px, -10px);
    }

    50% {
        transform: translate(-5px, -20px);
    }

    75% {
        transform: translate(-15px, -5px);
    }
}

.animate-float-random {
    animation: float-random 12s ease-in-out infinite;
    will-change: transform;
}
</style>
