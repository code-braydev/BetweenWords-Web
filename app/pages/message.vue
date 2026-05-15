<template>
    <main
        class="h-screen w-full bg-slate-50 dark:bg-[#050505] flex flex-col items-center justify-center p-0 md:p-6 font-sans overflow-hidden transition-colors duration-300">
        <div v-motion :initial="{ opacity: 0, scale: 0.98 }" :enter="{ opacity: 1, scale: 1 }"
            class="flex flex-col h-full w-full max-w-5xl bg-white dark:bg-[#0a0a0c] border border-slate-200 dark:border-white/5 rounded-none md:rounded-3xl overflow-hidden relative shadow-xl dark:shadow-[0_0_50px_-12px_rgba(168,85,247,0.15)] transition-colors">

            <header v-motion :initial="{ opacity: 0, y: -20 }" :enter="{ opacity: 1, y: 0, transition: { duration: 500, delay: 200 } }"
                class="p-5 border-b border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#0a0a0c] flex items-center justify-between z-20 transition-colors">
                <div class="flex items-center gap-4">
                    <div class="relative">
                        <div
                            class="w-12 h-12 rounded-2xl bg-nebula-primary/10 border border-nebula-primary/30 flex items-center justify-center rotate-3 shadow-[0_0_20px_rgba(168,85,247,0.2)]">
                            <Sparkles class="text-nebula-primary w-6 h-6" />
                        </div>
                        <div
                            class="absolute -bottom-1 -right-1 w-4 h-4 bg-white dark:bg-[#0a0a0c] rounded-full flex items-center justify-center transition-colors">
                            <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></div>
                        </div>
                    </div>
                    <div>
                        <h1 class="text-lg font-black text-slate-900 dark:text-white tracking-[0.2em] uppercase leading-none transition-colors">
                            Aria <span class="text-nebula-primary text-xs ml-1">AI</span>
                        </h1>
                        <div class="flex items-center gap-2 mt-1">
                            <span class="text-[9px] text-nebula-cyan font-mono tracking-widest animate-pulse">//
                                SYSTEM_READY</span>
                            <span class="text-[9px] text-slate-400 dark:text-white/20 font-mono transition-colors">v2.0.4</span>
                        </div>
                    </div>
                </div>
                <UiButton variant="subtle" size="sm" :icon="RotateCcw" @click="clearChat"
                    class="opacity-40 hover:opacity-100 transition-opacity" />
            </header>

            <section class="flex-1 relative overflow-hidden bg-dot-pattern bg-center bg-repeat opacity-95">
                <div class="absolute inset-0 pointer-events-none z-10 mask-gradient-fade"></div>
                <div ref="chatContainer"
                    class="h-full overflow-y-auto p-6 md:p-10 space-y-8 scrollbar-custom flex flex-col">
                    <div v-for="msg in messages" :key="msg.id">
                        <div :class="['flex w-full', msg.role === 'user' ? 'justify-end' : 'justify-start']">
                            <div v-motion :initial="{ opacity: 0, y: 10 }" :enter="{ opacity: 1, y: 0 }" :class="[
                                'max-w-[85%] md:max-w-[75%] p-5 rounded-2xl relative shadow-2xl',
                                msg.role === 'user'
                                    ? 'bg-gradient-to-tr from-nebula-primary/20 to-nebula-primary/50 text-white rounded-br-none'
                                    : 'bg-slate-100 dark:bg-[#121215] border border-slate-200 dark:border-white/10 text-slate-800 dark:text-gray-100 rounded-bl-none transition-colors'
                            ]">

                                <div v-if="msg.role !== 'user'" v-html="renderMarkdown(msg.content)"
                                    class="markdown-content text-[15px] leading-relaxed">
                                </div>

                                <p v-else class="text-[15px] leading-relaxed font-medium">
                                    {{ msg.content }}
                                </p>

                                <span :class="[
                                    'block mt-3 text-[10px] font-mono tracking-tighter uppercase',
                                    msg.role === 'user' ? 'text-white/80 text-right' : 'text-slate-400 dark:text-white/50 text-left transition-colors'
                                ]">
                                    {{ formatTime(msg.timestamp) }}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div v-if="isTyping" class="flex justify-start">
                        <div
                            class="bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 p-4 rounded-2xl rounded-tl-none flex gap-1.5 shadow-xl transition-colors">
                            <span class="w-1.5 h-1.5 bg-nebula-primary rounded-full animate-bounce"></span>
                            <span
                                class="w-1.5 h-1.5 bg-nebula-primary rounded-full animate-bounce [animation-delay:0.2s]"></span>
                            <span
                                class="w-1.5 h-1.5 bg-nebula-primary rounded-full animate-bounce [animation-delay:0.4s]"></span>
                        </div>
                    </div>
                    <div class="h-16 flex-shrink-0"></div>
                </div>
            </section>

            <footer class="p-6 bg-white dark:bg-[#0a0a0c] border-t border-slate-200 dark:border-white/5 z-20 shadow-lg dark:shadow-[0_-10px_20px_rgba(0,0,0,0.5)] transition-colors">
                <div class="max-w-4xl mx-auto space-y-5">
                    <div class="flex items-end gap-3">
                        <UiInput ref="inputRef" v-model="inputMessage" placeholder="Escribe un mensaje..."
                            class="flex-1" :disabled="isTyping" @keyup.enter="handleSendMessage" />
                        <UiButton variant="primary" size="md" :icon="Send" :loading="isTyping"
                            @click="handleSendMessage" />
                    </div>
                    <p
                        class="text-[9px] text-slate-400 dark:text-white/30 font-mono uppercase tracking-[0.25em] text-center leading-loose pt-2 transition-colors">
                        Aria es una IA y puede cometer errores.
                    </p>

                </div>
            </footer>
        </div>
    </main>
