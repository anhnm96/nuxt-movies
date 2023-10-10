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
const {
  data,
  isLoading,
  fetchNextPage,
  isFetchingNextPage,
  hasNextPage,
  suspense,
} = useInfiniteQuery({
  queryKey: [type, query],
  queryFn: fetch,
  getNextPageParam: (lastPage) => {
    return lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined
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
      class="mt-4 grid grid-cols-2 sm:grid-cols-[repeat(auto-fit,_minmax(208px,_1fr))] gap-2 xl:mt-5"
    >
      <template v-if="isLoading">
        <div v-for="i in 10" :key="i">
          <div class="relative pt-[150%]">
            <Skeleton class="absolute left-0 top-0 h-full w-full" />
          </div>
          <Skeleton class="mt-2.5">&nbsp;</Skeleton>
          <Skeleton class="mt-1 h-4 w-2/3" />
        </div>
      </template>
      <template v-for="group in data.pages" v-else-if="data" :key="group.page">
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
