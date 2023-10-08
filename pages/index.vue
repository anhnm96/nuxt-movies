<script setup lang="ts">
import { useMedia, useTrending } from '@/stores/media'

const {
  data: list,
  isLoading,
  suspense: suspenseTrending,
} = useTrending('movie')
const listItems = computed(() => list.value?.results)
await suspenseTrending()

const { data: featured, suspense: suspenseFeatured } = useMedia(
  'movie',
  list.value!.results[0].id,
)

const {
  data: tvShows,
  isLoading: loadingTV,
  suspense: suspenseTV,
} = useTrending('tv')
const tvShowsItems = computed(() => tvShows.value?.results)

if (process.server) await Promise.all([suspenseFeatured(), suspenseTV()])
</script>

<template>
  <main>
    <MediaHero :item="featured" />
    <MediaSection
      title="Trending Movies"
      type="movie"
      query="trending"
      :items="listItems"
      :loading="isLoading"
    />
    <MediaSection
      title="Trending TV Shows"
      type="tv"
      query="trending"
      :items="tvShowsItems"
      :loading="loadingTV"
    />
  </main>
</template>
