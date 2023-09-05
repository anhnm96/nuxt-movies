<script setup lang="ts">
import type { Media } from '@/types'

const list = await getTrending('movie', 1)
const featured = ref<Media>(list.results[Math.floor(Math.random() * 4)])
getMedia('movie', featured.value.id).then((data) => (featured.value = data))
const tvShows = await getTrending('tv', 1)
</script>

<template>
  <main>
    <MediaHero :item="featured" />
    <!-- end hero -->
    <section class="mt-7 md:mt-10 xl:mt-14">
      <div class="mx-[.9375rem] flex items-baseline md:mx-10 xl:mx-[3.125rem]">
        <h2 class="text-lg md:text-xl xl:text-2xl">Trending Movies</h2>
        <a
          class="ml-2.5 text-xs font-medium text-primary transition-opacity hover:opacity-80 md:text-sm xl:text-base"
        >
          Explore All
        </a>
      </div>
      <MediaList class="mt-4">
        <CarouselItem
          v-for="media in list.results"
          :key="media.id"
          class="group inline-block w-[calc(33.33%-7.33326px)] snap-start pr-2 leading-relaxed first-of-type:ml-[.9375rem] last-of-type:mr-[.4375rem] sm:w-[calc(25%-18px)] md:first-of-type:ml-10 md:last-of-type:mr-8 lg:w-[calc(20%-14.4px)] xl:w-[calc(20%-18.4px)] xl:first-of-type:ml-[3.125rem] xl:last-of-type:mr-[2.625rem] 2xl:w-[calc(16.667%-15.33364px)]"
        >
          <MediaCard :item="media" type="movie" />
        </CarouselItem>
      </MediaList>
    </section>
    <!-- tv shows -->
    <section class="mt-7 md:mt-10 xl:mt-14">
      <div class="mx-[.9375rem] flex items-baseline md:mx-10 xl:mx-[3.125rem]">
        <h2 class="text-lg md:text-xl xl:text-2xl">Trending TV Shows</h2>
        <a
          class="ml-2.5 text-xs font-medium text-primary transition-opacity hover:opacity-80 md:text-sm xl:text-base"
        >
          Explore All
        </a>
      </div>
      <MediaList class="mt-4">
        <CarouselItem
          v-for="media in tvShows.results"
          :key="media.id"
          class="group inline-block w-[calc(33.33%-7.33326px)] snap-start pr-2 leading-relaxed first-of-type:ml-[.9375rem] last-of-type:mr-[.4375rem] sm:w-[calc(25%-18px)] md:first-of-type:ml-10 md:last-of-type:mr-8 lg:w-[calc(20%-14.4px)] xl:w-[calc(20%-18.4px)] xl:first-of-type:ml-[3.125rem] xl:last-of-type:mr-[2.625rem] 2xl:w-[calc(16.667%-15.33364px)]"
        >
          <MediaCard :item="media" type="tv" />
        </CarouselItem>
      </MediaList>
    </section>
  </main>
</template>
