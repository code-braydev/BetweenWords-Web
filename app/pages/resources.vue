<template>
    <section v-motion :initial="{ opacity: 0, y: 30 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 500, ease: 'easeOut' } }" class="mt-12 p-6">
        <div class="border-l-4 border-nebula-primary pl-4">
            <h2 class="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter transition-colors">
                Learning Resources <span class="text-nebula-primary">&</span> Multimedia
            </h2>
            <p class="text-[10px] text-slate-400 dark:text-white/50 font-mono tracking-tight transition-colors">// {{
                resources.length }}
                INDEXED RESOURCES</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <UiCard v-for="(res, i) in resources" :key="res.id" v-motion :initial="{ opacity: 0, y: 30, scale: 0.97 }"
                :enter="{ opacity: 1, y: 0, scale: 1, transition: { duration: 450, delay: 80 + i * 50 } }"
                class="hover:border-nebula-primary/40 transition-all group relative overflow-hidden">
                <div class="p-5 flex flex-col h-full">
                    <div class="flex justify-between items-center mb-4">
                        <component :is="getCategoryStyles(res.category).icon" class="w-5 h-5 text-nebula-primary" />
                        <span
                            class="text-[9px] font-black px-2 py-0.5 rounded bg-nebula-primary/10 dark:bg-nebula-primary/20 text-nebula-primary uppercase tracking-tighter transition-colors">
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
                            class="flex-1 py-2.5 bg-slate-100 dark:bg-white/10 hover:bg-nebula-primary text-slate-700 dark:text-white hover:text-white rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all border border-slate-200 dark:border-white/5 active:scale-95">
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
import { Youtube, Globe, BookOpen, FileText, X } from 'lucide-vue-next'

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

const handleAction = (res: any) => {
    if (isVideo(res.url)) {
        activeVideo.value = res.id
    } else {
        window.open(res.url, '_blank')
    }
}

interface EnglishResource {
    id: number;
    title: string;
    url: string;
    category: 'Article' | 'Grammar Guide' | 'Practice Lab' | 'Resource Hub';
    description: string;
}

// Función para manejar los estilos visuales por categoría
const getCategoryStyles = (category: string) => {
    const styles = {
        'Article': {
            icon: Globe,
            border: 'border-nebula-primary/20 hover:border-nebula-primary/50',
            text: 'text-nebula-primary',
            badge: 'bg-nebula-primary/10 text-nebula-primary',
            hover: 'hover:bg-nebula-primary hover:text-white'
        },
        'Grammar Guide': {
            icon: BookOpen,
            border: 'border-nebula-secondary/20 hover:border-nebula-secondary/50',
            text: 'text-nebula-secondary',
            badge: 'bg-nebula-secondary/10 text-nebula-secondary',
            hover: 'hover:bg-nebula-secondary hover:text-black'
        },
        'Practice Lab': {
            icon: Youtube,
            border: 'border-nebula-cyan/20 hover:border-nebula-cyan/50',
            text: 'text-nebula-cyan',
            badge: 'bg-nebula-cyan/10 text-nebula-cyan',
            hover: 'hover:bg-nebula-cyan hover:text-black'
        },
        'Resource Hub': {
            icon: FileText,
            border: 'border-white/10 hover:border-white/30',
            text: 'text-white/70',
            badge: 'bg-white/5 text-white/70',
            hover: 'hover:bg-white hover:text-black'
        }
    }
    return styles[category as keyof typeof styles] || styles['Resource Hub']
}

