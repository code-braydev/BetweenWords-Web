<template>
    <div
        class="flex h-full flex-col bg-slate-50/90 dark:bg-[#050505]/95 backdrop-blur-3xl rounded-2xl overflow-hidden border border-slate-300 dark:border-white/10 shadow-2xl relative">
        <!-- Browser Toolbar -->
        <div
            class="h-12 bg-slate-200/80 dark:bg-black/60 backdrop-blur-xl border-b border-slate-300 dark:border-white/10 flex items-center px-4 gap-4 shrink-0 z-50 shadow-lg justify-between">
            <div class="flex items-center gap-4 flex-1">
                <GameWindowControls />
                <div class="gap-2 text-slate-500 dark:text-white/40 hidden sm:flex">
                    <ChevronLeft @click="goBack"
                        class="w-5 h-5 cursor-pointer hover:text-slate-800 dark:hover:text-white transition-colors"
                        :class="{ 'opacity-30 cursor-not-allowed': historyIndex === 0 }" />
                    <ChevronRight @click="goForward"
                        class="w-5 h-5 cursor-pointer hover:text-slate-800 dark:hover:text-white transition-colors"
                        :class="{ 'opacity-30 cursor-not-allowed': historyIndex >= history.length - 1 }" />
                    <RotateCw @click="reload"
                        class="w-4 h-4 mt-0.5 cursor-pointer hover:text-slate-800 dark:hover:text-white transition-colors"
                        :class="{ 'animate-spin text-nebula-primary': isReloading }" />
                </div>
                <!-- URL / Search Bar -->
                <div
                    class="flex-1 max-w-2xl bg-white/50 dark:bg-white/5 border border-slate-300 dark:border-white/10 rounded-lg h-8 flex items-center px-3 gap-2">
                    <Lock v-if="currentView === 'exam'" class="w-3 h-3 text-emerald-500" />
                    <Search v-else class="w-3 h-3 text-slate-400" />
                    <input v-if="currentView !== 'exam'" v-model="searchQuery" type="text"
                        placeholder="Search niX or enter web address..." @keydown.enter="onSearchEnter"
                        class="bg-transparent border-none outline-none w-full text-xs font-mono text-slate-700 dark:text-white/80 placeholder:text-slate-500 dark:placeholder:text-white/30 focus:ring-0" />
                    <span v-else
                        class="text-xs font-mono text-slate-700 dark:text-white/80 select-all">http://exam.local/final-quiz</span>
                </div>
            </div>

            <!-- Help Button -->
            <button @click="showHelpModal = true"
                class="w-8 h-8 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 flex items-center justify-center transition-colors">
                <HelpCircle class="w-4 h-4 text-slate-500 dark:text-white/60" />
            </button>
        </div>

        <!-- Browser Content -->
        <div class="flex-1 overflow-y-auto custom-scrollbar relative">

            <!-- ═══════════════ HOME VIEW ═══════════════ -->
            <div v-if="currentView === 'home'"
                class="absolute inset-0 flex flex-col items-center justify-center p-6 animate-fade-in">
                <!-- Logo -->
                <div class="mb-8 flex flex-col items-center">
                    <div
                        class="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-nebula-primary to-nebula-cyan flex items-center justify-center mb-6 shadow-[0_0_40px_rgba(245,44,245,0.4)]">
                        <Globe class="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                    </div>
                    <h1
                        class="text-5xl sm:text-7xl font-black font-mono tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-nebula-primary to-nebula-cyan">
                        niX</h1>
                </div>

                <!-- Central Search -->
                <div class="w-full max-w-2xl relative mb-12">
                    <Search class="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input v-model="searchQuery" type="text" @keydown.enter="onSearchEnter"
                        class="w-full h-14 sm:h-16 pl-14 pr-6 rounded-full bg-white dark:bg-white/5 border border-slate-300 dark:border-white/10 shadow-xl text-lg text-slate-800 dark:text-white outline-none focus:border-nebula-primary/50 transition-colors"
                        placeholder="Search for grammar guides, practices, videos..." />
                </div>

                <!-- Quick Access Categories -->
                <div class="flex gap-4 flex-wrap justify-center max-w-3xl">
                    <button @click="setCategorySearch('Article')"
                        class="px-6 py-3 rounded-full border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 hover:bg-nebula-primary/10 hover:border-nebula-primary/30 transition-all text-sm font-bold text-slate-700 dark:text-white/80 flex items-center gap-2 group">
                        <Globe class="w-4 h-4 text-nebula-primary group-hover:scale-110 transition-transform" />
                        Articles
                    </button>
                    <button @click="setCategorySearch('Practice Lab')"
                        class="px-6 py-3 rounded-full border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 hover:bg-nebula-cyan/10 hover:border-nebula-cyan/30 transition-all text-sm font-bold text-slate-700 dark:text-white/80 flex items-center gap-2 group">
                        <Youtube class="w-4 h-4 text-nebula-cyan group-hover:scale-110 transition-transform" />
                        Videos
                    </button>
                    <button @click="setCategorySearch('Resource Hub')"
                        class="px-6 py-3 rounded-full border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 hover:bg-white/10 hover:border-white/30 transition-all text-sm font-bold text-slate-700 dark:text-white/80 flex items-center gap-2 group">
                        <FileText class="w-4 h-4 text-slate-400 group-hover:scale-110 transition-transform" />
                        PDFs
                    </button>
                    <button @click="setCategorySearch('Grammar Guide')"
                        class="px-6 py-3 rounded-full border border-slate-200 dark:border-white/10 bg-white/50 dark:bg-white/5 hover:bg-nebula-secondary/10 hover:border-nebula-secondary/30 transition-all text-sm font-bold text-slate-700 dark:text-white/80 flex items-center gap-2 group">
                        <BookOpen class="w-4 h-4 text-nebula-secondary group-hover:scale-110 transition-transform" />
                        Guides
                    </button>
                </div>
            </div>

            <!-- ═══════════════ RESULTS VIEW ═══════════════ -->
            <div v-else-if="currentView === 'results'" class="p-6 sm:p-10 max-w-4xl mx-auto animate-fade-in">
                <!-- Results Header -->
                <div class="mb-6 pb-4">
                    <p class="text-xs font-mono text-slate-500 dark:text-white/40">
                        About {{ filteredResources.length }} results for
                        <span class="text-nebula-primary">"{{ searchQuery }}"</span>
                    </p>
                </div>

                <!-- Empty State -->
                <div v-if="filteredResources.length === 0" class="text-center py-20">
                    <div
                        class="w-20 h-20 mx-auto bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4">
                        <Search class="w-8 h-8 text-slate-300 dark:text-white/20" />
                    </div>
                    <p class="text-slate-500 dark:text-white/50 text-lg">No matching resources found.</p>
                    <p class="text-xs text-slate-400 dark:text-white/30 mt-2">Try searching for "exam", "article", or
                        "video".</p>
                </div>

                <!-- Results List (Google Style) -->
                <div v-else class="space-y-7">
                    <div v-for="res in filteredResources" :key="res.id" @click="handleResultClick(res)"
                        class="cursor-pointer group">
                        <!-- URL line -->
                        <p class="text-xs font-mono mb-0.5 truncate"
                            :class="res.isLocalExam ? 'text-emerald-500 dark:text-emerald-400' : 'text-slate-400 dark:text-white/40'">
                            {{ res.isLocalExam ? 'http://exam.local/final-quiz' : res.url }}
                        </p>
                        <!-- Title -->
                        <h3
                            class="text-lg font-bold text-blue-700 dark:text-nebula-cyan group-hover:underline transition-colors leading-snug">
                            <component v-if="res.isLocalExam" :is="ClipboardList"
                                class="w-4 h-4 inline mr-1.5 -mt-0.5" />
                            <component v-else :is="getCategoryStyles(res.category || 'Resource Hub').icon"
                                class="w-4 h-4 inline mr-1.5 -mt-0.5"
                                :class="getCategoryStyles(res.category || 'Resource Hub').text" />
                            {{ res.title }}
                        </h3>
                        <!-- Description -->
                        <p class="text-sm text-slate-600 dark:text-white/50 leading-relaxed line-clamp-2 mt-1">
                            {{ res.description }}
                        </p>
                        <!-- Category Badge (only for real resources) -->
                        <span v-if="res.category && !res.isLocalExam"
                            class="inline-block mt-2 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest"
                            :class="getCategoryStyles(res.category).badge">
                            {{ res.category }}
                        </span>
                        <span v-if="res.isLocalExam"
                            class="inline-block mt-2 text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-widest bg-emerald-500/10 text-emerald-500">
                            Local Exam
                        </span>
                    </div>
                </div>
            </div>

            <!-- ═══════════════ EXAM VIEW ═══════════════ -->
            <div v-else-if="currentView === 'exam'"
                class="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-12 relative bg-white dark:bg-transparent animate-fade-in">
                <div class="max-w-3xl mx-auto">
                    <div class="mb-8 border-b border-slate-200 dark:border-white/10 pb-6">
                        <h1 class="text-2xl font-bold text-slate-800 dark:text-white mb-2 uppercase tracking-wide">
                            Final Quiz: Present Perfect</h1>
                        <p class="text-sm text-slate-600 dark:text-white/60">Responde todo primero y después
                            envía el examen para revisar</p>
                    </div>

                    <GameQuizActivity />
                </div>
            </div>
        </div>

        <!-- Help Modal -->
        <div v-if="showHelpModal"
            class="absolute inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
            <div
                class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 p-8 rounded-2xl max-w-sm w-full relative shadow-2xl">
                <button @click="showHelpModal = false"
                    class="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors">
                    <X class="w-5 h-5" />
                </button>
                <div class="flex items-center gap-3 mb-6">
                    <div class="w-10 h-10 rounded-full bg-nebula-primary/20 flex items-center justify-center">
                        <HelpCircle class="w-5 h-5 text-nebula-primary" />
                    </div>
                    <h3 class="font-bold text-xl text-slate-800 dark:text-white">Información</h3>
                </div>
                <p class="text-sm text-slate-600 dark:text-white/70 leading-relaxed">
                    Este navegador es un entorno seguro para consultar fuentes oficiales sobre el
                    <strong class="text-nebula-primary">Present Perfect</strong>. Usa la barra de búsqueda para
                    encontrar guías, ejercicios, exames etc...
                </p>
                <div class="mt-8 flex justify-end">
                    <UiButton label="ENTENDIDO" variant="primary" size="sm" @click="showHelpModal = false" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ChevronLeft, ChevronRight, RotateCw, Globe, Search, HelpCircle, X, BookOpen, Youtube, FileText, Lock, ClipboardList } from 'lucide-vue-next'
