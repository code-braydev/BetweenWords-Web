<template>
    <UiModal :show="show" title="MISSION_BRIEFING: ONBOARDING_" variant="transparent" :preventClose="true">
        <div class="space-y-6">
            <!-- Step indicators -->
            <div class="flex items-center justify-center gap-2 mb-2">
                <div v-for="s in 3" :key="s"
                    class="w-2 h-2 rounded-full transition-all duration-300"
                    :class="s === step ? 'bg-nebula-primary scale-125 shadow-neon-fuchsia' : 'bg-white/10'" />
            </div>

            <!-- Single Mission Briefing Content as requested -->
            <div v-if="step === 1" class="space-y-4">
                <div class="flex items-center gap-3 mb-2">
                    <div class="p-2 bg-nebula-primary/20 rounded-lg">
                        <Rocket class="w-6 h-6 text-nebula-cyan" />
                    </div>
                    <h3 class="text-white font-mono text-sm font-black uppercase tracking-widest">
                        MISSION_PROTOCOL: BRIEFING_
                    </h3>
                </div>
                <p class="text-white/80 text-xs font-mono leading-relaxed p-4 bg-white/5 border border-white/10 rounded-xl">
                    Tu misión ha comenzado. Tu objetivo es explorar la simulación del sistema, usar tu curiosidad para encontrar el examen dentro del entorno virtual y completarlo. Tus notas se registrarán de manera automática e inmediata con el profesor al finalizar. Investiga, descubre y hackea el sistema.
                </p>
                <div class="p-3 bg-nebula-primary/5 rounded-xl border border-nebula-primary/10">
                    <p class="text-[10px] text-nebula-primary font-mono text-center">
                        <strong>STATUS:</strong> READY_FOR_DEPLOYMENT
                    </p>
                </div>
            </div>

            <!-- Steps for UI navigation consistency if needed, but the user requested a specific text -->
            <!-- We will simplify to a single step if the text is the only requirement, or distribute if logical -->
            <!-- I'll stick to the specific text in a polished way -->

            <div class="pt-4 border-t border-white/5 flex justify-end items-center gap-3">
                <UiButton label="¡Entendido, Iniciar Misión!" variant="primary" size="lg"
                    :icon="Rocket" @click="handleComplete" />
            </div>
        </div>
    </UiModal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { BookOpen, Lock, Monitor, Rocket } from 'lucide-vue-next'

defineProps({ show: Boolean })
defineEmits(['close'])

const step = ref(1)

const handleComplete = () => {
    emit('close')
}
</script>
