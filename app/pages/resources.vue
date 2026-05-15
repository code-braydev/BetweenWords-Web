<template>
    <section v-motion :initial="{ opacity: 0, y: 30 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 500, ease: 'easeOut' } }" class="mt-12 p-6">
        <div class="border-l-4 border-nebula-primary pl-4">
            <h2 class="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter transition-colors">
                Learning Resources <span class="text-nebula-primary">&</span> Multimedia
            </h2>
            <p class="text-[10px] text-slate-400 dark:text-white/50 font-mono tracking-tight transition-colors">// {{
                TOTAL_RESOURCES }} INDEXED RESOURCES</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
            <UiCard v-for="(res, i) in resources" :key="res.id" v-motion :initial="{ opacity: 0, y: 30, scale: 0.97 }"
                :enter="{ opacity: 1, y: 0, scale: 1, transition: { duration: 450, delay: 80 + i * 50 } }"
                class="transition-all group relative overflow-hidden"
                :class="getCategoryStyles(res.category).border">
                <div class="p-5 flex flex-col h-full">
                    <div class="flex justify-between items-center mb-4">
                        <component :is="getCategoryStyles(res.category).icon" class="w-5 h-5 transition-colors"
                            :class="getCategoryStyles(res.category).text" />
                        <span
                            class="text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-tighter transition-colors"
                            :class="getCategoryStyles(res.category).badge">
                            {{ res.category }}
                        </span>
                    </div>

                    <div class="flex-1 mb-6">
                        <h4
                            class="text-[14px] font-bold text-slate-900 dark:text-white group-hover:text-nebula-primary transition-colors">
                            {{ res.title }}
                        </h4>
                        <p class="text-[11px] text-slate-500 dark:text-white/40 mt-1 leading-relaxed transition-colors">
                            {{ res.description }}
                        </p>
                    </div>

                    <div class="flex gap-2">
                        <button @click="handleAction(res)"
                            class="flex-1 py-2.5 bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-white rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all border border-slate-200 dark:border-white/5 active:scale-95"
                            :class="getCategoryStyles(res.category).hover">
                            {{ isVideo(res.url) ? '▶ WATCH VIDEO' : '↗ OPEN RESOURCE' }}
                        </button>
                    </div>
                </div>

                <div v-if="activeVideo === res.id" class="absolute inset-0 bg-black z-20 flex flex-col">
                    <button @click="activeVideo = null"
                        class="absolute top-2 right-2 text-white bg-red-500/50 p-1 rounded-full z-30">
                        <X class="w-4 h-4" />
                    </button>
                    <iframe :src="getEmbedUrl(res.url)" class="w-full h-full" frameborder="0"
                        allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>
                </div>
            </UiCard>
        </div>
    </section>
    <Footer />
</template>


<script setup lang="ts">
import { ref } from 'vue'
import { X } from 'lucide-vue-next'
import resourcesData, { getCategoryStyles, TOTAL_RESOURCES, type EnglishResource } from '~/constant/resources'

const resources = resourcesData.resources as EnglishResource[]
const activeVideo = ref<number | null>(null)

// Función para transformar link de YouTube a Embed
const getEmbedUrl = (url: string) => {
    if (url.includes('youtu.be')) {
        const id = url.split('/').pop()?.split('?')[0]
        return `https://www.youtube.com/embed/${id}?autoplay=1`
    }
    if (url.includes('youtube.com')) {
        const id = url.split('v=')[1]?.split('&')[0]
        return `https://www.youtube.com/embed/${id}?autoplay=1`
    }
    return url
}

const isVideo = (url: string) => url.includes('youtube.com') || url.includes('youtu.be')

const handleAction = (res: EnglishResource) => {
    if (isVideo(res.url)) {
        activeVideo.value = res.id
    } else {
        window.open(res.url, '_blank')
    }
}
</script>
