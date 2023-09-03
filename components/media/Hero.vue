<script setup lang="ts">
import type { Media } from 'types'
import { TMDB_IMAGE_BASE } from '@/constants/images'

defineProps<{ item: Media }>()
const { locale } = useI18n()
</script>

<template>
  <div class="relative aspect-video max-h-[60vh] w-full">
    <div class="absolute inset-0 lg:left-auto lg:w-2/3">
      <img
        :src="`${TMDB_IMAGE_BASE}/original${item.backdrop_path}`"
        alt="hero"
        class="h-full w-full object-cover"
      />
      <div
        class="absolute inset-0 grid place-items-center bg-gray-900/10 lg:hidden"
      >
        <button class="-translate-y-1/2 p-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="60"
            height="60"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8zm-2.5-3.5l7-4.5l-7-4.5v9z"
            />
          </svg>
        </button>
      </div>
    </div>
    <div
      class="absolute bottom-0 left-0 right-0 flex flex-col justify-center bg-gradient-to-t from-black from-15% via-black/75 to-transparent p-4 md:px-14 md:py-8 lg:top-0 lg:w-2/3 lg:bg-gradient-to-r lg:from-0% lg:via-black"
    >
      <div class="space-y-3 md:space-y-6 lg:w-[65%]">
        <h1>{{ item.title }}</h1>
        <div
          class="flex flex-col gap-3 text-sm text-gray-400 md:flex-row md:items-center"
        >
          <div class="flex gap-1">
            <StarsRate class="w-24" :value="item.vote_average" />
            <p>
              {{ new Intl.NumberFormat(locale).format(item.vote_count) }}
              Reviews
            </p>
          </div>
          <div class="flex gap-3">
            <div>{{ item.release_date.slice(0, 4) }}</div>
            <div>{{ formatTime(item.runtime!) }}</div>
          </div>
        </div>
        <p class="hidden md:line-clamp-3">
          {{ item.overview }}
        </p>
        <button
          class="hidden items-center gap-2 rounded-sm bg-gray-400/20 px-6 py-3 font-medium transition hover:bg-gray-400/30 lg:flex"
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
</template>
