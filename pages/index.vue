<script setup lang="ts">
import type { Media } from '@/types'

const { data: list } = await getTrending('movie', 1)

const featured = ref<Media>(list.value!.results[0])
console.log('featured', featured.value)
getMedia('movie', featured.value.id).then(
  ({ data }) => (featured.value = data.value!),
)
const { data: tvShows } = await getTrending('tv', 1)
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
