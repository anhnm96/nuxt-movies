<script setup lang="ts">
import type { Media, MediaType, PageResult } from '~/types'
import { updateMediaCache, useMedia, useMediaList } from '@/stores/media'

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

const {
  data: popularList,
  isLoading,
  suspense: suspensePopularList,
} = useMediaList(type, QUERY_LIST[type][0].query, 1)
await suspensePopularList()
const { data: featured, suspense: suspenseFeatured } = useMedia(
  type,
  popularList.value!.results[0].id,
)

const suspenseLists = createControlledPromise<void>()
const loading = ref(true)
const lists = ref<PageResult<Media>[]>()
Promise.all(
  QUERY_LIST[type].slice(1).map((q) => getMediaList(q.type, q.query, 1)),
).then((data) => {
  data.forEach((list) => updateMediaCache(list, type))
  suspenseLists.resolve()
  loading.value = false
  lists.value = data
})

useHead({
  title: type === 'movie' ? 'Movies' : 'TV Shows',
})
if (process.server) await Promise.all([suspenseFeatured(), suspenseLists])
</script>

<template>
  <main>
    <MediaHero :item="featured" />
    <MediaSection
      :title="$t('Popular Movies')"
      :type="type"
      :query="QUERY_LIST[type][0].query"
      :items="popularList?.results"
      :loading="isLoading"
    />
    <MediaSection
      v-for="(q, index) in QUERY_LIST[type].slice(1)"
      :key="q.title"
      :title="$t(q.title)"
      :type="type"
      :query="q.query"
      :items="lists?.[index].results"
      :loading="loading"
    />
  </main>
</template>
