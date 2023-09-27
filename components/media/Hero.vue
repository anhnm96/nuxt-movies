<script setup lang="ts">
import type { Media } from 'types'
import { TMDB_IMAGE_BASE } from '@/constants/images'

const props = defineProps<{ item: Media }>()
const { locale } = useI18n()
const route = useRoute()
const type = route.params.type || 'movie'
const id = route.params.id
const trailer = computed(() => {
  const video = props.item.videos?.results.find((v) => v.type === 'Trailer')
  if (!video) return ''
  return `https://www.youtube.com/embed/${video.key}?rel=0&showinfo=0&autoplay=1`
})
const showModal = ref(false)

const releaseYear = computed(() => {
  const date = props.item.release_date
    ? props.item.release_date
    : props.item.first_air_date
  return date?.slice(0, 4)
})
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
        @click="showModal = true"
      >
        <button
          v-if="trailer"
          :aria-label="$t('Watch Trailer')"
          class="-translate-y-1/2 p-3"
        >
          <Icon name="ic:round-play-circle-outline" size="60px" />
        </button>
      </div>
    </div>
    <div
      class="absolute bottom-0 left-0 right-0 flex flex-col justify-center bg-gradient-to-t from-black from-15% via-black/75 to-transparent p-4 md:px-14 md:py-8 lg:top-0 lg:w-2/3 lg:bg-gradient-to-r lg:from-0% lg:via-black"
    >
      <div class="space-y-3 md:space-y-6 lg:w-[65%]">
        <h1 v-if="id">
          {{ item.title || item.name }}
        </h1>
        <h1 v-else>
          <NuxtLink :to="`${type}/${item.id}`">
            {{ item.title || item.name }}
          </NuxtLink>
        </h1>
        <div
          class="flex flex-col gap-3 text-sm text-gray-400 md:flex-row md:items-center"
        >
          <div class="flex gap-1">
            <StarsRate class="w-24" :value="item.vote_average" />
            <p>
              {{
                $t('{numberOfReviews} Reviews', {
                  numberOfReviews: new Intl.NumberFormat(locale).format(
                    item.vote_count,
                  ),
                })
              }}
            </p>
          </div>
          <div class="flex gap-3">
            <div>{{ releaseYear }}</div>
            <div v-if="item.runtime">{{ formatTime(item.runtime) }}</div>
            <div v-if="item.number_of_seasons">
              Season {{ item.number_of_seasons }}
            </div>
          </div>
        </div>
        <p class="hidden md:line-clamp-3">
          {{ item.overview }}
        </p>
        <button
          v-if="trailer"
          class="hidden items-center gap-2 rounded-sm bg-gray-400/20 px-6 py-3 font-medium transition hover:bg-gray-400/30 lg:flex"
          @click="showModal = true"
        >
          <Icon class="mb-0.5" name="carbon:play-filled-alt" />
          <span>{{ $t('Watch Trailer') }}</span>
        </button>
      </div>
    </div>
    <Modal v-slot="{ close }" v-model="showModal">
      <button
        class="z-100 fixed right-1 top-1 p-3 text-3xl"
        aria-label="close"
        @click="close"
      >
        <Icon name="i-carbon-close" />
      </button>
      <div class="aspect-video w-[80vw]">
        <iframe
          allow="autoplay; encrypted-media"
          allowfullscreen
          :src="trailer"
          class="h-full w-full"
        />
      </div>
    </Modal>
  </div>
</template>
