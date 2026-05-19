<template>
    <!-- ── Mobile: Hamburger Toggle Button ── -->
    <!-- Only shown when sidebar is NOT conflicting with fullscreen; z-index is kept below maximized apps -->
    <div class="sm:hidden fixed top-3 right-3 z-[60]">
        <button @click="isOpen = !isOpen"
            class="w-9 h-9 flex items-center justify-center rounded-lg bg-black/40 backdrop-blur-xl border border-white/10 text-white/70 hover:text-white hover:border-white/20 transition-all active:scale-95"
            :aria-label="isOpen ? 'Close menu' : 'Open menu'">
            <Menu v-if="!isOpen" class="w-4 h-4" />
            <X v-else class="w-5 h-5" />
        </button>
    </div>

    <!-- ── Mobile: Backdrop Overlay ── -->
    <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition duration-150 ease-in" leave-from-class="opacity-100"
        leave-to-class="opacity-0">
        <div v-if="isOpen" class="sm:hidden fixed inset-0 bg-black/50 z-[55]" @click="isOpen = false" />
    </Transition>

    <!-- ── Sidebar Panel ── -->
    <aside :class="[
        'transition-all duration-400 ease-in-out',
        // Desktop: always-visible slim vertical rail
        'sm:relative sm:translate-x-0 sm:w-16 sm:h-full sm:flex sm:flex-col sm:items-center sm:py-6 sm:gap-6 sm:border-r',
        // Mobile: slide-in drawer from left
        'fixed top-0 left-0 h-full z-[58]',
        isOpen ? 'translate-x-0 w-56' : '-translate-x-full w-56 sm:w-16',
        // Background & border styles
        isGlass && !isOpen
            ? 'bg-transparent border-transparent'
            : 'bg-black/70 backdrop-blur-2xl border-white/5 shadow-2xl',
    ]">
        <!-- ── Logo + Brand ── -->
        <div class="flex items-center gap-3 px-4 py-5 sm:px-0 sm:py-0 sm:justify-center cursor-pointer group"
            @click="goTo('/')">
            <div class="relative shrink-0">
                <div
                    class="absolute -inset-1.5 bg-nebula-primary/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                </div>
                <img src="/logo.webp" class="w-9 h-9 relative z-10" alt="Between Words Logo" />
            </div>
            <!-- Brand name — hidden on desktop slim rail, visible in mobile drawer -->
            <span class="sm:hidden text-white font-black text-base tracking-tight truncate">Between</span>
        </div>

        <!-- ── Navigation Links ── -->
        <nav class="flex-1 flex flex-col gap-1 sm:gap-5 w-full px-3 sm:px-0 sm:items-center mt-2 sm:mt-0">

            <!-- HOME — only in mobile drawer (desktop goes to logo) -->
            <button @click="goTo('/')"
                class="sm:hidden flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-white/60 hover:text-white hover:bg-white/5 transition-all text-sm font-medium">
                <Home class="w-4 h-4 shrink-0" />
                <span>Home</span>
            </button>

            <!-- LEARNING -->
            <UiTooltip text="LEARNING">
                <button @click="goTo('/learning')" :class="navBtnClass">
                    <GraduationCap class="w-5 h-5 shrink-0" />
                    <span class="sm:hidden text-sm font-medium">Learning</span>
                </button>
            </UiTooltip>

            <!-- ACTIVITIES -->
            <UiTooltip text="ACTIVITIES">
                <button @click="goTo('/activities')" :class="navBtnClass">
                    <Notebook class="w-5 h-5 shrink-0" />
                    <span class="sm:hidden text-sm font-medium">Activities</span>
                </button>
            </UiTooltip>

            <!-- RESOURCES -->
            <UiTooltip text="RESOURCES">
                <button @click="goTo('/resources')" :class="navBtnClass">
                    <Folder class="w-5 h-5 shrink-0" />
                    <span class="sm:hidden text-sm font-medium">Resources</span>
                </button>
            </UiTooltip>

            <!-- ARI — only shown when session is active (user is registered / game started) -->
            <UiTooltip v-if="showAri" text="AI_MESSAGES">
                <button @click="goTo('/message')" :class="navBtnClass">
                    <MessageCircle class="w-5 h-5 shrink-0" />
                    <span class="sm:hidden text-sm font-medium">Ari</span>
                </button>
            </UiTooltip>

            <!-- CREDITS -->
            <UiTooltip text="CREDITS">
                <button @click="goTo('/credits')" :class="navBtnClass">
                    <Hammer class="w-5 h-5 shrink-0" />
                    <span class="sm:hidden text-sm font-medium">Credits</span>
                </button>
            </UiTooltip>
        </nav>

        <!-- ── Mobile: Close Button (bottom of drawer) ── -->
        <div class="sm:hidden px-3 pb-6">
            <button @click="isOpen = false"
                class="w-full py-2.5 flex items-center justify-center gap-2 rounded-lg bg-white/5 border border-white/10 text-white/40 hover:text-white/70 text-xs font-bold uppercase tracking-widest transition-all">
                <X class="w-4 h-4" />
                Cerrar
            </button>
        </div>
    </aside>
</template>

<script setup>
import { GraduationCap, MessageCircle, Folder, Hammer, Notebook, Home, Menu, X } from 'lucide-vue-next'
import { computed, ref } from 'vue'

const route = useRoute()
const store = useGameStore()
const isOpen = ref(false)

// Transparent sidebar only on the home desktop view (not in drawer mode)
const isGlass = computed(() => route.path === '/' && !isOpen.value)

// Ari (AI assistant) is only available when there is an active session
// i.e. there is a session parameter in the URL, that session is valid/active,
// and they've gone past the start screen and are in the game environment
const showAri = computed(() => {
    const isSessionValid = store.session.valid
    return isSessionValid
})

// Unified nav button class — icon-only on desktop, icon+label on mobile
const navBtnClass = computed(() => [
    'flex items-center gap-3 w-full sm:w-auto sm:justify-center px-3 sm:px-0 py-2.5 sm:py-0 rounded-lg sm:rounded-none',
    'transition-all duration-200',
    isGlass.value
        ? 'text-white/60 hover:text-white'
        : 'text-white/50 hover:text-white hover:bg-white/5 sm:hover:bg-transparent',
])

const goTo = (path) => {
    isOpen.value = false
    navigateTo({ path, query: route.query })
}

defineEmits(['settings'])
</script>