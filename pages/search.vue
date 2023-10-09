<script lang="ts">
import { useInfiniteQuery } from '@tanstack/vue-query'
import { useSearch } from '@/stores/search'

let _fromPage = '/'
export default {
  beforeRouteEnter(to, from) {
    _fromPage = from.fullPath
  },
}
</script>

<script setup lang="ts">
const searchStore = useSearch()
searchStore.setFromPage(_fromPage)
const route = useRoute()

onBeforeRouteUpdate(async (to, from) => {
  q.value = to.query.q as string
})

onBeforeRouteLeave(() => {
  searchStore.toggleSearch(false)
})

const q = ref(route.query.q as string)
const {
  data,
  isLoading,
  fetchNextPage,
  isFetchingNextPage,
  hasNextPage,
  suspense,
} = useInfiniteQuery({
  queryKey: ['search', q],
  queryFn: ({ pageParam = 1 }) => {
    return searchShows(q.value, pageParam)
  },
  getNextPageParam: (lastPage) => {
    return lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined
  },
})
if (process.server) await suspense()
useHead({
  title: q,
})
</script>

<template>
  <main class="margin-section wrapper mx-auto pt-16 lg:container">
    <h2 class="capitalize">
      {{
        $t('Search result for: {currentSearch}', {
          currentSearch: route.query.q,
        })
      }}
    </h2>
    <div
      class="mt-4 grid grid-cols-[repeat(auto-fit,_minmax(208px,_1fr))] gap-2 xl:mt-5"
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
          :type="item.media_type!"
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
