<template>
    <div class="flex bg-white/5 dark:bg-black/50 backdrop-blur-2xl rounded-2xl overflow-hidden border border-white/20 dark:border-white/10 flex-col sm:flex-row">
        <!-- Sidebar Contacts -->
        <div class="w-full sm:w-1/3 border-b sm:border-b-0 sm:border-r border-white/10 flex flex-col bg-black/20">
            <div class="p-4 border-b border-white/10 flex items-center justify-between">
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full overflow-hidden bg-nebula-primary/20 flex items-center justify-center">
                        <User class="w-6 h-6 text-white" />
                    </div>
                    <span class="text-white font-semibold font-mono text-sm">Chats</span>
                </div>
            </div>
            <div class="flex-1 overflow-y-auto custom-scrollbar p-2">
                <!-- Contact Item -->
                <div class="p-3 rounded-lg bg-white/10 cursor-pointer flex items-center gap-3 relative">
                    <div class="w-12 h-12 rounded-full overflow-hidden bg-nebula-cyan/20 border border-nebula-cyan/50 flex items-center justify-center">
                        <BookOpen class="w-6 h-6 text-nebula-cyan" />
                    </div>
                    <div class="flex-1">
                        <div class="flex justify-between items-center">
                            <h4 class="text-white font-medium text-sm">Profesor</h4>
                            <span class="text-[10px] text-white/50">10:45 AM</span>
                        </div>
                        <p class="text-xs text-white/70 truncate">Ingresa a este link...</p>
                    </div>
                    <div class="w-2 h-2 rounded-full bg-nebula-cyan absolute right-4"></div>
                </div>
            </div>
        </div>

        <!-- Chat Area -->
        <div class="flex-1 flex flex-col relative bg-nebula-dark/40">
            <!-- Chat Header -->
            <div class="p-4 border-b border-white/10 bg-black/20 flex items-center gap-3 backdrop-blur-md z-10">
                <div class="w-10 h-10 rounded-full overflow-hidden bg-nebula-cyan/20 border border-nebula-cyan/50 flex items-center justify-center">
                    <BookOpen class="w-5 h-5 text-nebula-cyan" />
                </div>
                <div>
                    <h3 class="text-white font-medium">Profesor</h3>
                    <p class="text-[10px] text-nebula-cyan">en línea</p>
                </div>
            </div>

            <!-- Chat Messages -->
            <div class="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                <div class="flex justify-start">
                    <div class="bg-slate-800/80 backdrop-blur-md rounded-2xl rounded-tl-none p-4 max-w-[80%] border border-slate-700/50 shadow-lg relative">
                        <p class="text-sm text-slate-200 leading-relaxed font-sans">
                            ¡Hola {{ store.user.fullName }}! <br /><br />
                            Espero que estés muy bien. Por favor, ingresa a este enlace para realizar tu examen de nivelación de inglés:
                        </p>
                        <div class="mt-3 p-3 bg-black/40 rounded-xl border border-nebula-cyan/20 flex items-center gap-3 cursor-pointer hover:bg-black/60 transition-colors group" @click="openExam">
                            <div class="p-2 bg-nebula-cyan/10 rounded-lg group-hover:bg-nebula-cyan/20 transition-colors">
                                <LinkIcon class="w-5 h-5 text-nebula-cyan" />
                            </div>
                            <div>
                                <p class="text-xs font-mono text-nebula-cyan font-bold">http://exam.local/level1</p>
                                <p class="text-[10px] text-white/40">Click para abrir</p>
                            </div>
                        </div>
                        <span class="text-[9px] text-white/30 absolute bottom-2 right-4">10:45 AM</span>
                    </div>
                </div>
            </div>

            <!-- Input Area -->
            <div class="p-4 bg-black/30 border-t border-white/10 backdrop-blur-md">
                <div class="flex items-center gap-3 bg-black/40 rounded-full px-4 py-2 border border-white/10">
                    <Smile class="w-5 h-5 text-white/50" />
                    <input type="text" placeholder="Escribe un mensaje..." disabled class="flex-1 bg-transparent border-none outline-none text-white text-sm placeholder-white/30 cursor-not-allowed" />
                    <Send class="w-5 h-5 text-white/50" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { User, BookOpen, Link as LinkIcon, Smile, Send } from 'lucide-vue-next'
import { useGameStore } from '@/stores/useGameStore'

const store = useGameStore()

const openExam = () => {
    store.openApp('browser')
}
</script>
