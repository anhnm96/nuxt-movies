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
  const { data } = await getMediaByGenre(type, no, page)
  items.push(...data.value.results)
  page++
}
await fetch()
const title = `${type === 'movie' ? 'Movie' : 'TV'} Genre: ${name}`
useHead({
  title,
})
</script>

<template>
  <main class="margin-section wrapper mx-auto lg:container">
    <h2 class="capitalize">
      {{ title }}
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
