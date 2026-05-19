<template>
    <UiModal :show="show" title="MISSION_BRIEFING: ONBOARDING_" variant="transparent" :preventClose="true">
        <div class="space-y-6">
            <p class="text-white/80 text-xs font-mono leading-relaxed p-4 bg-white/5 rounded-xl">
                Tu misión ha comenzado. Tu objetivo es explorar la simulación del sistema, usar tu curiosidad para
                encontrar el examen dentro del entorno virtual y completarlo. Tus notas se registrarán de manera
                automática e inmediata con el profesor al finalizar. Investiga, descubre y hackea el sistema.
            </p>
            <p class="text-white/80 text-xs font-mono leading-relaxed p-4 bg-white/5 rounded-xl">
                Si estás confundido, a la izquierda de tu pantalla verás la barra de tareas, allí podrás repasar el
                tema,
                recordar los conceptos básicos, buscar fuentes de información... y por último pero no menos importante,
                hablar con <span class="text-nebula-primary">ARIA</span> para que te ayude con cualquier inquietud.
                <br>
                ...
            </p>
            <p class="text-white/80 text-xs font-mono leading-relaxed p-4 bg-white/5 rounded-xl">
                ¡Mucha suerte!
            </p>

            <div class="pt-4 border-t border-white/5 flex justify-end items-center gap-3">
                <UiButton ref="buttonRef" label="¡Entendido!" variant="primary" size="md" :icon="Rocket"
                    @click="$emit('close')" class="!outline-none" />
            </div>
        </div>
    </UiModal>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue'
import { Rocket } from 'lucide-vue-next'

const props = defineProps({ show: Boolean })
const emit = defineEmits(['close'])

const buttonRef = ref<any>(null)

watch(() => props.show, (newVal) => {
    if (newVal) {
        nextTick(() => {
            buttonRef.value?.focus()
        })
    }
}, { immediate: true })
</script>