const resources: EnglishResource[] = [
    // 1. VIDEOS (Practice Lab)
    {
        id: 6,
        title: "Present Perfect (Aprende Inglés)",
        url: "https://www.youtube.com/watch?v=3IMTNomhg-E",
        category: "Practice Lab",
        description: "Video tutorial paso a paso sobre la formación de oraciones en presente perfecto."
    },
    {
        id: 7,
        title: "Mastering Present Perfect",
        url: "https://www.youtube.com/watch?v=553eeL1Dvho",
        category: "Practice Lab",
        description: "Clase magistral en video sobre matices avanzados del presente perfecto."
    },
    {
        id: 8,
        title: "7ESL Grammar Lesson",
        url: "https://www.youtube.com/watch?v=XySNOXSiBMo",
        category: "Practice Lab",
        description: "Lección visual con gráficos para entender mejor el flujo del tiempo en este tiempo verbal."
    },
    {
        id: 9,
        title: "Present Perfect vs Past Simple",
        url: "https://www.youtube.com/watch?v=vM5trdispow",
        category: "Practice Lab",
        description: "Video comparativo para entender la diferencia crucial entre el pasado simple y el presente perfecto."
    },
    {
        id: 10,
        title: "BBC Learning English",
        url: "https://www.youtube.com/watch?v=-wJF0kizrxI",
        category: "Practice Lab",
        description: "Explicación rápida y divertida del estilo BBC sobre el uso de este tiempo verbal."
    },

    // 2. PDFs (Resource Hub)
    {
        id: 16,
        title: "Universidad Veracruzana (Guía)",
        url: "https://www.uv.mx/pozarica/cadi/files/2019/11/Ingles-2-Tema-6.pdf",
        category: "Resource Hub",
        description: "Documento académico detallado con teoría y ejercicios prácticos de traducción."
    },
    {
        id: 17,
        title: "UHU Grammar Support",
        url: "https://www.uhu.es/antonia.dominguez/presentperfect.pdf",
        category: "Resource Hub",
        description: "Material de apoyo universitario sobre la línea de tiempo y adverbios de tiempo."
    },
    {
        id: 18,
        title: "Perfect English Grammar (PDF)",
        url: "https://www.perfect-english-grammar.com/support-files/present-perfect-use.pdf",
        category: "Resource Hub",
        description: "Hoja de referencia rápida ideal para imprimir y estudiar en cualquier lugar."
    },
    {
        id: 19,
        title: "Your English Source Sheet",
        url: "https://yourenglishsource.com/wp-content/uploads/2015/02/L49-Present-Perfect.pdf",
        category: "Resource Hub",
        description: "Ficha de trabajo con oraciones para completar y claves de corrección."
    },
    {
        id: 20,
        title: "Cengage Learning Module",
        url: "https://ngl.cengage.com/assets/downloads/grcontext_pro0000000013/in_context_2_su.pdf",
        category: "Resource Hub",
        description: "Módulo de aprendizaje en contexto para ver el presente perfecto aplicado a textos reales."
    },

    // 3. THE REST (Articles & Tests)
    {
        id: 1,
        title: "The TEFL Academy Blog",
        url: "https://www.theteflacademy.com/blog/an-explanation-of-the-present-perfect/",
        category: "Article",
        description: "Una explicación clara y concisa sobre cuándo y cómo usar el presente perfecto en situaciones cotidianas."
    },
    {
        id: 2,
        title: "British Council México",
        url: "https://www.britishcouncil.org.mx/blog/present-perfect",
        category: "Article",
        description: "Guía completa del British Council sobre la estructura y los usos principales del tiempo verbal."
    },
    {
        id: 3,
        title: "Grammarly Grammar Guide",
        url: "https://www.grammarly.com/blog/grammar/present-perfect-tense/",
        category: "Article",
        description: "Análisis profundo de la gramática del presente perfecto con ejemplos de errores comunes a evitar."
    },
    {
        id: 4,
        title: "Break Into English",
        url: "https://breakintoenglish.com/blog/how-to-learn-english/present-perfect/",
        category: "Article",
        description: "Consejos prácticos y trucos para dominar el presente perfecto rápidamente."
    },
    {
        id: 5,
        title: "English Coach Online",
        url: "https://englishcoachonline.com/blog/present-perfect-life-experiences/",
        category: "Article",
        description: "Enfoque especial en el uso del presente perfecto para hablar sobre experiencias de vida."
    },
    {
        id: 11,
        title: "Educaplay: Presente Perfecto",
        url: "https://es.educaplay.com/recursos-educativos/7557610-presente_perfecto.html",
        category: "Practice Lab",
        description: "Actividad interactiva y juego para poner a prueba tus conocimientos sobre la estructura gramatical."
    },
    {
        id: 12,
        title: "Test-English (A2 Quiz)",
        url: "https://test-english.com/grammar-points/a2/present-perfect/",
        category: "Practice Lab",
        description: "Examen de nivel A2 con resultados instantáneos y explicaciones de cada respuesta."
    },
    {
        id: 13,
        title: "Oxford University Press Test",
        url: "https://elt.oup.com/student/grammarfriends/level05/tests/test01",
        category: "Practice Lab",
        description: "Prueba oficial de Oxford para evaluar el dominio de los auxiliares have/has."
    },
    {
        id: 14,
        title: "British Council Kids (Games)",
        url: "https://learnenglishkids.britishcouncil.org/grammar-vocabulary/grammar-practice/present-perfect-experiences",
        category: "Practice Lab",
        description: "Juegos y ejercicios interactivos centrados en experiencias y viajes."
    },
    {
        id: 15,
        title: "Ego4u Comprehensive Test",
        url: "https://www.ego4u.com/en/cram-up/tests/present-perfect-simple-1",
        category: "Practice Lab",
        description: "Uno de los tests más completos de la web para dominar la forma simple del presente perfecto."
    }
]
</script>