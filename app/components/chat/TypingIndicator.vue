<template>
    <div v-motion :initial="{ opacity: 0, x: -15 }" :enter="{ opacity: 1, x: 0 }" class="flex justify-start mb-4">
        <div
            class="bg-[#1a1525] border border-white/10 p-3 rounded-2xl rounded-tl-none flex gap-1.5 shadow-neon-fuchsia/10">
            <span class="w-1.5 h-1.5 bg-nebula-primary rounded-full animate-bounce"></span>
            <span class="w-1.5 h-1.5 bg-nebula-primary rounded-full animate-bounce [animation-delay:0.2s]"></span>
            <span class="w-1.5 h-1.5 bg-nebula-primary rounded-full animate-bounce [animation-delay:0.4s]"></span>
        </div>
    </div>
</template>