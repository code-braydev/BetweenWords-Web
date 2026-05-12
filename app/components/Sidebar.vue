<template>
    <aside :class="[
        'z-[100] transition-all duration-500 ease-in-out',
        // Desktop: Vertical sidebar
        'sm:w-16 sm:h-full sm:flex sm:flex-col sm:items-center sm:py-6 sm:gap-8 sm:border-r',
        // Mobile: Bottom navigation
        'fixed bottom-0 left-0 right-0 h-16 w-full flex flex-row items-center justify-around px-4 border-t sm:relative sm:bottom-auto sm:left-auto sm:right-auto sm:h-full sm:w-16 sm:border-t-0',
        // Glassmorphism logic
        $route.path === '/'
            ? 'bg-white/0 dark:bg-black/0 border-transparent dark:border-transparent'
            : 'bg-white/80 dark:bg-black/60 backdrop-blur-xl border-slate-200 dark:border-white/5'
    ]">
        <div class="group relative cursor-pointer hidden sm:block" @click="navigateTo('/')">
            <div
                class="absolute -inset-2 bg-nebula-primary/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity">
            </div>
            <img src="/logo.png" class="w-10 h-10 relative z-10" />
        </div>

        <nav class="flex flex-row sm:flex-col gap-2 sm:gap-6 w-full sm:w-auto justify-around sm:justify-start">
            <UiTooltip text="HOME" class="sm:hidden">
                <UiButton variant="subtle" size="sm" :class="buttonClass" :icon="Home"
                    @click="navigateTo('/')" />
            </UiTooltip>

            <UiTooltip text="LEARNING">
                <UiButton variant="subtle" size="sm" :class="buttonClass" :icon="GraduationCap"
                    @click="navigateTo('/learning')" />
            </UiTooltip>

            <UiTooltip text="AI_MESSAGES">
                <UiButton variant="subtle" size="sm" :class="buttonClass" :icon="MessageCircle"
                    @click="navigateTo('/message')" />
            </UiTooltip>

            <UiTooltip text="RESOURCES">
                <UiButton variant="subtle" size="sm" :class="buttonClass" :icon="Folder"
                    @click="navigateTo('/resources')" />
            </UiTooltip>

            <UiTooltip text="ACTIVITIES">
                <UiButton variant="subtle" size="sm" :class="buttonClass" :icon="Notebook"
                    @click="navigateTo('/activities')" />
            </UiTooltip>

            <UiTooltip text="CREDITS" class="hidden sm:block">
                <UiButton variant="subtle" size="sm" :class="buttonClass" :icon="Hammer"
                    @click="navigateTo('/credits')" />
            </UiTooltip>
        </nav>

        <div class="mt-auto hidden sm:flex flex-col gap-6">
            <UiTooltip text="SETTINGS">
                <UiButton variant="subtle" size="sm" :class="buttonClass" :icon="Settings" @click="$emit('settings')" />
            </UiTooltip>
        </div>
    </aside>
</template>

<script setup>
import { GraduationCap, MessageCircle, Folder, Settings, Hammer, Notebook, Home } from 'lucide-vue-next'
import { computed } from 'vue'

const route = useRoute()
const isGlass = computed(() => route.path === '/')
const buttonClass = computed(() => (isGlass.value ? '!text-nebula-text hover:!text-white transition-colors duration-500 ease-in-out' : 'transition-colors duration-500 ease-in-out'))

defineEmits(['settings'])
</script>