<template>
    <section v-motion :initial="{ opacity: 0, y: 30 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 500, ease: 'easeOut' } }" class="mt-12 p-6">
        <div class="border-l-4 border-nebula-primary pl-4">
            <h2 class="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter transition-colors">
                Recursos <span class="text-nebula-primary">&</span> Educación Complementaria
            </h2>
            <p class="text-xs text-slate-400 dark:text-white/50 font-mono transition-colors">// {{ resources.length }}
                RECURSOS INDEXADOS</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <UiCard v-for="(res, i) in resources" :key="res.id" v-motion :initial="{ opacity: 0, y: 30, scale: 0.97 }"
                :enter="{ opacity: 1, y: 0, scale: 1, transition: { duration: 450, delay: 80 + i * 50 } }"
                class="hover:border-nebula-primary/40 transition-all group relative overflow-hidden">
                <div class="p-5 flex flex-col h-full">
                    <div class="flex justify-between items-center mb-4">
                        <component :is="getCategoryStyles(res.category).icon" class="w-5 h-5 text-nebula-primary" />
                        <span
                            class="text-[9px] font-black px-2 py-0.5 rounded bg-nebula-primary/10 dark:bg-nebula-primary/20 text-nebula-primary uppercase transition-colors">
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
                            class="flex-1 py-2.5 bg-slate-100 dark:bg-white/10 hover:bg-nebula-primary text-slate-700 dark:text-white hover:text-white rounded-lg text-[10px] font-black uppercase transition-all border border-slate-200 dark:border-white/5 active:scale-95">
                            {{ isVideo(res.url) ? 'Ver Video' : 'Ir al Recurso' }}
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
    category: 'blog' | 'grammar' | 'practice' | 'portal';
    description: string;
}

// Función para manejar los estilos visuales por categoría
const getCategoryStyles = (category: string) => {
    const styles = {
        blog: {
            icon: Globe,
            border: 'border-nebula-primary/20 hover:border-nebula-primary/50',
            text: 'text-nebula-primary',
            badge: 'bg-nebula-primary/10 text-nebula-primary',
            hover: 'hover:bg-nebula-primary hover:text-white'
        },
        grammar: {
            icon: BookOpen,
            border: 'border-nebula-secondary/20 hover:border-nebula-secondary/50',
            text: 'text-nebula-secondary',
            badge: 'bg-nebula-secondary/10 text-nebula-secondary',
            hover: 'hover:bg-nebula-secondary hover:text-black'
        },
        practice: {
            icon: Youtube,
            border: 'border-nebula-cyan/20 hover:border-nebula-cyan/50',
            text: 'text-nebula-cyan',
            badge: 'bg-nebula-cyan/10 text-nebula-cyan',
            hover: 'hover:bg-nebula-cyan hover:text-black'
        },
        portal: {
            icon: FileText,
            border: 'border-white/10 hover:border-white/30',
            text: 'text-white/70',
            badge: 'bg-white/5 text-white/70',
            hover: 'hover:bg-white hover:text-black'
        }
    }
    return styles[category as keyof typeof styles] || styles.portal
}

const resources: EnglishResource[] = [
    {
        id: 1,
        title: "British Council México",
        url: "https://www.britishcouncil.org.mx/blog/present-perfect",
        category: "blog",
        description: "Explicación detallada del uso del Presente Perfecto."
    },
    {
        id: 2,
        title: "Test-English (Shorts)",
        url: "https://test-english.com/grammar-points/shorts/have-been-vs-have-gone-grammar-shorts/",
        category: "grammar",
        description: "Diferencia entre Have been y Have gone."
    },
    {
        id: 3,
        title: "Test-English (Lección A2)",
        url: "https://test-english.com/grammar-points/a2/present-perfect/",
        category: "grammar",
        description: "Puntos gramaticales nivel A2."
    },
    {
        id: 4,
        title: "Platzi (Guía de Have/Has)",
        url: "https://platzi.com/blog/verbos-ingles-have-has/",
        category: "blog",
        description: "Reglas fundamentales para el uso de auxiliares."
    },
    {
        id: 5,
        title: "Angloeducativo",
        url: "https://angloeducativo.com/blog/presente-perfecto-ingles/",
        category: "grammar",
        description: "Reglas y usos comunes en el contexto educativo."
    },
    {
        id: 6,
        title: "What's Up! (Adverbios)",
        url: "https://whatsup.es/blog/como-usar-already-yet-just-todas-las-claves",
        category: "grammar",
        description: "Claves para usar Already, Yet y Just."
    },
    {
        id: 8,
        title: "Perfect English Grammar (Diff)",
        url: "https://www.perfect-english-grammar.com/present-perfect-or-past-simple.html",
        category: "grammar",
        description: "Diferencias con el Past Simple."
    },
    {
        id: 9,
        title: "Ejercicios Inglés Online",
        url: "https://www.ejerciciosinglesonline.com/articulos/error-present-perfect/",
        category: "practice",
        description: "Análisis de errores comunes."
    },
    {
        id: 10,
        title: "Estudio Gramática",
        url: "https://www.estudiogramatica.com/gramatica-inglesa/palabras-dificiles/been-gone.php",
        category: "grammar",
        description: "Palabras difíciles: Been y Gone."
    },
    {
        id: 11,
        title: "E-Grammar Portal",
        url: "https://www.e-grammar.org/pdf-books/",
        category: "portal",
        description: "Acceso a libros y guías de tiempos verbales."
    },
    {
        id: 12,
        title: "Espresso English",
        url: "https://www.espressoenglish.net",
        category: "portal",
        description: "Guías completas de aprendizaje rápido."
    },
    {
        id: 13,
        title: "All Things Grammar",
        url: "https://www.allthingsgrammar.com",
        category: "portal",
        description: "Quizzes y hojas de trabajo descargables."
    },
    {
        id: 14,
        title: "UTS HELPS",
        url: "https://www.helps.uts.edu.au",
        category: "portal",
        description: "Hojas de práctica académica de UTS."
    },
    {
        id: 15,
        title: "Present Perfect (Mr. Pea)",
        url: "https://youtu.be/7aw7bQtPYCE",
        category: "practice",
        description: "Video educativo que explica la estructura afirmativa, negativa e interrogativa con ejemplos prácticos de verbos regulares e irregulares."
    },
    {
        id: 16,
        title: "Todo sobre el Presente Perfecto (Pacho Ochoa)",
        url: "https://youtu.be/6ATj9Do_RL8",
        category: "grammar",
        description: "Explicación magistral sobre el uso de Have/Has como 'haber', la formación de verbos regulares e irregulares y estructuras en afirmativo, negativo e interrogativo."
    },
    {
        id: 17,
        title: "Diálogo: ¿Nos conocemos? (Uso Real del Present Perfect)",
        url: "https://youtu.be/Cm68YbOvPYM",
        category: "practice",
        description: "Video de práctica auditiva que utiliza estructuras como 'Have we met before?' y 'I've never been to...' en una conversación cotidiana."
    },
    {
        id: 18,
        title: "Cuándo usar el Present Perfect (Sentencias de ejemplo)",
        url: "https://youtu.be/o1_0Gz4uRKo",
        category: "grammar",
        description: "Guía visual que explica los escenarios específicos donde el Presente Perfecto es necesario, acompañado de ejemplos claros de oraciones."
    }
]
</script>