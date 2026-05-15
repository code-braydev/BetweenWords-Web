<template>
    <div
        class="flex h-full flex-col bg-white dark:bg-[#1e1e1e] rounded-2xl overflow-hidden border border-slate-300 dark:border-white/10 shadow-2xl relative">

        <!-- ═══════════════ HOME VIEW (Excel Start Screen) ═══════════════ -->
        <template v-if="currentView === 'home'">
            <!-- Top Bar -->
            <div class="bg-[#107C41] text-white p-2 flex items-center justify-between shrink-0">
                <div class="flex items-center gap-3">
                    <div
                        class="w-8 h-8 bg-white/20 rounded flex items-center justify-center font-bold text-lg border border-white/30">
                        X
                    </div>
                    <span class="text-sm font-medium">Excel</span>
                </div>
                <GameWindowControls />
            </div>

            <div class="flex flex-1 overflow-hidden">
                <!-- Left Sidebar (Office Style) -->
                <div
                    class="w-16 sm:w-20 bg-[#2b2b2b] flex flex-col items-center py-6 gap-6 shrink-0 border-r border-white/5">
                    <button
                        class="flex flex-col items-center gap-1 text-white/90 hover:text-white transition-colors group">
                        <Home class="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span class="text-[9px] font-bold">Inicio</span>
                    </button>
                    <button
                        class="flex flex-col items-center gap-1 text-white/40 hover:text-white/80 transition-colors group">
                        <FilePlus class="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span class="text-[9px]">Nuevo</span>
                    </button>
                    <button
                        class="flex flex-col items-center gap-1 text-white/40 hover:text-white/80 transition-colors group">
                        <FolderOpen class="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span class="text-[9px]">Abrir</span>
                    </button>

                    <!-- Spacer -->
                    <div class="flex-1"></div>

                    <button @click="$emit('settings')"
                        class="flex flex-col items-center gap-1 text-white/40 hover:text-white/80 transition-colors group">
                        <User class="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span class="text-[9px]">Cuenta</span>
                    </button>
                    <button
                        class="flex flex-col items-center gap-1 text-white/40 hover:text-white/80 transition-colors group">
                        <Settings class="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span class="text-[9px]">Opciones</span>
                    </button>
                </div>

                <!-- Main Content Area -->
                <div class="flex-1 bg-[#f3f3f3] dark:bg-[#1e1e1e] p-8 overflow-y-auto custom-scrollbar">
                    <!-- Greeting -->
                    <h1 class="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
                        {{ greeting }}
                    </h1>

                    <!-- New Blank Book Button -->
                    <button
                        class="px-5 py-2.5 bg-[#107C41] text-white text-sm font-bold rounded flex items-center gap-2 mb-8 hover:bg-[#0d6535] transition-colors">
                        <FileSpreadsheet class="w-4 h-4" />
                        Nuevo libro en blanco
                    </button>

                    <!-- Tabs -->
                    <div class="flex gap-1 mb-4 border-b border-slate-200 dark:border-white/10">
                        <button class="px-4 py-2 text-xs font-bold rounded-t bg-[#107C41] text-white">Recientes</button>
                        <button
                            class="px-4 py-2 text-xs font-medium text-slate-500 dark:text-white/50 hover:bg-slate-200 dark:hover:bg-white/5 rounded-t transition-colors">Favoritos</button>
                        <button
                            class="px-4 py-2 text-xs font-medium text-slate-500 dark:text-white/50 hover:bg-slate-200 dark:hover:bg-white/5 rounded-t transition-colors">Compartidos
                            conmigo</button>
                    </div>

                    <!-- File List Header -->
                    <div class="flex items-center px-4 py-2 text-[11px] font-bold text-slate-500 dark:text-white/40">
                        <span class="flex-1">Nombre</span>
                        <span class="w-40 text-right hidden sm:block">Fecha de modificación</span>
                    </div>

                    <!-- File List -->
                    <div class="divide-y divide-slate-100 dark:divide-white/5">
                        <div v-for="file in files" :key="file.name" @click="handleFileClick(file)"
                            class="flex items-center px-4 py-3 hover:bg-slate-100 dark:hover:bg-white/5 cursor-pointer transition-colors group rounded-lg">
                            <div class="flex items-center gap-3 flex-1 min-w-0">
                                <div class="w-8 h-8 flex items-center justify-center shrink-0">
                                    <FileSpreadsheet class="w-6 h-6 text-[#107C41]" />
                                </div>
                                <div class="min-w-0">
                                    <div class="flex items-center gap-2">
                                        <p
                                            class="text-sm font-medium text-slate-800 dark:text-white truncate group-hover:text-[#107C41] transition-colors">
                                            {{ file.name }}
                                        </p>
                                        <Lock v-if="file.locked && !store.academic.isExamCompleted"
                                            class="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                    </div>
                                    <p class="text-[11px] text-slate-400 dark:text-white/30 truncate">{{ file.path }}
                                    </p>
                                </div>
                            </div>
                            <span class="text-xs text-slate-400 dark:text-white/40 w-40 text-right hidden sm:block">{{
                                file.date }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <!-- ═══════════════ SPREADSHEET VIEW ═══════════════ -->
        <template v-else-if="currentView === 'spreadsheet'">
            <!-- Excel Header / Ribbon -->
            <div class="z-50 shadow-xl shrink-0">
                <div class="bg-[#107C41] text-white p-2 flex items-center justify-between shrink-0">
                    <div class="flex items-center gap-3">
                        <button @click="currentView = 'home'"
                            class="w-8 h-8 bg-white/20 rounded flex items-center justify-center hover:bg-white/30 transition-colors">
                            <ChevronLeft class="w-5 h-5" />
                        </button>
                        <span class="text-sm font-medium">{{ activeFileName }} - Excel</span>
                    </div>
                    <GameWindowControls />
                </div>

                <!-- Ribbon Toolbar -->
                <div
                    class="bg-slate-100 dark:bg-[#2b2b2b] border-b border-slate-300 dark:border-white/10 p-2 flex gap-4 shrink-0 overflow-x-auto custom-scrollbar">
                    <div
                        class="flex flex-col items-center gap-1 cursor-pointer text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white">
                        <Save class="w-5 h-5" />
                        <span class="text-[9px]">Save</span>
                    </div>
                    <div class="w-px h-8 bg-slate-300 dark:bg-white/10 mx-1"></div>
                    <div
                        class="flex flex-col items-center gap-1 cursor-pointer text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white">
                        <FileText class="w-5 h-5" />
                        <span class="text-[9px]">Home</span>
                    </div>
                    <div
                        class="flex flex-col items-center gap-1 cursor-pointer text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white">
                        <LayoutGrid class="w-5 h-5" />
                        <span class="text-[9px]">Insert</span>
                    </div>
                </div>
            </div>

            <!-- Formula Bar -->
            <div
                class="bg-white dark:bg-[#1e1e1e] border-b border-slate-300 dark:border-white/10 p-1 flex items-center gap-2 shrink-0">
                <div
                    class="min-w-[30px] text-center bg-slate-50 dark:bg-[#2b2b2b] px-1 py-0.5 rounded border border-slate-200 dark:border-white/10 text-[9px] font-sans text-slate-500 dark:text-white/50">
                    {{ selectedCell.col }}{{ selectedCell.row }}
                </div>
                <div class="text-slate-400 dark:text-white/40 italic font-serif px-1 text-[10px]">fx</div>
                <div
                    class="flex-1 bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 px-2 py-0.5 rounded text-[11px] font-mono text-slate-700 dark:text-white/90 flex items-center h-6">
                    <template v-if="showData">
                        <span v-if="selectedCell.row === 2 && selectedCell.col === 'C'" class="text-emerald-500">
                            =IF(B2>=3.0, "PASSED", "TRY AGAIN")
                        </span>
                        <span v-else-if="selectedCell.row === 2 && selectedCell.col === 'B'" class="text-emerald-500">
                            {{ store.academic.score }}
                        </span>
                        <span v-else-if="selectedCell.row === 2 && selectedCell.col === 'A'" class="text-slate-400">
                            {{ store.user.fullName }}
                        </span>
                        <span v-else-if="selectedCell.row === 1 && selectedCell.col === 'A'">Student Name</span>
                        <span v-else-if="selectedCell.row === 1 && selectedCell.col === 'B'">Final Score</span>
                        <span v-else-if="selectedCell.row === 1 && selectedCell.col === 'C'">Status</span>
                    </template>
                </div>
            </div>

            <!-- Spreadsheet Grid -->
            <div class="flex-1 overflow-auto relative bg-[#f9f9f9] dark:bg-[#1e1e1e] custom-scrollbar-excel">
                <table class="border-collapse table-fixed select-none min-w-full">
                    <thead>
                        <tr class="h-[20px]">
                            <th
                                class="w-[26px] border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#2b2b2b] sticky top-0 left-0 z-30">
                            </th>
                            <th v-for="col in ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']" :key="col"
                                class="w-[80px] border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#2b2b2b] text-[9px] font-normal text-slate-500 dark:text-white/40 text-center align-middle sticky top-0 z-20 transition-colors"
                                :class="{ 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium !border-b-emerald-500 !border-b-2': selectedCell.col === col }">
                                {{ col }}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="rowIndex in 50" :key="rowIndex" class="h-[20px]">
                            <!-- Row Number -->
                            <td class="border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-[#2b2b2b] text-center align-middle text-[9px] font-normal text-slate-500 dark:text-white/40 sticky left-0 z-20 transition-colors"
                                :class="{ 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-medium !border-r-emerald-500 !border-r-2': selectedCell.row === rowIndex }">
                                {{ rowIndex }}
                            </td>

                            <template v-if="rowIndex === 1 && showData">
                                <td v-for="(val, col) in { A: 'Student Name', B: 'Final Score', C: 'Status' }"
                                    :key="col" @click="selectedCell = { row: 1, col }"
                                    class="border border-slate-200 dark:border-white/5 px-2 py-0 text-[11px] font-bold text-slate-800 dark:text-white bg-white dark:bg-white/5 cursor-cell relative align-middle"
                                    :class="{ 'ring-2 ring-inset ring-emerald-500 z-10 bg-emerald-500/5': selectedCell.row === 1 && selectedCell.col === col }">
                                    {{ val }}
                                </td>
                                <!-- Fill the rest of the row -->
                                <td v-for="col in ['D', 'E', 'F', 'G', 'H', 'I', 'J']" :key="col"
                                    @click="selectedCell = { row: 1, col }"
                                    class="border border-slate-200 dark:border-white/5 px-2 py-0 bg-white dark:bg-transparent cursor-cell relative align-middle"
                                    :class="{ 'ring-2 ring-inset ring-emerald-500 z-10 bg-emerald-500/5': selectedCell.row === 1 && selectedCell.col === col }">
                                </td>
                            </template>

                            <!-- Student Data Row (Row 2) -->
                            <template v-else-if="rowIndex === 2 && showData">
                                <td @click="selectedCell = { row: 2, col: 'A' }"
                                    class="border border-slate-200 dark:border-white/5 px-2 py-0 text-[11px] text-slate-700 dark:text-white/90 truncate cursor-cell relative align-middle"
                                    :class="{ 'ring-2 ring-inset ring-emerald-500 z-10 bg-emerald-500/5': selectedCell.row === 2 && selectedCell.col === 'A' }">
                                    {{ store.user.fullName || 'Guest-User' }}
                                </td>
                                <td @click="selectedCell = { row: 2, col: 'B' }"
                                    class="border border-slate-200 dark:border-white/5 px-2 py-0 text-[11px] font-bold text-[#107C41] dark:text-[#4ade80] text-center cursor-cell relative align-middle"
                                    :class="{ 'ring-2 ring-inset ring-emerald-500 z-10 bg-emerald-500/5': selectedCell.row === 2 && selectedCell.col === 'B' }">
                                    {{ store.academic.score }}
                                </td>
                                <td @click="selectedCell = { row: 2, col: 'C' }"
                                    class="border border-slate-200 dark:border-white/5 px-2 py-0 text-[11px] text-center font-bold cursor-cell relative align-middle"
                                    :class="[
                                        store.academic.score >= 3.0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500',
                                        { 'ring-2 ring-inset ring-emerald-500 z-10 bg-emerald-500/5': selectedCell.row === 2 && selectedCell.col === 'C' }
                                    ]">
                                    {{ store.academic.score >= 3.0 ? 'PASSED ✓' : 'TRY AGAIN' }}
                                </td>
                                <!-- Fill the rest of the row -->
                                <td v-for="col in ['D', 'E', 'F', 'G', 'H', 'I', 'J']" :key="col"
                                    @click="selectedCell = { row: 2, col }"
                                    class="border border-slate-200 dark:border-white/5 px-2 py-0 bg-white dark:bg-transparent cursor-cell relative align-middle"
                                    :class="{ 'ring-2 ring-inset ring-emerald-500 z-10 bg-emerald-500/5': selectedCell.row === 2 && selectedCell.col === col }">
                                </td>
                            </template>

                            <!-- Empty Rows -->
                            <template v-else>
                                <td v-for="col in ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']" :key="col"
                                    @click="selectedCell = { row: rowIndex, col }"
                                    class="border border-slate-200 dark:border-white/5 px-2 py-0 cursor-cell relative align-middle bg-white dark:bg-transparent"
                                    :class="{ 'ring-2 ring-inset ring-emerald-500 z-10 bg-emerald-500/5': selectedCell.row === rowIndex && selectedCell.col === col }">
                                </td>
                            </template>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Sheet Tabs + Status Bar -->
            <div
                class="bg-slate-100 dark:bg-[#2b2b2b] border-t border-slate-300 dark:border-white/10 flex items-center justify-between shrink-0">
                <div class="flex">
                    <button v-for="tab in sheetTabs" :key="tab.name" @click="activeTab = tab.name" :class="[
                        'px-4 py-1.5 text-[11px] font-bold border-r border-slate-300 dark:border-white/10 transition-colors',
                        activeTab === tab.name
                            ? (tab.special && store.academic.isExamCompleted
                                ? 'bg-emerald-500 text-white'
                                : 'bg-white dark:bg-[#1e1e1e] text-slate-800 dark:text-white')
                            : 'text-slate-500 dark:text-white/50 hover:bg-slate-200 dark:hover:bg-white/10',
                        tab.special && !store.academic.isExamCompleted && 'opacity-50'
                    ]">
                        {{ tab.name }}
                    </button>
                </div>
                <div class="flex gap-4 px-4">
                    <span class="text-[10px] text-slate-500 dark:text-white/60">Ready</span>
                    <span class="text-[10px] text-slate-500 dark:text-white/60">100%</span>
                </div>
            </div>
        </template>

        <!-- ═══════════════ ACCESS DENIED MODAL ═══════════════ -->
        <Transition enter-active-class="transition duration-200 ease-out" enter-from-class="opacity-0 scale-95"
            enter-to-class="opacity-100 scale-100" leave-active-class="transition duration-150 ease-in"
            leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
            <div v-if="showAccessDenied"
                class="absolute inset-0 z-[200] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                <div
                    class="bg-white dark:bg-[#1e1e1e] border border-slate-200 dark:border-white/10 p-8 rounded-2xl max-w-sm w-full shadow-2xl">
                    <div class="flex items-center gap-3 mb-6">
                        <div class="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                            <ShieldAlert class="w-6 h-6 text-red-500" />
                        </div>
                        <div>
                            <h3 class="font-bold text-lg text-slate-800 dark:text-white">Acceso Denegado</h3>
                            <p class="text-[10px] text-slate-400 dark:text-white/40 uppercase tracking-widest">
                                Protected File</p>
                        </div>
                    </div>
                    <p class="text-sm text-slate-600 dark:text-white/70 leading-relaxed mb-8">
                        Este documento está protegido. Para visualizar tus notas oficiales, debes completar el
                        <strong class="text-nebula-primary">Final Quiz</strong> en el navegador niX.
                    </p>
                    <div class="flex gap-3">
                        <button @click="showAccessDenied = false"
                            class="flex-1 py-2.5 border border-slate-200 dark:border-white/10 rounded-xl text-sm font-bold text-slate-600 dark:text-white/70 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors">
                            Cerrar
                        </button>
                        <button @click="goToExam"
                            class="flex-1 py-2.5 bg-[#107C41] hover:bg-[#0d6535] text-white rounded-xl text-sm font-bold transition-colors">
                            Ir al examen →
                        </button>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import {
    Save, FileText, LayoutGrid, Home, FilePlus, FolderOpen,
    User, Settings, Lock, ChevronLeft, ShieldAlert, FileSpreadsheet
} from 'lucide-vue-next'
import { useGameStore } from '@/stores/useGameStore'
import GameWindowControls from './WindowControls.vue'

