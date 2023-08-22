<script setup lang="ts">
import { TMDB_IMAGE_BASE } from '@/constants/images'

const list = await getMediaList('movie', 'popular', 1)
const featured = list.results[Math.floor(Math.random() * list.results.length)]
console.log({ featured })
</script>

<template>
  <div>
    <img :src="`${TMDB_IMAGE_BASE}${featured.backdrop_path}`" alt="hero" />
  </div>
</template>
