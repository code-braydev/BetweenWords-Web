<template>
    <div class="inline-flex flex-col items-center text-center select-none">
        <div class="text-7xl font-mono font-semibold pl-10 text-white tracking-wider transition-colors">{{ time }}</div>
        <div class="text-2xl font-mono text-nebula-cyan/70 transition-colors">{{ date }}</div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const time = ref('')
const date = ref('')

const updateTime = () => {
    const now = new Date();

    const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };

    const rawTime = new Intl.DateTimeFormat('en-US', options).formatToParts(now);

    const h = rawTime.find((p) => p.type === 'hour')?.value ?? String((now.getHours() % 12) || 12).padStart(2, '0');
    const m = rawTime.find((p) => p.type === 'minute')?.value ?? String(now.getMinutes()).padStart(2, '0');
    const dayPeriod = rawTime.find((p) => p.type === 'dayPeriod')?.value ?? (now.getHours() >= 12 ? 'PM' : 'AM');

    time.value = `${h}:${m} ${dayPeriod.replace(/\./g, '').toLowerCase()}`;
    date.value = now.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
};

let timer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
    updateTime()
    timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
    if (timer) clearInterval(timer)
})
</script>

<style scoped>
.text-7xl {
    line-height: 1;
}
</style>