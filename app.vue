<script setup>
import { useSearch } from '@/stores/search'

const searchStore = useSearch()
useHead({
  htmlAttrs: {
    lang: 'en',
  },
  charset: 'utf-8',
  title: 'Nuxt Movies',
  meta: [
    {
      name: 'description',
      content:
        'A TMDB client built with Nuxt Image to show the potential of it ✨',
    },
    { name: 'author', content: 'Minh Anh Nguyen' },
    {
      property: 'og:image',
      content: `/social-card.png`,
    },
    {
      property: 'og:description',
      content: 'Browse Movies, TV Shows and People',
    },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: '@nuxt_js' },
    { name: 'twitter:creator', content: '@anhnm896' },
  ],
  link: [
    {
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com',
    },
    {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossorigin: true,
    },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap',
    },
  ],
})
</script>

<template>
  <NuxtLoadingIndicator />
  <div
    class="scrollbar grid grid-rows-[1fr_max-content] lg:grid-cols-[max-content_1fr]"
  >
    <transition name="slidedown">
      <SearchForm v-if="searchStore.searchOpen" />
    </transition>
    <TheNavbar />
    <div>
      <NuxtPage />
      <TheFooter />
    </div>
  </div>
</template>
