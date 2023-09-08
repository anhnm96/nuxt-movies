<script setup lang="ts">
import type { Media, MediaType } from '~/types'

definePageMeta({
  key: (route) => route.fullPath,
  validate: ({ params }) => {
    return ['movie', 'tv'].includes(params.type as MediaType)
  },
})

interface QueryItem {
  type: MediaType
  title: string
  query: string
}
const QUERY_LIST: Record<string, QueryItem[]> = {
  movie: [
    { type: 'movie', title: 'Popular Movies', query: 'popular' },
    { type: 'movie', title: 'Top Rated Movies', query: 'top_rated' },
    { type: 'movie', title: 'Upcoming Movies', query: 'upcoming' },
    { type: 'movie', title: 'Now Playing Movies', query: 'now_playing' },
  ],
  tv: [
    { type: 'tv', title: 'Popular TV Shows', query: 'popular' },
    { type: 'tv', title: 'Top Rated TV Shows', query: 'top_rated' },
    { type: 'tv', title: 'Currently Airing TV Shows', query: 'on_the_air' },
    { type: 'tv', title: 'TV Shows Airing Today', query: 'airing_today' },
  ],
}

const route = useRoute()
const type = (route.params.type as MediaType) || 'movie'

useHead({
  title: type === 'movie' ? 'Movies' : 'TV Shows',
})

const popularList = await getMediaList(type, QUERY_LIST[type][0].query, 1)
const featured = ref<Media>(popularList.results[Math.floor(Math.random() * 4)])
getMedia('movie', featured.value.id).then((data) => (featured.value = data))
const [list1, list2, list3] = await Promise.all(
  QUERY_LIST[type].slice(1).map((q) => getMediaList(q.type, q.query, 1)),
)
const lists = computed(() => [list1, list2, list3])
</script>

<template>
  <main>
    <MediaHero :item="featured" />
    <MediaSection
      title="Popular Movies"
      :type="type"
      :query="QUERY_LIST[type][0].query"
      :items="popularList.results"
    />
    <MediaSection
      v-for="(q, index) in QUERY_LIST[type].slice(1)"
      :key="q.title"
      :title="q.title"
      :type="type"
      :query="q.query"
      :items="lists[index].results"
    />
  </main>
</template>
