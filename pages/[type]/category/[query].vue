<script setup lang="ts">
import { useInfiniteQuery } from '@tanstack/vue-query'
import type { MediaType } from '@/types'

const route = useRoute()
const type = (route.params.type as MediaType) || 'movie'
const query = route.params.query as string

function fetch({ pageParam = 1 }) {
  if (query === 'trending') return getTrending(type, pageParam)
  return getMediaList(type, query, pageParam)
}
const { data, fetchNextPage, isFetchingNextPage, hasNextPage, suspense } =
  useInfiniteQuery({
    queryKey: [type, query],
    queryFn: fetch,
    getNextPageParam: (lastPage) => {
      return lastPage.page < lastPage.total_pages
        ? lastPage.page + 1
        : undefined
    },
  })
const title = `${query[0].toUpperCase() + query.replace(/_/g, ' ').slice(1)} ${
  type === 'tv' ? 'TV' : 'Movies'
}`
useHead({
  title,
})
if (process.server) await suspense()
</script>

<template>
  <main class="margin-section wrapper mx-auto lg:container">
    <h2>{{ title }}</h2>
    <div
      v-if="data"
      class="mt-4 grid grid-cols-[repeat(auto-fit,_minmax(208px,_1fr))] gap-2 xl:mt-5"
    >
      <template v-for="group in data.pages" :key="group.page">
        <MediaCard
          v-for="item in group.results"
          :key="item.id"
          :item="item"
          :type="type"
        />
      </template>
    </div>
    <div
      v-if="isFetchingNextPage"
      aria-label="loading"
      class="mt-2 animate-pulse text-center"
    >
      <Icon
        name="mingcute:loading-line"
        class="animate-spin text-4xl text-primary"
      />
    </div>
    <InfiniteLoad v-else-if="hasNextPage" @infinite-load="fetchNextPage" />
  </main>
</template>
