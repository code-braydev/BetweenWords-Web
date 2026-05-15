<template>
    <UiModal :show="show" title="PROTOCOL_01: STxDENT_IDENTIFICxTION_" variant="transparent" @close="$emit('cancel')">
        <div class="space-y-6">
            <div
                class="flex items-center gap-4 p-3 bg-nebula-primary/10 dark:bg-nebula-primary/30 rounded-xl transition-colors">
                <div class="p-2 bg-nebula-primary rounded-lg shadow-neon-fuchsia">
                    <UserCheck class="w-5 h-5 text-white" />
                </div>
                <div>
                    <h4
                        class="text-white/60 dark:text-nebula-text font-mono text-sm font-bold uppercase transition-colors">
                        Identity Verification</h4>
                    <p class="text-[10px] text-nebula-primary/80 dark:text-nebula-cyan/70 font-mono italic">Please
                        provide your personal details to
                        proceed.</p>
                </div>
            </div>
            <div class="space-y-4">
                <UiInput v-model="form.fullName" label="Full Name" placeholder="E.g. Michelle Ruiz" :icon="User"
                    :glass="true" />
                <div class="space-y-2">
                    <UiInput v-model="form.nickname" label="Nickname (Optional)" placeholder="E.g. Michi / Guest-User" :icon="Hash"
                        :glass="true" />
                    <p class="text-[9px] text-nebula-primary/70 dark:text-nebula-cyan/70 font-mono italic">This
                        information is optional; it is only
                        used to personalize your experience.</p>
                </div>
            </div>
            <div class="pt-4 border-t border-slate-200 dark:border-white/5 flex flex-col gap-3 transition-colors">
                <UiButton label="INITIALIZE MISSION" variant="primary" size="lg" :icon="Rocket" :disabled="!isFormValid"
                    @click="handleSubmit" />
                <p
                    class="text-[9px] text-center text-slate-400 dark:text-white/30 font-mono uppercase tracking-tighter transition-colors">
                    Encryption Level: AES-256
                </p>
            </div>
        </div>
    </UiModal>
</template>

<script setup>
import { ref, computed } from 'vue'
import { User, Hash, Rocket, UserCheck } from 'lucide-vue-next'
import { useGameStore } from '@/stores/useGameStore'

const props = defineProps({
    show: Boolean
})

const emit = defineEmits(['registered', 'cancel'])
const store = useGameStore()

// Form state
const form = ref({
    fullName: '',
    nickname: ''
})

// Form validation
const isFormValid = computed(() => {
    return form.value.fullName.trim().length > 3
})

// Prevent closing if user is not registered
const isUserInfoComplete = computed(() => !!store.user.fullName)
const preventClose = computed(() => !isUserInfoComplete.value)

// Handle form submission
const handleSubmit = () => {
    if (isFormValid.value) {
        store.user.fullName = form.value.fullName.trim()
        store.user.nickname = form.value.nickname.trim() || 'Guest-User'
        emit('registered')
    }
}
</script>