const store = useGameStore()
const emit = defineEmits(['settings'])

// ── State ────────────────────────────────────────────────────────────────────
const currentView = ref('home') // 'home' | 'spreadsheet'
const showAccessDenied = ref(false)
const activeTab = ref('Dashboard')
const activeFileName = ref('')
const selectedCell = ref({ row: 2, col: 'B' })

// ── Computed ─────────────────────────────────────────────────────────────────
const showData = computed(() => {
    return activeFileName.value === 'Grades_Report.xlsx' && activeTab.value === 'Official Grades'
})

// ── Greeting ─────────────────────────────────────────────────────────────────
const greeting = computed(() => {
    const hour = new Date().getHours()
    return hour >= 18 ? 'Buenas noches' : 'Buenos días'
})

// ── Files ────────────────────────────────────────────────────────────────────
const files = [
    {
        name: 'Grades_Report.xlsx',
        path: 'Documents » University » OVA',
        date: '14 de mayo',
        locked: true,
        isGradesReport: true,
    },
    {
        name: 'Unit_3_Vocabulary.csv',
        path: 'Documents » University » English',
        date: '10 de mayo',
        locked: false,
        isGradesReport: false,
    },
    {
        name: 'Irregular_Verbs_List.xlsx',
        path: 'Documents » University » English',
        date: '8 de mayo',
        locked: false,
        isGradesReport: false,
    },
]

