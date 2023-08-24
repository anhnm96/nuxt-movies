<script setup lang="ts">
import type { Media } from '@/types'
import { TMDB_IMAGE_BASE } from '@/constants/images'

const { locale } = useI18n()
const list = await getMediaList('movie', 'popular', 1)
const featured = ref<Media>(
  list.results[0],
  // list.results[Math.floor(Math.random() * 5],
)
getMedia('movie', featured.value.id).then((data) => (featured.value = data))
console.log({ featured })
</script>

<template>
  <div class="flex">
    <nav class="h-screen w-[100px] bg-green-500"></nav>
    <main class="grow">
      <div class="relative aspect-video max-h-[60vh] w-full">
        <div class="absolute bottom-0 right-0 top-0 w-2/3">
          <img
            :src="`${TMDB_IMAGE_BASE}${featured.backdrop_path}`"
            alt="hero"
            class="h-full w-full object-cover"
          />
        </div>
        <div
          class="absolute inset-0 flex w-2/3 flex-col justify-center bg-gradient-to-r from-black via-black to-transparent px-14"
        >
          <div class="w-[65%] space-y-6">
            <h1>{{ featured.title }}</h1>
            <div class="flex items-center gap-3 text-sm text-gray-400">
              <div class="flex gap-1">
                <StarsRate class="w-24" :value="featured.vote_average" />
                <p>
                  {{
                    new Intl.NumberFormat(locale).format(featured.vote_count)
                  }}
                  Reviews
                </p>
              </div>
              <div>{{ featured.release_date.slice(0, 4) }}</div>
              <div>{{ formatTime(featured.runtime!) }}</div>
            </div>
            <p class="line-clamp-3">{{ featured.overview }}</p>
            <button
              class="flex items-center gap-2 rounded-sm bg-gray-400/20 px-6 py-3 font-medium transition hover:bg-gray-400/30"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="#fff"
                class="mb-[3px]"
                aria-hidden="true"
              >
                <path d="M3 22v-20l18 10-18 10z" />
              </svg>
              <span>Watch Trailer</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
