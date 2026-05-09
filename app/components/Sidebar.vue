<template>
    <aside :class="[
        'w-16 h-full flex flex-col items-center py-6 gap-8 z-[100] transition-all duration-500 ease-in-out',
        $route.path === '/'
            ? 'bg-white/0 dark:bg-black/0 border-r border-slate-200/0 dark:border-white/0'
            : 'bg-white/80 dark:bg-black/60 backdrop-blur-xl border-r border-slate-200 dark:border-white/5'
    ]">
        <div class="group relative cursor-pointer" @click="navigateTo('/')">
            <div
                class="absolute -inset-2 bg-nebula-primary/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity">
            </div>
            <img src="/logo.png" class="w-10 h-10 relative z-10" />
        </div>

        <nav class="flex flex-col gap-6">
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

            <UiTooltip text="CREDITS">
                <UiButton variant="subtle" size="sm" :class="buttonClass" :icon="Hammer"
                    @click="navigateTo('/credits')" />
            </UiTooltip>
        </nav>

        <div class="mt-auto flex flex-col gap-6">
            <UiTooltip text="SETTINGS">
                <UiButton variant="subtle" size="sm" :class="buttonClass" :icon="Settings" @click="$emit('settings')" />
            </UiTooltip>
        </div>
    </aside>
</template>

<script setup>
import { GraduationCap, MessageCircle, Folder, Settings, Hammer, Notebook } from 'lucide-vue-next'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isGlass = computed(() => route.path === '/')
const buttonClass = computed(() => (isGlass.value ? '!text-nebula-text hover:!text-white transition-colors duration-500 ease-in-out' : 'transition-colors duration-500 ease-in-out'))

defineEmits(['settings'])
</script>