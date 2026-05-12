<template>
  <div class="flex gap-2 px-2 py-1">
    <!-- Close -->
    <button 
      @click="store.closeApp()"
      class="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e] flex items-center justify-center transition-all relative overflow-hidden group/btn"
    >
      <X class="w-2 h-2 text-black/60 opacity-0 group-hover/btn:opacity-100 transition-opacity stroke-[3px]" />
    </button>
    
    <!-- Minimize -->
    <button 
      @click="store.minimizeApp()"
      class="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123] flex items-center justify-center transition-all relative overflow-hidden group/btn"
    >
      <Minus class="w-2 h-2 text-black/60 opacity-0 group-hover/btn:opacity-100 transition-opacity stroke-[4px]" />
    </button>
    
    <!-- Maximize -->
    <button 
      @click="store.toggleMaximize()"
      class="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29] flex items-center justify-center transition-all relative overflow-hidden group/btn"
    >
      <Plus class="w-2 h-2 text-black/60 opacity-0 group-hover/btn:opacity-100 transition-opacity stroke-[3px]" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { X, Minus, Plus } from 'lucide-vue-next';
import { useGameStore } from '@/stores/useGameStore';

const store = useGameStore();
</script>

<style scoped>
/* Precise macOS traffic light colors and borders */
button:hover {
  filter: brightness(0.9);
}
</style>
