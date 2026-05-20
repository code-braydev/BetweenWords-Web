<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useGameStore } from '~/stores/useGameStore'

useHead({
  bodyAttrs: {
    class: 'bg-[#050505] text-white overflow-hidden',
  },
})

const route = useRoute()
const store = useGameStore()
const config = useRuntimeConfig()
const siteUrl = (config.public?.siteUrl || 'https://between-words.braydev.xyz').replace(/\/$/, '')

// Buscamos múltiples keys que el profesor podría usar o info de la sesión/usuario
const professorQuery = (
  (route.query.professor as string) ||
  (route.query.teacher as string) ||
  (route.query.from as string) ||
  (route.query.prof as string)
)

const professorName = (professorQuery?.trim()) || store.session.professor?.trim() || store.session.topic?.trim() || store.user.fullName?.trim() || 'Tu profesor'

useSeoMeta({
  title: `${professorName} te ha invitado a jugar — Between Words`,
  description: `${professorName} te invita a practicar Present Perfect en Between Words. Responde el quiz final y recibe tu nota.`,
  ogTitle: `${professorName} te ha invitado a jugar — Between Words`,
  ogDescription: `${professorName} te invita a practicar Present Perfect con actividades interactivas: writing, listening y speaking.`,
  ogImage: `${siteUrl}/og-image.png`,
  ogUrl: `${siteUrl}${route.fullPath}`,
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: `${professorName} te ha invitado a jugar — Between Words`,
  twitterDescription: `${professorName} te invita a practicar Present Perfect en Between Words.`,
  twitterImage: `${siteUrl}/og-image.png`,
})
</script>
