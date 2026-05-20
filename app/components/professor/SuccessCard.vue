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
      <button>
        <span class="w-5 h-5 inline-block" aria-hidden>
          <svg viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
            <path
              d="M20.52 3.48A11.92 11.92 0 0012.01.5C6.01.5 1.01 5.5 1.01 11.5c0 2.03.53 4.01 1.53 5.74L0 23l5.05-1.32A11.94 11.94 0 0012 23.5c6 0 11-5 11-11.5 0-1.78-.41-3.47-1.48-5.22zM12 21.5c-1.1 0-2.18-.24-3.16-.7l-.23-.11-3.01.79.8-2.93-.12-.25A8.96 8.96 0 013.01 11.5C3.01 6.8 7.06 2.75 12 2.75c4.95 0 9 4.05 9 8.75S16.95 21.5 12 21.5z" />
            <path
              d="M17.04 14.2c-.3-.15-1.78-.88-2.05-.98-.27-.1-.47-.15-.67.15s-.77.98-.95 1.18c-.17.2-.34.22-.63.07-.3-.15-1.26-.47-2.4-1.48-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.34.45-.51.15-.17.2-.3.3-.5.1-.2 0-.37-.02-.52-.02-.15-.67-1.62-.92-2.22-.24-.58-.48-.5-.67-.51-.17-.01-.37-.01-.56-.01s-.52.07-.79.37c-.27.3-1.02 1-1.02 2.44 0 1.44 1.05 2.84 1.2 3.04.15.2 2.08 3.2 5.04 4.49 2.96 1.29 2.96.86 3.49.81.53-.05 1.78-.72 2.03-1.41.25-.69.25-1.28.17-1.41-.08-.12-.27-.2-.57-.35z" />
          </svg>
        </span>
      </button>
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
.text-nebula-cyan {
  color: #00f2ff;
}

.bg-nebula-cyan {
  background-color: #00f2ff;
}
</style>