import GameWindowControls from './WindowControls.vue'
import GameQuizActivity from './QuizActivity.vue'
import resourcesData, { getCategoryStyles } from '~/constant/resources'

const resources = resourcesData.resources

// ── Props ────────────────────────────────────────────────────────────────────
const props = defineProps({
    initialMode: { type: String, default: 'home' },
    initialQuery: { type: String, default: '' },
})

// ── State ────────────────────────────────────────────────────────────────────
const showHelpModal = ref(false)
const searchQuery = ref(props.initialQuery) // Bound to inputs
const isReloading = ref(false)

// History state
const history = ref([{ view: props.initialMode, query: props.initialQuery }])
const historyIndex = ref(0)

const currentView = computed(() => history.value[historyIndex.value].view)
const activeQuery = computed(() => history.value[historyIndex.value].query)

// If launched directly in exam mode, setup initial history state
onMounted(() => {
    if (props.initialMode === 'exam') {
        history.value = [{ view: 'exam', query: '' }]
    } else if (props.initialQuery) {
        history.value = [{ view: 'results', query: props.initialQuery }]
    }
})

// ── Navigation ───────────────────────────────────────────────────────────────
const pushState = (view, query) => {
    // Drop future history if we navigate while not at the end
    history.value = history.value.slice(0, historyIndex.value + 1)
    history.value.push({ view, query })
    historyIndex.value++
    searchQuery.value = query // Sync input
}

