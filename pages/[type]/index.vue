<script setup lang="ts">
import type { Media, MediaType } from '~/types'

definePageMeta({
  key: (route) => route.fullPath,
  validate: ({ params }) => {
    return ['movie', 'tv'].includes(params.type as MediaType)
  },
})

interface QueryItem {
  type: MediaType
  title: string
  query: string
}
const QUERY_LIST: Record<string, QueryItem[]> = {
  movie: [
    { type: 'movie', title: 'Popular Movies', query: 'popular' },
    { type: 'movie', title: 'Top Rated Movies', query: 'top_rated' },
    { type: 'movie', title: 'Upcoming Movies', query: 'upcoming' },
    { type: 'movie', title: 'Now Playing Movies', query: 'now_playing' },
  ],
  tv: [
    { type: 'tv', title: 'Popular TV Shows', query: 'popular' },
    { type: 'tv', title: 'Top Rated TV Shows', query: 'top_rated' },
    { type: 'tv', title: 'Currently Airing TV Shows', query: 'on_the_air' },
    { type: 'tv', title: 'TV Shows Airing Today', query: 'airing_today' },
  ],
}

const route = useRoute()
const type = (route.params.type as MediaType) || 'movie'

useHead({
  title: type === 'movie' ? 'Movies' : 'TV Shows',
})

const popularList = await getMediaList(type, QUERY_LIST[type][0].query, 1)
const featured = ref<Media>(popularList.results[Math.floor(Math.random() * 4)])
getMedia('movie', featured.value.id).then((data) => (featured.value = data))
const [list1, list2, list3] = await Promise.all(
  QUERY_LIST[type].slice(1).map((q) => getMediaList(q.type, q.query, 1)),
)
const lists = computed(() => [list1, list2, list3])
</script>

<template>
  <main>
    <MediaHero :item="featured" />
    <section class="mt-7 md:mt-10 xl:mt-14">
      <div class="mx-[.9375rem] flex items-baseline md:mx-10 xl:mx-[3.125rem]">
        <h2 class="text-lg md:text-xl xl:text-2xl">Popular Movies</h2>
        <NuxtLink
          :to="`/${type}/category/${QUERY_LIST[type][0].query}`"
          class="ml-2.5 text-xs font-medium text-primary transition-opacity hover:opacity-80 md:text-sm xl:text-base"
        >
          Explore All
        </NuxtLink>
      </div>
      <MediaList class="mt-4">
        <CarouselItem
          v-for="media in popularList.results"
          :key="media.id"
          class="group inline-block w-[calc(33.33%-7.33326px)] snap-start pr-2 leading-relaxed first-of-type:ml-[.9375rem] last-of-type:mr-[.4375rem] sm:w-[calc(25%-18px)] md:first-of-type:ml-10 md:last-of-type:mr-8 lg:w-[calc(20%-14.4px)] xl:w-[calc(20%-18.4px)] xl:first-of-type:ml-[3.125rem] xl:last-of-type:mr-[2.625rem] 2xl:w-[calc(16.667%-15.33364px)]"
        >
          <MediaCard :item="media" :type="type" />
        </CarouselItem>
      </MediaList>
    </section>
    <section
      v-for="(q, index) in QUERY_LIST[type].slice(1)"
      :key="q.title"
      class="mt-7 md:mt-10 xl:mt-14"
    >
      <div class="mx-[.9375rem] flex items-baseline md:mx-10 xl:mx-[3.125rem]">
        <h2 class="text-lg md:text-xl xl:text-2xl">{{ q.title }}</h2>
        <NuxtLink
          :to="`/${type}/category/${q.query}`"
          class="ml-2.5 text-xs font-medium text-primary transition-opacity hover:opacity-80 md:text-sm xl:text-base"
        >
          Explore All
        </NuxtLink>
      </div>
      <MediaList class="mt-4">
        <CarouselItem
          v-for="media in lists[index].results"
          :key="media.id"
          class="group inline-block w-[calc(33.33%-7.33326px)] snap-start pr-2 leading-relaxed first-of-type:ml-[.9375rem] last-of-type:mr-[.4375rem] sm:w-[calc(25%-18px)] md:first-of-type:ml-10 md:last-of-type:mr-8 lg:w-[calc(20%-14.4px)] xl:w-[calc(20%-18.4px)] xl:first-of-type:ml-[3.125rem] xl:last-of-type:mr-[2.625rem] 2xl:w-[calc(16.667%-15.33364px)]"
        >
          <MediaCard :item="media" :type="type" />
        </CarouselItem>
      </MediaList>
    </section>
  </main>
</template>
