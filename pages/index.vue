<script setup lang="ts">
import type { Media } from '@/types'

const list = await getTrending('movie', 1)
const featured = ref<Media>(list.results[0])
getMedia('movie', featured.value.id).then((data) => (featured.value = data))
const tvShows = await getTrending('tv', 1)
</script>

<template>
  <main>
    <MediaHero :item="featured" />
    <MediaSection
      title="Trending Movies"
      type="movie"
      query="trending"
      :items="list.results"
    />
    <MediaSection
      title="Trending TV Shows"
      type="tv"
      query="trending"
      :items="tvShows.results"
    />
  </main>
</template>
