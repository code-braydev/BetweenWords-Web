<template>
  <div
    class="min-h-screen bg-[#050505] text-white font-sans selection:bg-nebula-primary/30 py-12 px-4 relative overflow-hidden">
    <!-- Background Decor -->
    <div class="absolute top-0 left-0 w-full h-full pointer-events-none">
      <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-nebula-primary/10 rounded-full blur-[120px]"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-nebula-cyan/10 rounded-full blur-[120px]">
      </div>
    </div>

    <div class="max-w-3xl mx-auto relative z-10">
      <!-- Header -->
      <header class="text-center mb-12 relative">
        <button @click="showGuide = true"
          class="absolute top-0 right-0 md:-right-20 flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl border border-nebula-cyan/30 rounded-full text-[11px] font-black uppercase tracking-widest text-nebula-cyan hover:bg-nebula-cyan/10 hover:shadow-[0_0_20px_rgba(0,242,255,0.2)] transition-all group active:scale-95">
          <HelpCircle class="w-4 h-4 group-hover:rotate-12 transition-transform" />
          <span class="hidden sm:inline">Guía de Configuración</span>
        </button>

        <div
          class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 border border-white/10 mb-6 backdrop-blur-xl">
          <Users class="w-8 h-8 text-nebula-cyan" />
        </div>
        <h1
          class="text-4xl font-black tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-white/40">
          Panel de Control del Profesor
        </h1>
        <p class="text-white/50 max-w-md mx-auto">
          Configura una nueva sesión de aprendizaje para tus estudiantes y obtén un enlace personalizado.
        </p>
      </header>

      <!-- Main Content Area -->
      <div class="relative min-h-[500px]">
        <!-- Form Card -->
        <Transition enter-active-class="transition duration-500 ease-out" enter-from-class="opacity-0 translate-y-10"
          enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-300 ease-in"
          leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
          <div v-if="!sessionCreated"
            class="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <form @submit.prevent="createSession" class="space-y-8">
              <!-- Basic Info Grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <UiInput v-model="form.institution" label="Institución" placeholder="Ej. Colegio San José"
                  :glass="true" />
                <UiInput v-model="form.grade" label="Grado / Nivel" placeholder="Ej. 11°" :glass="true" />
                <UiInput v-model="form.course" label="Curso / Grupo" placeholder="Ej. Grupo B" :glass="true" />
                <UiSelect v-model="form.duration" label="Duración" placeholder="Selecciona..."
                  :options="durationOptions" :glass="true" />
              </div>

              <!-- Sheet URL -->
              <div class="space-y-4">
                <UiInput v-model="form.sheetUrl" type="url" :icon="LinkIcon" label="Google Sheet URL"
                  placeholder="https://docs.google.com/spreadsheets/d/..." :glass="true" />
                <UiInput v-model="form.professor" label="Nombre del profesor (opcional)"
                  placeholder="Ej. Prof. Juan Pérez" :glass="true" />
                <!-- Warning Note -->
                <p
                  class="text-[9px] font-black uppercase tracking-[0.15em] text-nebula-cyan/70 bg-nebula-cyan/5 border border-nebula-cyan/10 p-3 rounded-lg flex items-center gap-2">
                  <ShieldAlert class="w-3.5 h-3.5" />
                  * NOTA: LA HOJA DEBE LLAMARSE "resultados" Y TENER PERMISOS DE EDITOR PARA QUE LA NOTA SE REGISTRE.
                </p>
              </div>

              <!-- Submit Button -->
              <UiButton type="submit" variant="primary" size="lg" :loading="loading" :disabled="loading || !isFormValid"
                label="Generar Sesión de Aprendizaje" class="w-full" />
            </form>
          </div>

          <!-- Success Card Component -->
          <div v-else>
            <ProfessorSuccessCard v-if="true" :generated-url="generatedUrl" @reset="sessionCreated = false" />

            <div class="mt-6 flex gap-3 justify-center items-center">
              <UiButton type="button" variant="primary" size="lg" @click="shareToWhatsApp"
                aria-label="Compartir en WhatsApp" class="flex items-center gap-2">
                <span class="w-5 h-5 inline-block" aria-hidden>
                  <svg viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5">
                    <path
                      d="M20.52 3.48A11.92 11.92 0 0012.01.5C6.01.5 1.01 5.5 1.01 11.5c0 2.03.53 4.01 1.53 5.74L0 23l5.05-1.32A11.94 11.94 0 0012 23.5c6 0 11-5 11-11.5 0-1.78-.41-3.47-1.48-5.22zM12 21.5c-1.1 0-2.18-.24-3.16-.7l-.23-.11-3.01.79.8-2.93-.12-.25A8.96 8.96 0 013.01 11.5C3.01 6.8 7.06 2.75 12 2.75c4.95 0 9 4.05 9 8.75S16.95 21.5 12 21.5z" />
                    <path
                      d="M17.04 14.2c-.3-.15-1.78-.88-2.05-.98-.27-.1-.47-.15-.67.15s-.77.98-.95 1.18c-.17.2-.34.22-.63.07-.3-.15-1.26-.47-2.4-1.48-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.34.45-.51.15-.17.2-.3.3-.5.1-.2 0-.37-.02-.52-.02-.15-.67-1.62-.92-2.22-.24-.58-.48-.5-.67-.51-.17-.01-.37-.01-.56-.01s-.52.07-.79.37c-.27.3-1.02 1-1.02 2.44 0 1.44 1.05 2.84 1.2 3.04.15.2 2.08 3.2 5.04 4.49 2.96 1.29 2.96.86 3.49.81.53-.05 1.78-.72 2.03-1.41.25-.69.25-1.28.17-1.41-.08-.12-.27-.2-.57-.35z" />
                  </svg>
                </span>
                Compartir en WhatsApp
              </UiButton>

              <UiButton type="button" variant="secondary" size="lg" @click="copyLink" aria-label="Copiar enlace">
                {{ copied ? 'Copiado!' : 'Copiar enlace' }}
              </UiButton>
            </div>
            <p v-if="isLocalhost" class="mt-3 text-center text-xs text-yellow-300">Nota: estás compartiendo una URL
              local (localhost). Las vistas previas (imagen / OG) no aparecerán en WhatsApp hasta que la URL sea
              públicamente accesible.</p>
          </div>
        </Transition>
      </div>

      <!-- Back to Home -->
      <div class="mt-12 text-center">
        <NuxtLink to="/"
          class="text-sm text-white/30 hover:text-white transition-colors flex items-center justify-center gap-2 group">
          <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Volver al Inicio
        </NuxtLink>
      </div>
    </div>

    <!-- Configuration Guide Component -->
    <ProfessorConfigGuide :is-open="showGuide" @close="showGuide = false" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useGameStore } from '~/stores/useGameStore'
