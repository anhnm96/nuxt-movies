<script lang="ts">
import { useSearch } from '@/stores/search'
import type { Media } from '@/types'

const searchStore = useSearch()
export default {
  beforeRouteEnter(to, from) {
    searchStore.setFromPage(from.fullPath)
  },
}
</script>

<script setup lang="ts">
const route = useRoute()

const items = ref<Media[]>([])
let page = 1
let totalPages = 1
function reset() {
  items.value = []
  page = 1
  totalPages = 1
}

onBeforeRouteUpdate(async (to, from) => {
  console.log(to.query.q, from.query.q)
  reset()
  await fetch(to.query.q)
})

async function fetch(query = route.query.q) {
  console.log('fetch', query, page, totalPages)
  if (page > totalPages) return
  const data = await searchShows(query, page)
  if (!data.results.length) {
    reset()
  } else {
    items.value.push(...data.results)
    page++
    totalPages = data.total_pages
  }
}
console.log('mounted')
await fetch()
</script>

<template>
  <main class="margin-section wrapper mx-auto pt-16 lg:container">
    <h2 class="capitalize">Results for: {{ route.query.q }}</h2>
    <div
      class="mt-4 grid grid-cols-[repeat(auto-fit,_minmax(208px,_1fr))] gap-2 xl:mt-5"
    >
      <MediaCard
        v-for="item in items"
        :key="item.id"
        :item="item"
        :type="item.media_type!"
      />
    </div>
    <InfiniteLoad v-if="totalPages > 1" @infinite-load="fetch" />
  </main>
</template>
