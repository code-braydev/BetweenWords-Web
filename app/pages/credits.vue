<template>
    <div
        class="min-h-screen relative overflow-hidden bg-transparent flex flex-col items-center justify-center p-8 transition-colors duration-500">
        <div
            class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-nebula-primary/10 rounded-full blur-[120px] animate-pulse pointer-events-none opacity-0 dark:opacity-100">
        </div>
        <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-nebula-secondary/10 rounded-full blur-[120px] animate-pulse pointer-events-none opacity-0 dark:opacity-100"
            style="animation-delay: 2s;"></div>

        <div class="relative z-10 w-full max-w-6xl mx-auto flex flex-col items-center">
            <header v-motion :initial="{ opacity: 0, y: 30 }"
                :enter="{ opacity: 1, y: 0, transition: { duration: 600, ease: 'easeOut' } }" class="text-center mb-16">
                <h1
                    class="text-7xl font-black uppercase tracking-[-0.02em] mb-4 bg-gradient-to-r from-nebula-primary via-nebula-cyan to-nebula-secondary bg-clip-text text-transparent drop-shadow-sm">
                    Créditos
                </h1>
                <p class="text-slate-600 dark:text-nebula-cyan text-xl font-light max-w-2xl mx-auto leading-relaxed">
                    El equipo detrás de la visión. Combinando tecnología, diseño y estrategia para una experiencia única
                    en la <span
                        class="text-slate-900 dark:text-white font-bold underline decoration-nebula-primary/40 underline-offset-4">Aula
                        de clase</span>.
                </p>
            </header>

            <div v-motion :initial="{ opacity: 0, scale: 0.95 }"
                :enter="{ opacity: 1, scale: 1, transition: { delay: 200, duration: 800 } }"
                class="mb-16 w-full max-w-2xl">
                <UiCard
                    body-class="flex flex-col items-center text-center p-10 group relative overflow-hidden transition-all duration-500">
                    <div
                        class="absolute -inset-1 bg-gradient-to-r from-nebula-primary to-nebula-secondary rounded-2xl blur opacity-0 group-hover:opacity-10 dark:group-hover:opacity-30 transition duration-700">
                    </div>

                    <img src="/dev/PeopleBrayan.png" alt="Brayan Avila Orozco" class="w-40 h-40 rounded-full object-cover mb-6 
                    group-hover:scale-110 transition-all duration-300 ease-out 
                    will-change-transform antialiased [image-rendering:high-quality]
                    shadow-xl shadow-nebula-primary/20 relative z-10">


                    <h2 class="text-5xl font-black text-slate-900 dark:text-white mb-2 tracking-tight relative z-10">
                        BrayDev</h2>
                    <UiBadge variant="primary"
                        class="mb-6 font-mono tracking-[0.2em] uppercase text-xs py-1.5 px-6 bg-nebula-primary/10 dark:bg-nebula-primary/30 border-nebula-primary/50 text-nebula-primary dark:text-white shadow-lg shadow-nebula-primary/10">
                        Brayan Avila Orozco
                    </UiBadge>

                    <div
                        class="h-px w-48 bg-gradient-to-r from-transparent via-nebula-primary to-transparent mb-6 relative z-10 opacity-30 dark:opacity-50">
                    </div>
                    <p
                        class="text-indigo-600 dark:text-nebula-cyan text-base uppercase font-black tracking-[0.4em] relative z-10">
                        Lead Developer & Full Stack Architect
                    </p>
                </UiCard>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                <!-- Daniela -->
                <div v-motion :initial="{ opacity: 0, y: 20 }"
                    :enter="{ opacity: 1, y: 0, transition: { delay: 400 } }">
                    <UiCard body-class="flex flex-col items-center text-center p-8 group">
                        <img src="/dev/PeopleDaniela.png" alt="Daniela Baron" class="w-32 h-32 rounded-full object-cover mb-6 
                    group-hover:scale-110 transition-all duration-300 ease-out 
                    will-change-transform antialiased [image-rendering:high-quality]
                    shadow-lg shadow-indigo-500/5 dark:shadow-nebula-cyan/10">

                        <h3 class="text-3xl font-bold text-slate-900 dark:text-white mb-2 transition-colors">Daniela
                            Baron</h3>
                        <p
                            class="text-indigo-500 dark:text-nebula-cyan font-mono text-[10px] uppercase tracking-widest mb-4 font-bold">
                            UI/UX Designer</p>
                        <p class="text-slate-500 dark:text-nebula-text/80 text-sm leading-relaxed font-medium">
                            Especialista en diseño visual y experiencia de usuario frontend.</p>
                    </UiCard>
                </div>

                <!-- Jesus -->
                <div v-motion :initial="{ opacity: 0, y: 20 }"
                    :enter="{ opacity: 1, y: 0, transition: { delay: 550 } }">
                    <UiCard body-class="flex flex-col items-center text-center p-8 group">
                        <img src="/dev/PeopleJesus.png" alt="Jesus Diaz Toro" class="w-32 h-32 rounded-full object-cover mb-6 
                    group-hover:scale-110 transition-all duration-300 ease-out 
                    will-change-transform antialiased [image-rendering:high-quality]
                    shadow-lg shadow-fuchsia-500/5 dark:shadow-nebula-primary/10">

                        <h3 class="text-3xl font-bold text-slate-900 dark:text-white mb-2 transition-colors">
                            Jesus Diaz
                        </h3>

                        <p
                            class="text-fuchsia-500 dark:text-nebula-primary font-mono text-[10px] uppercase tracking-widest mb-4 font-bold">
                            Research & Content
                        </p>

                        <p class="text-slate-500 dark:text-nebula-text/80 text-sm leading-relaxed font-medium">
                            Estrategia de contenidos técnicos e investigación especializada.
                        </p>
                    </UiCard>
                </div>

                <!-- Erick -->
                <div v-motion :initial="{ opacity: 0, y: 20 }"
                    :enter="{ opacity: 1, y: 0, transition: { delay: 700 } }">
                    <UiCard body-class="flex flex-col items-center text-center p-8 group">
                        <img src="/dev/PeopleErick.png" alt="Erick Lopez" class="w-32 h-32 rounded-full object-cover mb-6 
                    group-hover:scale-110 transition-all duration-300 ease-out 
                    will-change-transform antialiased [image-rendering:high-quality]
                    shadow-lg shadow-fuchsia-500/5 dark:shadow-nebula-primary/10">
                        <h3 class="text-3xl font-bold text-slate-900 dark:text-white mb-2 transition-colors">Erick Lopez
                        </h3>
                        <p
                            class="text-purple-500 dark:text-nebula-secondary font-mono text-[10px] uppercase tracking-widest mb-4 font-bold">
                            Multimedia Resources</p>
                        <p class="text-slate-500 dark:text-nebula-text/80 text-sm leading-relaxed font-medium">Gestión
                            de activos digitales y optimización de recursos multimedia.</p>
                    </UiCard>
                </div>
            </div>
        </div>
    </div>
    <Footer />
</template>


<script setup>
import { Palette, Search, Image } from 'lucide-vue-next'
</script>

<style scoped>
.animate-pulse {
    animation: pulse 10s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {

    0%,
    100% {
        opacity: 0.1;
        transform: scale(1);
    }

    50% {
        opacity: 0.25;
        transform: scale(1.1);
    }
}
</style>