import {
  Users, Link as LinkIcon, ArrowLeft,
  HelpCircle, ShieldAlert
} from 'lucide-vue-next';

const loading = ref(false);
const sessionCreated = ref(false);
const generatedUrl = ref('');
const showGuide = ref(false);

const durationOptions = [
  { label: '1 Día', value: '1' },
  { label: '1 Semana', value: '7' },
  { label: '15 Días', value: '15' },
  { label: '1 Mes', value: '30' }
];

const copied = ref(false)

const shareToWhatsApp = () => {
  const inviter = form.professor?.trim() || ''
  const message = (inviter ? `${inviter} te invita a jugar en Between Words.` : `Te invito a jugar en Between Words.`) + `\nUnete aqui ${generatedUrl.value}`
  const waUrl = `https://wa.me/?text=${encodeURIComponent(message)}`
  window.open(waUrl, '_blank')
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(generatedUrl.value)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch (e) {
    console.error('Copy failed', e)
    alert('No fue posible copiar. Selecciona y copia manualmente.')
  }
}

const form = reactive({
  institution: '',
  grade: '',
  course: '',
  professor: '',
  duration: '1',
  sheetUrl: ''
});

const isFormValid = computed(() => {
  return form.institution.trim() !== '' &&
    form.grade.trim() !== '' &&
    form.course.trim() !== '' &&
    form.sheetUrl.trim() !== '';
});

const createSession = async () => {
  loading.value = true;
  try {
    const response = await $fetch('/api/sessions', {
      method: 'POST',
      body: {
        ...form,
        durationDays: parseInt(form.duration),
        professor: form.professor || undefined
      }
    });

    if (response.success) {
      // Persist session in store including optional professor
      try {
        const store = useGameStore()
        store.setSession({
          id: response.sessionId,
          topic: form.course || form.institution,
          sheetUrl: form.sheetUrl,
          professor: form.professor || ''
        })
      } catch (e) {
        console.warn('Could not set session in store:', e)
      }

      generatedUrl.value = `${window.location.origin}/?session=${response.sessionId}` + (form.professor ? `&professor=${encodeURIComponent(form.professor)}` : '');
      sessionCreated.value = true;
    }
  } catch (error) {
    console.error('Error creating session:', error);
    alert('Error al crear la sesión. Por favor intenta de nuevo.');
  } finally {
    loading.value = false;
  }
};

const isLocalhost = computed(() => {
  try {
    return generatedUrl.value.includes('localhost') || window.location.origin.includes('localhost')
  } catch (e) {
    return false
  }
})
</script>

<style scoped>
.bg-nebula-primary {
  background-color: #f52cf5;
}

.bg-nebula-cyan {
  background-color: #00f2ff;
}

.text-nebula-primary {
  color: #f52cf5;
}

.text-nebula-cyan {
  color: #00f2ff;
}

.from-nebula-primary {
  --tw-gradient-from: #f52cf5;
}

.to-nebula-cyan {
  --tw-gradient-to: #00f2ff;
}
</style>
