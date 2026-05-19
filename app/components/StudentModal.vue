<template>
    <UiModal :show="show" title="PROTOCOL_01: STxDENT_IDENTIFICxTION_" variant="transparent" :preventClose="true">
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
                <UiInput ref="fullNameRef" v-model="form.fullName" label="Full Name *" placeholder="E.g. Michelle Ruiz"
                    :icon="User" :glass="true" :error="errors.fullName" @keydown.enter.prevent="handleFullNameEnter" />

                <UiSelect ref="gradeGroupRef" v-model="form.gradeGroup" label="Grade & Group (Optional)"
                    placeholder="Select your grade and group" :glass="true" :options="gradeGroupOptions"
                    @update:modelValue="handleGradeGroupSelected" />

                <div class="space-y-2">
                    <UiInput ref="nicknameRef" v-model="form.nickname" label="Nickname (Optional)"
                        placeholder="E.g. Michi / Guest-User" :icon="Hash" :glass="true"
                        @keydown.enter.prevent="handleNicknameEnter" />
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

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { User, Hash, Rocket, UserCheck } from 'lucide-vue-next'
import { useGameStore } from '@/stores/useGameStore'

const props = defineProps({
    show: Boolean
})

const emit = defineEmits(['registered', 'cancel'])
const store = useGameStore()

const gradeGroupOptions = [
    { value: '10°1', label: '10°1' },
    { value: '10°2', label: '10°2' },
    { value: '10°3', label: '10°3' },
    { value: '10°4', label: '10°4' },
    { value: '11°1', label: '11°1' },
    { value: '11°2', label: '11°2' },
    { value: '11°3', label: '11°3' },
    { value: '11°4', label: '11°4' },
]

// Form state
const form = ref({
    fullName: '',
    nickname: '',
    gradeGroup: ''
})

const errors = ref({
    fullName: ''
})

const fullNameRef = ref<any>(null)
const gradeGroupRef = ref<any>(null)
const nicknameRef = ref<any>(null)

// Form validation — require fullName to have at least 3 words
const isFormValid = computed(() => {
    const name = form.value.fullName.trim()
    const words = name.split(/\s+/).filter(word => word.length > 0)
    return words.length >= 3
})

const validateFullName = () => {
    const name = form.value.fullName.trim()
    if (!name) {
        errors.value.fullName = 'El nombre completo es requerido.'
        return false
    }
    const words = name.split(/\s+/).filter(word => word.length > 0)
    if (words.length < 3) {
        errors.value.fullName = 'Por favor, ingresa al menos 3 palabras (nombres y apellidos).'
        return false
    }
    errors.value.fullName = ''
    return true
}

// Clear error as they type and reach 3 words
watch(() => form.value.fullName, (newVal) => {
    if (errors.value.fullName) {
        const words = newVal.trim().split(/\s+/).filter(w => w.length > 0)
        if (words.length >= 3) {
            errors.value.fullName = ''
        }
    }
})

const handleFullNameEnter = () => {
    if (validateFullName()) {
        // Move focus to Grade & Group dropdown and open it
        gradeGroupRef.value?.focusButton()
        if (gradeGroupRef.value) {
            gradeGroupRef.value.open = true
        }
    }
}

const handleGradeGroupSelected = () => {
    // When an option is selected, move focus to Nickname
    setTimeout(() => {
        const inputEl = nicknameRef.value?.$el?.querySelector('input')
        if (inputEl) inputEl.focus()
    }, 50)
}

const handleNicknameEnter = () => {
    if (isFormValid.value) {
        handleSubmit()
    } else {
        validateFullName()
    }
}

// Handle form submission
const handleSubmit = () => {
    if (!isFormValid.value) return

    const fullName = form.value.fullName.trim()
    const nickname = form.value.nickname.trim() || 'Guest-User'
    const gradeGroup = form.value.gradeGroup.trim() || 'Unknown-Group'

    // Update Pinia store directly (persistence handled by store)
    store.setIdentity({
        fullName,
        nickname,
        gradeGroup
    })

    emit('registered')
}
</script>