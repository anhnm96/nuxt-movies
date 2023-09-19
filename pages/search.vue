<script lang="ts">
import { useSearch } from '@/stores/search'

const searchStore = useSearch()
export default {
  beforeRouteEnter(to, from) {
    console.log('before', from)
    searchStore.setFromPage(from.fullPath)
  },
}
</script>

<script setup lang="ts">
const route = useRoute()
onBeforeRouteUpdate(() => {})
</script>

<template>
  <main class="pt-16">Search: {{ $route.query.q }}</main>
</template>
