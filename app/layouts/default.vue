<template>
    <div
        class="h-screen w-screen flex bg-slate-50 dark:bg-nebula-dark overflow-hidden font-sans relative transition-colors duration-500">
        <div class="absolute inset-0 bg-space-desktop bg-cover bg-center transition-all duration-700 opacity-0 dark:opacity-100"
            :class="{ 'blur-sm scale-105': store.status.currentStep === 'login' }">
            <div class="absolute inset-0 bg-gradient-to-br from-nebula-dark/40 via-transparent to-nebula-dark/80">
            </div>
        </div>

        <Sidebar class="relative z-20" :glass="$route.path === '/'"
            @settings="showSettingsModal = !showSettingsModal" />

        <StudentModal :show="shouldShowModal" @cancel="showSettingsModal = false"
            @registered="showSettingsModal = false" />

        <main class="flex-1 relative z-10">

            <div class="relative z-10 h-full w-full overflow-y-auto custom-scrollbar flex flex-col">
                <div class="flex-1">
                    <slot />
                </div>
            </div>
        </main>
    </div>
</template>
<style>
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(245, 44, 245, 0.4);
    border-radius: 10px;
}

@media (prefers-color-scheme: dark) {
    .custom-scrollbar::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.2);
    }

    .custom-scrollbar::-webkit-scrollbar-thumb {
        background: rgba(245, 44, 245, 0.6);
    }
}
</style>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useGameStore } from '@/stores/useGameStore'
import { useVoice } from '@/composables/useVoice'

const route = useRoute()
const store = useGameStore()
const { speak } = useVoice()

const isUserInfoComplete = computed(() => store.user.fullName && store.user.grade && store.user.group)
const isModalForced = computed(() => !isUserInfoComplete.value)
const showSettingsModal = ref(false)
const isMounted = ref(false)

onMounted(() => {
    isMounted.value = true
})

const shouldShowModal = computed(() => {
    if (!isMounted.value) return false
    return showSettingsModal.value || isModalForced.value
})

</script>