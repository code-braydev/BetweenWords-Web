<template>
    <div :class="['flex w-full mb-4', isUser ? 'justify-end' : 'justify-start']">
        <div v-if="!isUser" class="mr-2 mt-auto">
            <div
                class="w-6 h-6 rounded-full bg-nebula-primary flex items-center justify-center shadow-[0_0_10px_rgba(var(--color-primary),0.5)]">
                <Sparkles class="w-3 h-3 text-white" />
            </div>
        </div>

        <div :class="[
            'max-w-[75%] px-4 py-3 rounded-2xl text-[13px] leading-relaxed transition-all',
            isUser
                ? 'bg-nebula-primary text-white rounded-br-none shadow-[0_5px_15px_rgba(0,0,0,0.2)]'
                : 'bg-[#1a1525] border border-white/10 text-white/90 rounded-bl-none'
        ]">
            <p>{{ message }}</p>

            <span :class="['block mt-1 text-[9px] opacity-30 font-mono', isUser ? 'text-right' : 'text-left']">
                {{ time }}
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Sparkles } from 'lucide-vue-next'

defineProps<{
    message: string
    isUser: boolean
    time: string
}>()
</script>