<script lang="ts">
import { useMedia, useMediaList } from '@/stores/media'
import type { MediaType } from '~/types'

// enable view transition when move
// from type-category-query to this page
let lastPageQuery = null
export default {
  beforeRouteEnter(to, from) {
    if (from.name === 'type-category-query') {
      lastPageQuery = from.params.query as string
    }
  },
}
</script>

<script setup lang="ts">
definePageMeta({
  key: (route) => route.fullPath,
  validate: ({ params }) => {
    return ['movie', 'tv'].includes(params.type as MediaType)
  },
})

const activeList = ref()
if (lastPageQuery) activeList.value = lastPageQuery
onMounted(() => {
  requestAnimationFrame(() => {
    activeList.value = null
  })
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

const [
  { data: list1, isLoading: isLoading1, suspense: suspense1 },
  { data: list2, isLoading: isLoading2, suspense: suspense2 },
  { data: list3, isLoading: isLoading3, suspense: suspense3 },
] = QUERY_LIST[type].slice(1).map((q) => useMediaList(q.type, q.query, 1))
const lists = computed(() => {
  return [list1.value, list2.value, list3.value]
})
const loading = computed(
  () => isLoading1.value && isLoading2.value && isLoading3.value,
)

useHead({
  title: type === 'movie' ? 'Movies' : 'TV Shows',
})
// if (process.server) await Promise.all([suspenseFeatured(), suspenseLists])
if (process.server)
  await Promise.all([suspenseFeatured(), suspense1(), suspense2(), suspense3()])
</script>

<template>
  <main>
    <MediaHero :item="featured" />
    <MediaSection
      :title="$t('Popular Movies')"
      :type="type"
      :query="QUERY_LIST[type][0].query"
      :items="popularList?.results"
      :loading="
        isLoading || (activeList && activeList !== QUERY_LIST[type][0].query)
      "
      @before-navigate="activeList = QUERY_LIST[type][0].query"
    />
    <template v-for="(q, index) in QUERY_LIST[type].slice(1)" :key="q.title">
      <MediaSection
        :title="$t(q.title)"
        :type="type"
        :query="q.query"
        :items="lists[index]?.results"
        :loading="loading || (activeList && activeList !== q.query)"
        @before-navigate="activeList = q.query"
      />
    </template>
  </main>
</template>
