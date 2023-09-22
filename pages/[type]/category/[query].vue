<script setup lang="ts">
import type { Media, MediaType } from '@/types'

const route = useRoute()
const type = (route.params.type as MediaType) || 'movie'
const query = route.params.query as string

const items = reactive<Media[]>([])

let page = 1
async function fetch() {
  if (query === 'trending')
    items.push(...(await getTrending(type, page)).results)
  else items.push(...(await getMediaList(type, query, page)).results)
  page++
}
await fetch()
const title = `${query[0].toUpperCase() + query.replace(/_/g, ' ').slice(1)} ${
  type === 'tv' ? 'TV' : 'Movies'
}`
useHead({
  title,
})
</script>

<template>
  <main class="margin-section wrapper mx-auto lg:container">
    <h2>{{ title }}</h2>
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
