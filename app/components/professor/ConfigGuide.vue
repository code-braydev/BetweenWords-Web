<template>
    <Transition enter-active-class="transition duration-300 ease-out" enter-from-class="opacity-0 translate-y-10"
        enter-to-class="opacity-100 translate-y-0" leave-active-class="transition duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0" leave-to-class="opacity-0 translate-y-10">
        <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
            <!-- Backdrop -->
            <div class="absolute inset-0 bg-black/90 backdrop-blur-3xl" @click="$emit('close')"></div>

            <!-- Background Glows -->
            <div class="absolute inset-0 pointer-events-none overflow-hidden">
                <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#f52cf5]/10 rounded-full blur-[120px]">
                </div>
                <div
                    class="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#00f2ff]/10 rounded-full blur-[120px]">
                </div>
            </div>

            <!-- Content Card -->
            <div
                class="relative w-full max-w-4xl max-h-[90vh] bg-white/5 border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden backdrop-blur-2xl">
                <!-- Header -->
                <div class="p-8 border-b border-white/5 flex items-center justify-between shrink-0">
                    <div class="flex items-center gap-4">
                        <div class="w-12 h-12 rounded-xl bg-nebula-cyan/20 flex items-center justify-center">
                            <HelpCircle class="w-6 h-6 text-nebula-cyan" />
                        </div>
                        <div>
                            <h2 class="text-xl font-black uppercase tracking-tighter">Guía de Configuración</h2>
                            <p class="text-[10px] text-nebula-cyan uppercase tracking-widest font-bold">Protocolo de
                                Automatización</p>
                        </div>
                    </div>
                    <button @click="$emit('close')"
                        class="w-10 h-10 bg-white/5 hover:bg-red-500/20 hover:text-red-400 rounded-full flex items-center justify-center transition-all">
                        <X class="w-6 h-6" />
                    </button>
                </div>

                <!-- Body -->
                <div class="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-16">
                    <!-- Step 1 -->
                    <div class="flex flex-col md:flex-row gap-8 items-start">
                        <div
                            class="shrink-0 w-12 h-12 rounded-full bg-nebula-cyan text-black flex items-center justify-center font-black text-xl shadow-[0_0_20px_rgba(0,242,255,0.4)]">
                            1</div>
                        <div class="flex-1 space-y-4">
                            <h3 class="text-xl font-black text-white uppercase tracking-tight">Renombrar la Hoja</h3>
                            <p class="text-white/60 text-sm leading-relaxed">
                                Asegúrate de que la pestaña inferior se llame exactamente
                                <span
                                    class="text-nebula-cyan font-bold bg-nebula-cyan/10 px-2 py-0.5 rounded">resultados</span>.
                                El sistema no reconocerá otro nombre.
                            </p>
                            <div class="rounded-2xl overflow-hidden border border-white/10 bg-white/5 shadow-2xl">
                                <img src="/images/professor/step1.png" alt="Step 1" class="w-full h-auto block" />
                            </div>
                        </div>
                    </div>

                    <div class="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>

                    <!-- Step 2 -->
                    <div class="flex flex-col md:flex-row gap-8 items-start">
                        <div
                            class="shrink-0 w-12 h-12 rounded-full bg-nebula-cyan text-black flex items-center justify-center font-black text-xl shadow-[0_0_20px_rgba(0,242,255,0.4)]">
                            2</div>
                        <div class="flex-1 space-y-4">
                            <h3 class="text-xl font-black text-white uppercase tracking-tight">Localizar el Botón
                                Compartir</h3>
                            <p class="text-white/60 text-sm leading-relaxed">
                                En la esquina superior derecha de tu Google Sheet, haz clic en el botón azul de
                                <span class="text-nebula-cyan font-bold underline">Compartir</span>.
                            </p>
                            <div class="rounded-2xl overflow-hidden border border-white/10 bg-white/5 shadow-2xl">
                                <img src="/images/professor/step2.png" alt="Step 2" class="w-full h-auto block" />
                            </div>
                        </div>
                    </div>

                    <div class="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>

                    <!-- Step 3 -->
                    <div class="flex flex-col md:flex-row gap-8 items-start">
                        <div
                            class="shrink-0 w-12 h-12 rounded-full bg-nebula-cyan text-black flex items-center justify-center font-black text-xl shadow-[0_0_20px_rgba(0,242,255,0.4)]">
                            3</div>
                        <div class="flex-1 space-y-4">
                            <h3 class="text-xl font-black text-white uppercase tracking-tight">Acceso Restringido</h3>
                            <p class="text-white/60 text-sm leading-relaxed">
                                Verás que el acceso está "Restringido". Haz clic sobre esa opción para desplegar el menú
                                de permisos.
                            </p>
                            <div class="rounded-2xl overflow-hidden border border-white/10 bg-white/5 shadow-2xl">
                                <img src="/images/professor/step3.png" alt="Step 3" class="w-full h-auto block" />
                            </div>
                        </div>
                    </div>

                    <div class="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>

                    <!-- Step 4 -->
                    <div class="flex flex-col md:flex-row gap-8 items-start">
                        <div
                            class="shrink-0 w-12 h-12 rounded-full bg-nebula-cyan text-black flex items-center justify-center font-black text-xl shadow-[0_0_20px_rgba(0,242,255,0.4)]">
                            4</div>
                        <div class="flex-1 space-y-4">
                            <h3 class="text-xl font-black text-white uppercase tracking-tight">Abrir Acceso General</h3>
                            <p class="text-white/60 text-sm leading-relaxed">
                                Cambia la configuración a <span class="text-nebula-primary font-bold">"Cualquier usuario
                                    que tenga el vínculo"</span>.
                            </p>
                            <div class="rounded-2xl overflow-hidden border border-white/10 bg-white/5 shadow-2xl">
                                <img src="/images/professor/step4.png" alt="Step 4" class="w-full h-auto block" />
                            </div>
                        </div>
                    </div>

                    <div class="h-px bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>

                    <!-- Step 5 -->
                    <div class="flex flex-col md:flex-row gap-8 items-start pb-8">
                        <div
                            class="shrink-0 w-12 h-12 rounded-full bg-nebula-cyan text-black flex items-center justify-center font-black text-xl shadow-[0_0_20px_rgba(0,242,255,0.4)]">
                            5</div>
                        <div class="flex-1 space-y-4">
                            <h3 class="text-xl font-black text-white uppercase tracking-tight">Asignar Rol de Editor
                            </h3>
                            <p class="text-white/60 text-sm leading-relaxed">
                                <span class="text-nebula-cyan font-black uppercase tracking-widest">¡Paso
                                    Crítico!</span>
                                Cambia el rol de Lector a <span
                                    class="text-nebula-cyan font-bold bg-nebula-cyan/10 px-2 py-0.5 rounded">Editor</span>.
                                Esto permite que Between-Words registre las notas automáticamente.
                            </p>
                            <div class="rounded-2xl overflow-hidden border border-white/10 bg-white/5 shadow-2xl">
                                <img src="/images/professor/step5.png" alt="Step 5" class="w-full h-auto block" />
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Footer -->
                <div class="p-8 bg-white/5 text-center shrink-0 border-t border-white/5">
                    <button @click="$emit('close')"
                        class="px-12 py-4 bg-gradient-to-r from-nebula-primary to-nebula-cyan rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] shadow-[0_0_30px_rgba(0,242,255,0.2)] hover:shadow-[0_0_40px_rgba(0,242,255,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all">
                        Entendido, configurar ahora
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
import { HelpCircle, X } from 'lucide-vue-next';

defineProps<{
    isOpen: boolean
}>();

defineEmits(['close']);
</script>

<style scoped>
.text-nebula-cyan {
    color: #00f2ff;
}

.bg-nebula-cyan {
    background-color: #00f2ff;
}

.text-nebula-primary {
    color: #f52cf5;
}

.bg-nebula-primary {
    background-color: #f52cf5;
}

.from-nebula-primary {
    --tw-gradient-from: #f52cf5;
}

.to-nebula-cyan {
    --tw-gradient-to: #00f2ff;
}

.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(0, 242, 255, 0.1);
    border-radius: 10px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 242, 255, 0.2);
}
</style>
