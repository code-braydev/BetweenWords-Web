<template>
    <div class="p-4 bg-black/20 backdrop-blur-xl border-t border-white/5">
        <form @submit.prevent="handleSend" class="flex items-end gap-3">
            <UiInput v-model="text" placeholder="Type a message to Ari..." :icon="MessageSquare" class="flex-1" />

            <UiButton variant="primary" size="md" :icon="Send" :disabled="!text.trim() || loading" :loading="loading"
                @click="handleSend" />
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { MessageSquare, Send } from 'lucide-vue-next'

const props = defineProps({
    loading: Boolean
})

const text = ref('')
const emit = defineEmits(['send'])

const handleSend = () => {
    if (text.value.trim() && !props.loading) {
        emit('send', text.value)
        text.value = ''
    }
}
</script>