</template>

<style scoped>
.bg-dot-pattern {
    background-image: radial-gradient(rgba(168, 85, 247, 0.1) 1px, transparent 1px);
    background-size: 30px 30px;
    background-position: center;
}
</style>
<script setup lang="ts">
import { ref, onMounted, nextTick, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { Sparkles, RotateCcw, Send } from 'lucide-vue-next'
import MarkdownIt from 'markdown-it'

// ── Route Guard ──────────────────────────────────────────────────────────────
definePageMeta({
    middleware: ['chat-guard']
})

const inputMessage = ref('')
const chatContainer = ref<HTMLElement | null>(null)
const inputRef = ref<any>(null)

const chatStore = useChatStore()
const { messages, isTyping } = storeToRefs(chatStore)

const md = new MarkdownIt()
const renderMarkdown = (content: any) => {
    if (!content) return ''

    const text = typeof content === 'string' ? content : String(content)

    return md.render(text)
}

const handleSendMessage = async () => {
    if (!inputMessage.value.trim() || isTyping.value) return

    const content = inputMessage.value
    inputMessage.value = ''
    await chatStore.sendMessage(content)
    scrollToBottom()
}

watch(isTyping, async (newVal) => {
    if (!newVal) {
        await nextTick();
        const el = inputRef.value?.$el?.querySelector('input');
        if (el) el.focus();
    }
});

watch(
    () => messages.value.length,
    async () => {
        await scrollToBottom()
    }
)

onMounted(() => {
    scrollToBottom()
})

const scrollToBottom = async () => {
    await nextTick()
    chatContainer.value?.scrollTo({ top: chatContainer.value.scrollHeight, behavior: 'smooth' })
}

const clearChat = () => {
    chatStore.clearChat()
    scrollToBottom()
}

const formatTime = (date: any) => {
    if (!date) return ''

    // Convertimos a objeto Date por si viene como String de la API
    const d = new Date(date)

    // Verificamos si la fecha es válida para evitar errores de "Invalid Date"
    if (isNaN(d.getTime())) return ''

    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
</script>