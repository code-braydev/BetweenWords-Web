<template>
    <div
        class="flex h-full bg-white/5 dark:bg-nebula-dark/60 backdrop-blur-2xl rounded-2xl overflow-hidden border border-white/20 dark:border-white/10 flex-col shadow-2xl relative">
        <div class="h-10 bg-nebula-dark/60 backdrop-blur-xl flex items-center px-4 shrink-0 z-50">
            <GameWindowControls />
            <div class="flex-1 text-center">
                <span class="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold">WhatsApp Desktop</span>
            </div>
        </div>
        <div class="flex flex-1 flex-col sm:flex-row overflow-hidden relative">
            <!-- Sidebar -->
            <div
                :class="['w-full sm:w-1/3 border-r border-white/10 flex flex-col bg-nebula-dark lg:bg-black/60 absolute sm:relative h-full z-20 transition-transform duration-300', showSidebar ? 'translate-x-0' : '-translate-x-full sm:translate-x-0']">
                <div class="p-4 flex items-center gap-3">
                    <div
                        class="w-10 h-10 rounded-full overflow-hidden bg-nebula-primary/20 flex items-center justify-center">
                        <User class="w-6 h-6 text-white" />
                    </div>
                    <span class="text-white font-semibold font-mono text-sm">Chats</span>

                </div>
                <div class="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                    <div v-for="chat in chats" :key="chat.id" @click="selectChat(chat.id)"
                        :class="['p-3 rounded-lg cursor-pointer flex items-center gap-3 relative transition-colors', activeChatId === chat.id ? 'bg-white/10' : 'hover:bg-white/5']">
                        <div
                            :class="['w-12 h-12 rounded-full overflow-hidden border flex items-center justify-center shrink-0', chat.avatarColor]">
                            <component :is="getIcon(chat.avatar)" class="w-6 h-6" />
                        </div>
                        <div class="flex-1 min-w-0">
                            <div class="flex justify-between items-center mb-1">
                                <h4 class="text-white font-medium text-sm truncate">{{ chat.name }}</h4>
                                <span class="text-[10px] text-white/50 shrink-0">{{ chat.messages[chat.messages.length -
                                    1]?.time }}</span>
                            </div>
                            <p class="text-xs text-white/70 truncate">
                                <span v-if="chat.type === 'group'" class="font-medium mr-1">{{
                                    chat.messages[chat.messages.length - 1]?.sender }}:</span>
                                {{ chat.messages[chat.messages.length - 1]?.content }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Chat Area -->
            <div class="flex-1 flex flex-col relative bg-nebula-dark/60 overflow-hidden w-full h-full">
                <div class="p-3 sm:p-4 bg-nebula-dark/60 flex items-center gap-3 z-10 shrink-0">
                    <button class="sm:hidden mr-1 p-2 rounded-full" @click="showSidebar = true">
                        <ArrowLeft class="w-5 h-5" />
                    </button>
                    <div
                        :class="['w-10 h-10 rounded-full overflow-hidden flex items-center justify-center shrink-0', activeChat?.avatarColor]">
                        <component :is="getIcon(activeChat?.avatar)" class="w-5 h-5" />
                    </div>
                    <div class="min-w-0">
                        <h3 class="text-white font-medium truncate">{{ activeChat?.name }}</h3>
                        <p class="text-[10px] text-nebula-cyan truncate">
                            {{ activeChat?.type === 'group' ? 'Varios participantes' : 'en línea' }}
                        </p>
                    </div>
                </div>

                <!-- Chat Messages -->
                <div class="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 custom-scrollbar bg-chat-pattern">
                    <div v-for="msg in activeChat?.messages" :key="msg.id"
                        :class="['flex w-full', msg.isMe ? 'justify-end' : 'justify-start']">
                        <div :class="[
                            'p-3 sm:p-4 max-w-[85%] shadow-lg relative backdrop-blur-md border transition-all duration-300',
                            msg.isMe
                                ? 'bg-nebula-primary/20 border-nebula-primary/30 rounded-2xl rounded-tr-none text-right'
                                : 'bg-slate-800/80 border-slate-700/50 rounded-2xl rounded-tl-none text-left'
                        ]">
                            <!-- Sender name only for groups and not for 'me' -->
                            <p v-if="activeChat?.type === 'group' && !msg.isMe"
                                :class="['text-[11px] font-bold mb-1', msg.senderColor]">{{ msg.sender }}</p>

                            <p
                                :class="['text-sm leading-relaxed font-sans whitespace-pre-line', msg.isMe ? 'text-white' : 'text-slate-200']">
                                {{ msg.content }}
                            </p>

                            <!-- Custom interactive link block for the exam link -->
                            <div v-if="msg.link"
                                class="mt-3 p-2 sm:p-3 bg-black/40 rounded-xl border border-nebula-cyan/20 flex items-center gap-3 cursor-pointer hover:bg-black/60 transition-colors group text-left"
                                @click="openExam">
                                <div
                                    class="p-2 bg-nebula-cyan/10 rounded-lg group-hover:bg-nebula-cyan/20 transition-colors shrink-0">
                                    <LinkIcon class="w-5 h-5 text-nebula-cyan" />
                                </div>
                                <div class="min-w-0">
                                    <p class="text-xs font-mono text-nebula-cyan font-bold truncate">
                                        https://examen-de-ingles.org/present-perfect</p>
                                    <p class="text-[10px] text-white/40">Click para abrir</p>
                                </div>
                            </div>

                            <!-- Time stamp -->
                            <span
                                :class="['text-[9px] block mt-1', msg.isMe ? 'text-white/40 text-left' : 'text-white/30 text-right']">
                                {{ msg.time }}
                            </span>
                        </div>
                    </div>
                </div>

                <!-- Input Area (Read Only) -->
                <div class="p-3 sm:p-4 bg-nebula-dark/60 backdrop-blur-md shrink-0 z-10">
                    <div
                        class="flex items-center gap-3 bg-nebula-dark rounded-full px-4 py-2 sm:py-3 border border-white/10 opacity-60">
                        <Smile class="w-5 h-5 text-white/30 shrink-0" />
                        <input type="text" placeholder="Solo lectura en modo examen" disabled
                            class="flex-1 bg-transparent border-none outline-none text-white/50 text-xs sm:text-sm placeholder-white/30 cursor-not-allowed text-center sm:text-left min-w-0" />
                        <Send class="w-5 h-5 text-white/30 shrink-0" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { User, BookOpen, Link as LinkIcon, Smile, Send, Users, Terminal, Coffee, Heart, ArrowLeft, MessageSquare } from 'lucide-vue-next'