const goBack = () => {
    if (historyIndex.value > 0) {
        historyIndex.value--
        searchQuery.value = activeQuery.value
    }
}

const goForward = () => {
    if (historyIndex.value < history.value.length - 1) {
        historyIndex.value++
        searchQuery.value = activeQuery.value
    }
}

const reload = () => {
    isReloading.value = true
    setTimeout(() => {
        isReloading.value = false
    }, 500)
}

// ── Actions ──────────────────────────────────────────────────────────────────
const onSearchEnter = () => {
    const query = searchQuery.value.trim()
    if (query) {
        pushState('results', query)
    } else {
        pushState('home', '')
    }
}

const handleResultClick = (res) => {
    if (res.isLocalExam) {
        pushState('exam', activeQuery.value)
    } else {
        window.open(res.url, '_blank')
    }
}

const setCategorySearch = (category) => {
    searchQuery.value = category
    pushState('results', category)
}

// ── Exam trigger keywords ────────────────────────────────────────────────────
const EXAM_KEYWORDS = ['exam', 'quiz', 'test', 'prueba', 'final']

const examEntry = {
    id: 'local-exam',
    title: 'Final English Quiz',
    description: 'Official evaluation module — Present Perfect tense. Multiple choice, writing, and listening exercises. Your results will be synced to Excel.',
    url: 'http://exam.local/final-quiz',
    category: null,
    isLocalExam: true,
}

// ── Fuzzy search computed ────────────────────────────────────────────────────
const filteredResources = computed(() => {
    if (!activeQuery.value) return []
    const query = activeQuery.value.toLowerCase().trim()
    if (!query) return []

    const results = []

    // Check if query matches exam keywords → inject exam entry first
    const matchesExam = EXAM_KEYWORDS.some(kw => query.includes(kw))
    if (matchesExam) {
        results.push(examEntry)
    }

    // Filter real resources across title, category, description
    const filtered = resources.filter(r =>
        r.title.toLowerCase().includes(query) ||
        r.category.toLowerCase().includes(query) ||
        r.description.toLowerCase().includes(query)
    )

    results.push(...filtered)
    return results
})
</script>

<style scoped>
.animate-fade-in {
    animation: fade-in 0.3s ease-out forwards;
}

@keyframes fade-in {
    from {
        opacity: 0;
        transform: translateY(10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
</style>
