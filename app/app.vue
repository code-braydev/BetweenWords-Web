<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup lang="ts">
useHead({
  title: 'Between Words - Aprende Present Perfect de Forma Clara y Divertida',
  meta: [
    { name: 'description', content: 'Aprende el presente perfecto de una manera clara y divertida con Between Words.' },
  ],
  bodyAttrs: {
    class: 'bg-[#050505] text-white overflow-hidden',
  },
})
useSeoMeta({
  title: 'Between Words - Aprende Present Perfect de Forma Clara y Divertida',
  ogTitle: 'Between Words - Aprende Present Perfect de Forma Clara y Divertida',
  description: 'Aprende el presente perfecto de una manera clara y divertida con Between Words.',
  ogDescription: 'Aprende el presente perfecto de una manera clara y divertida con Between Words.',
  ogImage: 'https://between-words.Braydev.xyz/og-image.png',
  twitterCard: 'summary_large_image',
})
</script>