// ── Sheet Tabs ───────────────────────────────────────────────────────────────
const sheetTabs = [
    { name: 'Dashboard', special: false },
    { name: 'Pivot Tables', special: false },
    { name: 'Official Grades', special: true },
]

// ── Actions ──────────────────────────────────────────────────────────────────
const handleFileClick = (file) => {
    if (file.isGradesReport && !store.academic.isExamCompleted) {
        showAccessDenied.value = true
        return
    }

    activeFileName.value = file.name
    activeTab.value = file.isGradesReport ? 'Official Grades' : 'Dashboard'
    currentView.value = 'spreadsheet'
}

const goToExam = () => {
    showAccessDenied.value = false
    store.closeApp()
    store.openApp('browser')
}
</script>

<style scoped>
.custom-scrollbar-excel::-webkit-scrollbar {
    width: 6px;
    height: 6px;
}

.custom-scrollbar-excel::-webkit-scrollbar-track {
    background: #0a0a0a;
}

.custom-scrollbar-excel::-webkit-scrollbar-thumb {
    background: #222;
    border-radius: 10px;
    border: none;
}

/* Base scrollbar for other views */
.custom-scrollbar::-webkit-scrollbar {
    width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background: rgba(100, 100, 100, 0.3);
    border-radius: 10px;
}

.select-none {
    user-select: none;
}

.cursor-cell {
    cursor: cell;
}
</style>
