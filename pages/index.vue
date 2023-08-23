<script setup lang="ts">
import type { Media } from '@/types'
import { TMDB_IMAGE_BASE } from '@/constants/images'

const list = await getMediaList('movie', 'popular', 1)
const featured = ref<Media>(
  list.results[0],
  // list.results[Math.floor(Math.random() * 5],
)
getMedia('movie', featured.value.id).then((data) => (featured.value = data))
console.log({ featured })
</script>

<template>
  <div>
    <main>
      <div class="aspect-[25/9] max-h-[50vh] w-full">
        <div class="ml-auto w-[66.6%]">
          <img
            :src="`${TMDB_IMAGE_BASE}${featured.backdrop_path}`"
            alt="hero"
          />
        </div>
        <div>
          <h1>{{ featured.title }}</h1>
          <div class="flex items-center gap-3">
            <div>
              <StarsRate class="w-24" :value="featured.vote_average" />
              <p>{{ featured.vote_count }} Reviews</p>
            </div>
            <div>{{ formatTime(featured.runtime) }}</div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
