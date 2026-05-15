<template>
  <div class="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden">
    <!-- Background Decor -->
    <div class="absolute top-0 left-0 w-full h-full pointer-events-none">
      <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-500/10 rounded-full blur-[120px]"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-500/10 rounded-full blur-[120px]"></div>
    </div>

    <div class="relative z-10 w-full max-w-md">
      <UiCard body-class="p-8 md:p-12 text-center flex flex-col items-center group relative overflow-hidden" :glass="true">
        <!-- Inner glow -->
        <div class="absolute -inset-1 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition duration-700"></div>
        
        <div class="w-20 h-20 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center justify-center mb-6 relative z-10 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
          <ShieldAlert class="w-10 h-10 text-red-500" />
        </div>
        
        <h1 class="text-6xl font-black text-white tracking-tighter mb-2 relative z-10">403</h1>
        <h2 class="text-xl font-bold uppercase tracking-widest text-red-400 mb-6 relative z-10">Acceso Denegado</h2>
        
        <p class="text-white/60 mb-8 leading-relaxed relative z-10 text-sm">
          Ruta no disponible o requiere permisos especiales. El asistente Ari requiere una sesión activa para interactuar.
        </p>
        
        <UiButton 
          variant="primary" 
          @click="goBack" 
          :icon="ArrowLeft" 
          label="Volver al Inicio" 
          class="w-full relative z-10 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 border-none shadow-[0_0_20px_rgba(239,68,68,0.3)]"
        />
      </UiCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ShieldAlert, ArrowLeft } from 'lucide-vue-next'

const router = useRouter()

const goBack = () => {
  router.push('/')
}
</script>
