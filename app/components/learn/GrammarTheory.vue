<template>
  <div class="space-y-10 animate-fade-in">
    <!-- Structure Card -->
    <div class="p-8 bg-white dark:bg-black/20 rounded-3xl border border-slate-200 dark:border-white/5 shadow-xl relative overflow-hidden group">
      <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
          <BookOpen class="w-24 h-24 text-nebula-primary" />
      </div>
      
      <h3 class="text-2xl font-black text-slate-800 dark:text-white mb-6 uppercase tracking-tighter flex items-center gap-3">
          <Sparkles class="w-6 h-6 text-nebula-primary" />
          The Structure
      </h3>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="p-6 bg-nebula-primary/5 rounded-2xl border border-nebula-primary/20">
              <p class="text-[10px] font-black text-nebula-primary uppercase tracking-widest mb-2">Affirmative</p>
              <p class="text-lg font-bold text-slate-700 dark:text-white/90 font-mono">Subject + have/has + Past Participle</p>
              <p class="mt-4 text-xs text-slate-500 dark:text-white/40 italic">"I have finished my work."</p>
          </div>
          <div class="p-6 bg-nebula-cyan/5 rounded-2xl border border-nebula-cyan/20">
              <p class="text-[10px] font-black text-nebula-cyan uppercase tracking-widest mb-2">Negative</p>
              <p class="text-lg font-bold text-slate-700 dark:text-white/90 font-mono">Subject + haven't/hasn't + P.P.</p>
              <p class="mt-4 text-xs text-slate-500 dark:text-white/40 italic">"She hasn't seen the movie."</p>
          </div>
          <div class="p-6 bg-white dark:bg-white/5 rounded-2xl border border-slate-200 dark:border-white/10">
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Interrogative</p>
              <p class="text-lg font-bold text-slate-700 dark:text-white/90 font-mono">Have/Has + Subject + P.P. ?</p>
              <p class="mt-4 text-xs text-slate-500 dark:text-white/40 italic">"Have you ever been to London?"</p>
          </div>
      </div>
    </div>

    <!-- Usage Section -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div class="space-y-4">
            <h4 class="text-sm font-black text-nebula-cyan uppercase tracking-widest flex items-center gap-2">
                <Info class="w-4 h-4" /> When to use it?
            </h4>
            <div class="space-y-3">
                <div v-for="(use, i) in usage" :key="i" class="p-4 bg-white/50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5 flex gap-4">
                    <div class="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center shrink-0 font-bold text-xs text-nebula-primary">
                        {{ i + 1 }}
                    </div>
                    <div>
                        <p class="text-xs font-bold text-slate-800 dark:text-white mb-1">{{ use.title }}</p>
                        <p class="text-[10px] text-slate-500 dark:text-white/40 leading-relaxed">{{ use.desc }}</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="space-y-4">
            <h4 class="text-sm font-black text-nebula-primary uppercase tracking-widest flex items-center gap-2">
                <Zap class="w-4 h-4" /> Key Words
            </h4>
            <div class="grid grid-cols-2 gap-3">
                <div v-for="word in keywords" :key="word.term" class="p-4 bg-white/50 dark:bg-white/5 rounded-xl border border-slate-200 dark:border-white/5 text-center">
                    <p class="text-xs font-black text-nebula-primary mb-1">{{ word.term }}</p>
                    <p class="text-[9px] text-slate-500 dark:text-white/40 uppercase tracking-tighter">{{ word.meaning }}</p>
                </div>
            </div>
        </div>
    </div>

    <!-- Verbs Table -->
    <div class="p-8 bg-gradient-to-br from-nebula-primary/5 to-nebula-cyan/5 rounded-3xl border border-white/10">
        <h4 class="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
            <Table class="w-4 h-4 text-nebula-cyan" /> Common Irregular Verbs
        </h4>
        <div class="overflow-hidden rounded-xl border border-white/5">
            <table class="w-full text-left">
                <thead class="bg-white/5 text-[10px] uppercase font-black tracking-widest text-white/40">
                    <tr>
                        <th class="px-6 py-4">Infinitive</th>
                        <th class="px-6 py-4">Past Simple</th>
                        <th class="px-6 py-4 text-nebula-cyan">Past Participle</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-white/5">
                    <tr v-for="verb in verbs" :key="verb.inf" class="hover:bg-white/5 transition-colors">
                        <td class="px-6 py-4 text-xs font-medium text-white/80">{{ verb.inf }}</td>
                        <td class="px-6 py-4 text-xs text-white/40">{{ verb.past }}</td>
                        <td class="px-6 py-4 text-xs font-bold text-nebula-cyan">{{ verb.pp }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
  </div>
</template>

<script setup>
import { BookOpen, Sparkles, Info, Zap, Table } from 'lucide-vue-next'

const usage = [
    { title: "Experiences", desc: "Actions that happened at an unspecified time in the past. (e.g., I have traveled to Japan)." },
    { title: "Unfinished Time", desc: "Actions that started in the past and continue in the present. (e.g., I have lived here for years)." },
    { title: "Recent Actions", desc: "Actions that finished very recently, often with 'just'. (e.g., I have just finished my homework)." },
    { title: "Results in the Present", desc: "Past actions that have a clear effect now. (e.g., I have lost my keys, so I can't enter)." }
]

const keywords = [
    { term: "Ever", meaning: "En algún momento" },
    { term: "Never", meaning: "Nunca" },
    { term: "Just", meaning: "Acabar de" },
    { term: "Already", meaning: "Ya" },
    { term: "Yet", meaning: "Todavía / Ya" },
    { term: "Since", meaning: "Desde" },
    { term: "For", meaning: "Por / Durante" }
]

const verbs = [
    { inf: "Be", past: "Was/Were", pp: "Been" },
    { inf: "Go", past: "Went", pp: "Gone" },
    { inf: "See", past: "Saw", pp: "Seen" },
    { inf: "Eat", past: "Ate", pp: "Eaten" },
    { inf: "Write", past: "Wrote", pp: "Written" },
    { inf: "Do", past: "Did", pp: "Done" },
    { inf: "Have", past: "Had", pp: "Had" }
]
</script>
