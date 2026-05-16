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
        <Transition 
          enter-active-class="transition duration-500 ease-out" 
          enter-from-class="opacity-0 translate-y-10"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition duration-300 ease-in"
          leave-from-class="opacity-100 scale-100"
          leave-to-class="opacity-0 scale-95"
        >
          <div v-if="!sessionCreated"
            class="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">
            <form @submit.prevent="createSession" class="space-y-8">
              <!-- Basic Info Grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <UiInput v-model="form.institution" label="Institución" placeholder="Ej. Colegio San José" :glass="true" />
                <UiInput v-model="form.grade" label="Grado / Nivel" placeholder="Ej. 11°" :glass="true" />
                <UiInput v-model="form.course" label="Curso / Grupo" placeholder="Ej. Grupo B" :glass="true" />
                <UiSelect v-model="form.duration" label="Duración" placeholder="Selecciona..." :options="durationOptions" :glass="true" />
              </div>

              <!-- Sheet URL -->
              <div class="space-y-4">
                <UiInput v-model="form.sheetUrl" type="url" :icon="LinkIcon" label="Google Sheet URL" placeholder="https://docs.google.com/spreadsheets/d/..." :glass="true" />
                <!-- Warning Note -->
                <p class="text-[9px] font-black uppercase tracking-[0.15em] text-nebula-cyan/70 bg-nebula-cyan/5 border border-nebula-cyan/10 p-3 rounded-lg flex items-center gap-2">
                  <ShieldAlert class="w-3.5 h-3.5" />
                  * NOTA: LA HOJA DEBE LLAMARSE "resultados" Y TENER PERMISOS DE EDITOR PARA QUE LA NOTA SE REGISTRE.
                </p>
              </div>

              <!-- Submit Button -->
              <UiButton type="submit" variant="primary" size="lg" :loading="loading" :disabled="loading || !isFormValid" label="Generar Sesión de Aprendizaje" class="w-full" />
            </form>
          </div>

          <!-- Success Card Component -->
          <ProfessorSuccessCard 
            v-else 
            :generated-url="generatedUrl" 
            @reset="sessionCreated = false" 
          />
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
import { 
  Users, Link as LinkIcon, Loader2, ArrowLeft, 
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

const form = reactive({
  institution: '',
  grade: '',
  course: '',
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
        durationDays: parseInt(form.duration)
      }
    });

    if (response.success) {
      generatedUrl.value = `${window.location.origin}/?session=${response.sessionId}`;
      sessionCreated.value = true;
    }
  } catch (error) {
    console.error('Error creating session:', error);
    alert('Error al crear la sesión. Por favor intenta de nuevo.');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.bg-nebula-primary { background-color: #f52cf5; }
.bg-nebula-cyan { background-color: #00f2ff; }
.text-nebula-primary { color: #f52cf5; }
.text-nebula-cyan { color: #00f2ff; }
.from-nebula-primary { --tw-gradient-from: #f52cf5; }
.to-nebula-cyan { --tw-gradient-to: #00f2ff; }
</style>
