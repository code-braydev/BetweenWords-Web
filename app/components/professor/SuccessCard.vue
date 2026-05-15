<template>
  <div v-motion :initial="{ opacity: 0, scale: 0.9 }" :enter="{ opacity: 1, scale: 1 }"
    class="bg-white/5 backdrop-blur-2xl border border-nebula-cyan/30 rounded-3xl p-10 text-center shadow-[0_0_50px_rgba(0,242,255,0.1)]">
    <div class="w-20 h-20 bg-nebula-cyan/20 rounded-full flex items-center justify-center mx-auto mb-6">
      <Check class="w-10 h-10 text-nebula-cyan" />
    </div>
    <h2 class="text-2xl font-bold mb-2">¡Sesión Creada con Éxito!</h2>
    <p class="text-white/40 mb-8">Comparte este enlace con tus estudiantes para que comiencen la actividad.</p>

    <div class="bg-black/40 border border-white/10 rounded-2xl p-4 flex items-center gap-4 group">
      <div class="flex-1 text-left truncate text-nebula-cyan font-mono text-sm">
        {{ generatedUrl }}
      </div>
      <button @click="copyUrl" class="bg-white/10 hover:bg-white/20 p-3 rounded-xl transition-colors shrink-0">
        <Copy v-if="!copied" class="w-5 h-5" />
        <Check v-else class="w-5 h-5 text-green-400" />
      </button>
    </div>

    <button @click="$emit('reset')"
      class="mt-8 text-xs uppercase tracking-widest text-white/30 hover:text-white transition-colors">
      Crear otra sesión
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Check, Copy } from 'lucide-vue-next';

const props = defineProps<{
  generatedUrl: string
}>();

defineEmits(['reset']);

const copied = ref(false);

const copyUrl = () => {
  navigator.clipboard.writeText(props.generatedUrl);
  copied.value = true;
  setTimeout(() => copied.value = false, 2000);
};
</script>

<style scoped>
.text-nebula-cyan { color: #00f2ff; }
.bg-nebula-cyan { background-color: #00f2ff; }
</style>
