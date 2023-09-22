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
const page = ref(1)
const totalPages = ref(1)
function reset() {
  items.value = []
  page.value = 1
  totalPages.value = 0
}

onBeforeRouteUpdate(async (to, from) => {
  reset()
  await fetch(to.query.q)
})

async function fetch(query = route.query.q) {
  if (!query || (totalPages.value !== 0 && page.value > totalPages.value))
    return
  const data = await searchShows(query as string, page.value)
  if (!data.results.length) {
    reset()
  } else {
    items.value.push(...data.results)
    page.value++
    totalPages.value = data.total_pages
  }
}

await fetch()
useHead({
  title: route.query.q as string,
})
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
    <InfiniteLoad v-if="page <= totalPages" @infinite-load="fetch" />
  </main>
</template>
