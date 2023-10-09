<script setup lang="ts">
import { useInfiniteQuery } from '@tanstack/vue-query'
import type { MediaType } from '@/types'
import { userGenreList } from '@/stores/media'

const route = useRoute()
const type = (route.params.type as MediaType) || 'movie'
const no = route.params.no as string

const { data: list, suspense: suspenseGenreList } = userGenreList(type)
await suspenseGenreList()
const name = list.value!.find((item) => item.id === +no)?.name

function fetch({ pageParam = 1 }) {
  return getMediaByGenre(type, no, pageParam)
}
const { data, fetchNextPage, isFetchingNextPage, hasNextPage, suspense } =
  useInfiniteQuery({
    queryKey: [type, 'genre', no],
    queryFn: fetch,
    getNextPageParam: (lastPage) => {
      return lastPage.page < lastPage.total_pages
        ? lastPage.page + 1
        : undefined
    },
  })
const title = `${type === 'movie' ? 'Movie' : 'TV'} Genre: ${name}`
useHead({
  title,
})
if (process.server) await suspense()
</script>

<template>
  <main class="margin-section wrapper mx-auto lg:container">
    <h2 class="capitalize">
      {{ title }}
    </h2>
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