import { useGameStore } from '@/stores/useGameStore'
import { getHistoryChats } from '~/constant/historyChat';
import GameWindowControls from './WindowControls.vue'

const store = useGameStore()

// Map icons
const icons = {
    User, BookOpen, Users, Terminal, Coffee, Heart, MessageSquare
}

const getIcon = (name) => {
    return icons[name] || User
}

const openExam = () => {
    store.openApp('browser', { mode: 'exam' })
}

// State
const activeChatId = ref('11b')
const showSidebar = ref(true)

// Automatically show sidebar on large screens, hide on small screens
onMounted(() => {
    if (window.innerWidth < 640) {
        showSidebar.value = true // Show by default initially on mobile too, or false depending on preference. Let's set it to true so they see the list.
    }
})
const chats = computed(() => getHistoryChats())

const activeChat = computed(() => chats.value.find(c => c.id === activeChatId.value))

const selectChat = (id) => {
    activeChatId.value = id
    // Hide sidebar on mobile when a chat is selected
    if (window.innerWidth < 640) {
        showSidebar.value = false
    }
}
</script>

<style scoped>
.bg-chat-pattern {
    background-image: radial-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px);
    background-size: 20px 20px;
    background-position: center;
}

.custom-scrollbar-excel::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

.custom-scrollbar-excel::-webkit-scrollbar-track {
    background: #0a0a0a;
}

.custom-scrollbar-excel::-webkit-scrollbar-thumb {
    background: #222;
    border-radius: 10px;
    border: none;
}

/* Base scrollbar for other views */
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(100, 100, 100, 0.3);
    border-radius: 10px;
}
</style>
