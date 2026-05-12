<template>
    <section v-motion :initial="{ opacity: 0, y: 40 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 600, delay: 300, ease: 'easeOut' } }"
        class="p-4 sm:p-6 lg:px-8">
        <div class="max-w-4xl mx-auto">
            <!-- Tabs Navigation -->
            <p class="pl-6 text-xs text-slate-500 dark:text-white/40 font-mono uppercase tracking-widest">
                Selecciona una actividad para comenzar
            </p>
            <div
                class="flex flex-wrap justify-center gap-2 mb-8 sm:mb-12 bg-slate-100 dark:bg-white/5 p-2 rounded-2xl border border-slate-200 dark:border-white/10 backdrop-blur-md">
                <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
                    class="flex-1 sm:flex-none px-4 sm:px-6 py-3 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest transition-all relative group"
                    :class="activeTab === tab.id
                        ? 'bg-nebula-primary text-white shadow-lg shadow-nebula-primary/20'
                        : 'text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white'">
                    <div class="flex items-center justify-center gap-2">
                        <component :is="tab.icon" class="w-4 h-4" />
                        <span class="hidden xs:inline">{{ tab.name }}</span>
                    </div>
                    <div v-if="activeTab === tab.id"
                        class="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full"></div>
                </button>
            </div>


            <!-- Activity Container -->
            <transition name="page" mode="out-in">
                <div :key="activeTab" class="min-h-[400px] sm:min-h-[500px]">
                    <div
                        class="mb-6 sm:mb-8 flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 sm:p-6 bg-nebula-primary/5 border border-nebula-primary/20 rounded-2xl text-center sm:text-left">
                        <div class="p-3 bg-nebula-primary/10 rounded-xl">
                            <Info class="w-6 h-6 text-nebula-primary" />
                        </div>
                        <div>
                            <h3 class="text-sm font-black text-nebula-primary uppercase tracking-widest mb-1">{{
                                currentTabInfo.title }}</h3>
                            <p class="text-[11px] text-slate-600 dark:text-white/60 leading-relaxed">{{
                                currentTabInfo.description }}</p>
                            <div class="mt-3 flex items-center gap-4">
                                <div class="flex items-center gap-1.5">
                                    <Target class="w-3.5 h-3.5 text-nebula-cyan" />
                                    <span
                                        class="text-[10px] font-bold text-slate-500 dark:text-white/40 uppercase tracking-tighter">Objetivo:
                                        {{ currentTabInfo.goal }}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <ClientOnly>
                        <component :is="currentTabInfo.component" />
                    </ClientOnly>
                </div>
            </transition>
        </div>
    </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Type, Headphones, Mic2, Info, Target } from 'lucide-vue-next'
import WritingActivity from '@/components/activities/WritingActivity.vue'
import ListeningActivity from '@/components/activities/ListeningActivity.vue'
import SpeakingActivity from '@/components/activities/SpeakingActivity.vue'

const activeTab = ref('writing')

const tabs = [
    { id: 'writing', name: 'Writing', icon: Type },
    { id: 'listening', name: 'Listening', icon: Headphones },
    { id: 'speaking', name: 'Speaking', icon: Mic2 },
]

const activityInfo = {
    writing: {
        title: "Drag and Drop Sentences",
        description: "Fortalece tu habilidad de escritura organizando correctamente las palabras para formar oraciones coherentes.",
        goal: "Organizar correctamente 10 oraciones propuestas.",
        component: WritingActivity
    },
    listening: {
        title: "Listen and Select",
        description: "Desarrolla tu comprensión auditiva escuchando audios y seleccionando la respuesta correcta entre varias opciones.",
        goal: "Identificar la respuesta correcta mediante la escucha atenta.",
        component: ListeningActivity
    },
    speaking: {
        title: "Speaking & Pronunciation",
        description: "Mejora tu fluidez repitiendo oraciones utilizando el micrófono. Aria comparará tu pronunciación en tiempo real.",
        goal: "Alcanzar una similitud superior al 80% en las frases.",
        component: SpeakingActivity
    }
}

const currentTabInfo = computed(() => activityInfo[activeTab.value])
</script>

<style scoped>
.page-enter-active,
.page-leave-active {
    transition: all 0.3s ease;
}

.page-enter-from {
    opacity: 0;
    transform: translateY(10px);
}

.page-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}
</style>