<script setup lang="ts">
import type { Media, MediaType } from '@/types'

const route = useRoute()
const type = (route.params.type as MediaType) || 'movie'
const no = route.params.no as string

const items = reactive<Media[]>([])

const list = await getGenreList(type)
const name = list.find((item) => item.id === +no)?.name

let page = 1
async function fetch() {
  const data = await getMediaByGenre(type, no, page)
  items.push(...data.results)
  page++
}
await fetch()
</script>

<template>
  <main class="margin-section wrapper mx-auto lg:container">
    <h2 class="capitalize">
      {{ `${type === 'movie' ? 'Movie' : 'TV'} genre: ${name}` }}
    </h2>
    <div
      class="mt-4 grid grid-cols-[repeat(auto-fit,_minmax(208px,_1fr))] gap-2 xl:mt-5"
    >
      <MediaCard
        v-for="item in items"
        :key="item.id"
        :item="item"
        :type="type"
      />
    </div>
    <InfiniteLoad @infinite-load="fetch" />
  </main>
</template>
