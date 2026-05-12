<template>
    <div
        class="flex h-full flex-col bg-white/90 dark:bg-slate-900/90 backdrop-blur-3xl rounded-2xl overflow-hidden border border-slate-300 dark:border-white/10 shadow-2xl relative">
        <!-- Excel Header / Ribbon -->
        <div class="z-50 shadow-xl shrink-0">
            <div class="bg-[#107C41] text-white p-2 flex items-center justify-between shrink-0">
                <div class="flex items-center gap-3">
                    <div
                        class="w-8 h-8 bg-white/20 rounded flex items-center justify-center font-bold text-lg border border-white/30">
                        X
                    </div>
                    <span class="text-sm font-medium">Grades_Report.xlsx - Excel</span>
                </div>
                <GameWindowControls />
            </div>

            <!-- Ribbon Toolbar -->
            <div
                class="bg-slate-100 dark:bg-slate-800 border-b border-slate-300 dark:border-white/10 p-2 flex gap-4 shrink-0 overflow-x-auto custom-scrollbar">
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
            class="bg-white dark:bg-slate-900 border-b border-slate-300 dark:border-white/10 p-2 flex items-center gap-3 shrink-0">
            <div
                class="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded border border-slate-300 dark:border-white/10 text-xs font-mono text-slate-700 dark:text-white/70">
                E4
            </div>
            <div class="text-slate-400 dark:text-white/40 italic font-serif">fx</div>
            <div
                class="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-white/10 px-2 py-1 rounded text-xs font-mono text-slate-700 dark:text-white/90">
                =AVERAGE(B4:D4)
            </div>
        </div>

        <!-- Spreadsheet Grid -->
        <div class="flex-1 overflow-auto bg-white dark:bg-slate-900 relative">
            <table class="w-full border-collapse">
                <thead>
                    <tr>
                        <th class="border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-slate-800 w-10">
                        </th>
                        <th
                            class="border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-slate-800 text-xs font-normal text-slate-600 dark:text-white/70 py-1 w-1/4">
                            A</th>
                        <th
                            class="border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-slate-800 text-xs font-normal text-slate-600 dark:text-white/70 py-1 w-1/4">
                            B</th>
                        <th
                            class="border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-slate-800 text-xs font-normal text-slate-600 dark:text-white/70 py-1 w-1/4">
                            C</th>
                        <th
                            class="border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-slate-800 text-xs font-normal text-slate-600 dark:text-white/70 py-1 w-1/4">
                            D</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Row 1 -->
                    <tr>
                        <td
                            class="border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-slate-800 text-center text-xs text-slate-500 dark:text-white/50">
                            1</td>
                        <td
                            class="border border-slate-300 dark:border-white/20 p-2 text-sm font-bold text-slate-800 dark:text-white bg-slate-50 dark:bg-white/5">
                            Student Name</td>
                        <td
                            class="border border-slate-300 dark:border-white/20 p-2 text-sm font-bold text-slate-800 dark:text-white bg-slate-50 dark:bg-white/5">
                            Grade</td>
                        <td
                            class="border border-slate-300 dark:border-white/20 p-2 text-sm font-bold text-slate-800 dark:text-white bg-slate-50 dark:bg-white/5">
                            Group</td>
                        <td
                            class="border border-slate-300 dark:border-white/20 p-2 text-sm font-bold text-slate-800 dark:text-white bg-[#107C41]/10 dark:bg-[#107C41]/30">
                            Final Score</td>
                    </tr>
                    <!-- Row 2 -->
                    <tr>
                        <td
                            class="border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-slate-800 text-center text-xs text-slate-500 dark:text-white/50">
                            2</td>
                        <td
                            class="border border-slate-300 dark:border-white/10 p-2 text-sm text-slate-700 dark:text-white/90 truncate">
                            <div v-if="!store.user.fullName" class="flex items-center gap-2">
                                <span class="text-red-400/60 italic text-xs">Missing info...</span>
                                <button @click="$emit('settings')"
                                    class="text-[10px] bg-nebula-primary/20 text-nebula-primary px-2 py-0.5 rounded border border-nebula-primary/30 hover:bg-nebula-primary/40 transition-colors uppercase font-bold">Identify</button>
                            </div>
                            <span v-else>{{ store.user.fullName }}</span>
                        </td>
                        <td
                            class="border border-slate-300 dark:border-white/10 p-2 text-sm text-slate-700 dark:text-white/90 text-center">
                            {{ store.user.grade || 'N/A' }}</td>
                        <td
                            class="border border-slate-300 dark:border-white/10 p-2 text-sm text-slate-700 dark:text-white/90 text-center">
                            {{ store.user.group || 'N/A' }}</td>
                        <td
                            class="border-2 border-[#107C41] p-2 text-sm font-bold text-[#107C41] dark:text-[#4ade80] text-center bg-[#107C41]/5">
                            {{ store.academic.score }} / 100
                        </td>
                    </tr>
                    <!-- Empty Rows for realism -->
                    <tr v-for="i in 15" :key="i">
                        <td
                            class="border border-slate-300 dark:border-white/10 bg-slate-100 dark:bg-slate-800 text-center text-xs text-slate-500 dark:text-white/50">
                            {{ i + 2 }}</td>
                        <td class="border border-slate-300 dark:border-white/10 p-2"></td>
                        <td class="border border-slate-300 dark:border-white/10 p-2"></td>
                        <td class="border border-slate-300 dark:border-white/10 p-2"></td>
                        <td class="border border-slate-300 dark:border-white/10 p-2"></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Status Bar -->
        <div
            class="bg-slate-100 dark:bg-slate-800 border-t border-slate-300 dark:border-white/10 p-1 flex justify-between shrink-0 px-4">
            <span class="text-[10px] text-slate-500 dark:text-white/60">Ready</span>
            <div class="flex gap-4">
                <span class="text-[10px] text-slate-500 dark:text-white/60">100%</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Save, FileText, LayoutGrid } from 'lucide-vue-next'
import { useGameStore } from '@/stores/useGameStore'

const store = useGameStore()
</script>
