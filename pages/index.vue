<script setup lang="ts">
import type { Media } from '@/types'
import { TMDB_IMAGE_BASE } from '@/constants/images'

const { locale } = useI18n()
const list = await getMediaList('movie', 'week', 1)
const featured = ref<Media>(
  list.results[0],
  // list.results[Math.floor(Math.random() * 5],
)
getMedia('movie', featured.value.id).then((data) => (featured.value = data))
const tvShows = await getMediaList('tv', 'week', 1)
console.log({ featured })
</script>

<template>
  <div class="scrollbar lg:grid lg:grid-cols-[1fr_max-content]">
    <nav class="hidden h-screen w-[100px] bg-green-500 lg:block"></nav>
    <div>
      <main>
        <div class="relative aspect-video max-h-[60vh] w-full">
          <div class="absolute inset-0 lg:left-auto lg:w-2/3">
            <img
              :src="`${TMDB_IMAGE_BASE}/original${featured.backdrop_path}`"
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
              <h1>{{ featured.title }}</h1>
              <div
                class="flex flex-col gap-3 text-sm text-gray-400 md:flex-row md:items-center"
              >
                <div class="flex gap-1">
                  <StarsRate class="w-24" :value="featured.vote_average" />
                  <p>
                    {{
                      new Intl.NumberFormat(locale).format(featured.vote_count)
                    }}
                    Reviews
                  </p>
                </div>
                <div class="flex gap-3">
                  <div>{{ featured.release_date.slice(0, 4) }}</div>
                  <div>{{ formatTime(featured.runtime!) }}</div>
                </div>
              </div>
              <p class="line-clamp-3 hidden md:block">
                {{ featured.overview }}
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
        <!-- end hero -->
        <section class="mt-7 md:mt-10 xl:mt-14">
          <div
            class="mx-[.9375rem] flex items-baseline md:mx-10 xl:mx-[3.125rem]"
          >
            <h2 class="text-lg md:text-xl xl:text-2xl">Trending Movies</h2>
            <a
              class="ml-2.5 text-xs font-medium text-primary transition-opacity hover:opacity-80 md:text-sm xl:text-base"
            >
              Explore All
            </a>
          </div>
          <Carousel
            class="relative mt-4 overflow-hidden"
            items-class="w-[calc(100vw-16px)] scroll-p-[.9375rem] overflow-x-scroll whitespace-nowrap md:scroll-p-10 lg:w-[calc(100vw-116px)] xl:scroll-p-[3.125rem]"
          >
            <template #header="{ prev, next }">
              <button
                class="ease absolute bottom-14 left-0 top-0 z-10 hidden w-10 bg-black/50 transition duration-200 hover:bg-black/75 md:block xl:w-[3.125rem]"
                aria-label="Previous"
                @click="prev"
              >
                <svg
                  class="mx-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="none"
                    stroke="#fff"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-miterlimit="10"
                    d="M17.9 23.2L6.1 12 17.9.8"
                  ></path>
                </svg>
              </button>
              <button
                class="ease absolute bottom-14 right-0 top-0 z-10 hidden w-10 bg-black/50 transition duration-200 hover:bg-black/75 md:block xl:w-[3.125rem]"
                aria-label="Next"
                @click="next"
              >
                <svg
                  class="mx-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="none"
                    stroke="#fff"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-miterlimit="10"
                    d="M6.1 23.2L17.9 12 6.1.8"
                  ></path>
                </svg>
              </button>
            </template>
            <template #default>
              <CarouselItem
                v-for="media in list.results"
                :key="media.id"
                class="group inline-block w-[calc(33.33%-7.33326px)] snap-start pr-2 leading-relaxed first-of-type:ml-[.9375rem] last-of-type:mr-[.4375rem] sm:w-[calc(25%-18px)] md:first-of-type:ml-10 md:last-of-type:mr-8 lg:w-[calc(20%-14.4px)] xl:w-[calc(20%-18.4px)] xl:first-of-type:ml-[3.125rem] xl:first-of-type:ml-[3.125rem] xl:last-of-type:mr-[2.625rem] 2xl:w-[calc(16.667%-15.33364px)]"
              >
                <div
                  class="relative h-0 overflow-hidden pt-[150%] transition-transform duration-500 ease-in-out group-hover:scale-[1.03]"
                >
                  <img
                    class="absolute left-0 top-0 block h-full w-full"
                    :src="`${TMDB_IMAGE_BASE}/w370_and_h556_bestv2${media.poster_path}`"
                    :alt="media.title"
                  />
                </div>
                <p class="mt-2.5 truncate">{{ media.title }}</p>
                <div class="flex items-baseline gap-1">
                  <StarsRate class="w-[4.5rem]" :value="media.vote_average" />
                  <p class="text-sm text-gray-400">
                    {{ media.vote_average }}
                  </p>
                </div>
              </CarouselItem>
            </template>
          </Carousel>
        </section>
        <!-- tv shows -->
        <section class="mt-7 md:mt-10 xl:mt-14">
          <div
            class="mx-[.9375rem] flex items-baseline md:mx-10 xl:mx-[3.125rem]"
          >
            <h2 class="text-lg md:text-xl xl:text-2xl">Trending TV Shows</h2>
            <a
              class="ml-2.5 text-xs font-medium text-primary transition-opacity hover:opacity-80 md:text-sm xl:text-base"
            >
              Explore All
            </a>
          </div>
          <Carousel
            class="relative mt-4 overflow-hidden"
            items-class="w-[calc(100vw-16px)] scroll-p-[.9375rem] overflow-x-scroll whitespace-nowrap md:scroll-p-10 lg:w-[calc(100vw-116px)] xl:scroll-p-[3.125rem]"
          >
            <template #header="{ prev, next }">
              <button
                class="ease absolute bottom-14 left-0 top-0 z-10 hidden w-10 bg-black/50 transition duration-200 hover:bg-black/75 md:block xl:w-[3.125rem]"
                aria-label="Previous"
                @click="prev"
              >
                <svg
                  class="mx-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="none"
                    stroke="#fff"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-miterlimit="10"
                    d="M17.9 23.2L6.1 12 17.9.8"
                  ></path>
                </svg>
              </button>
              <button
                class="ease absolute bottom-14 right-0 top-0 z-10 hidden w-10 bg-black/50 transition duration-200 hover:bg-black/75 md:block xl:w-[3.125rem]"
                aria-label="Next"
                @click="next"
              >
                <svg
                  class="mx-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="none"
                    stroke="#fff"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-miterlimit="10"
                    d="M6.1 23.2L17.9 12 6.1.8"
                  ></path>
                </svg>
              </button>
            </template>
            <template #default>
              <CarouselItem
                v-for="media in tvShows.results"
                :key="media.id"
                class="group inline-block w-[calc(33.33%-7.33326px)] snap-start pr-2 leading-relaxed first-of-type:ml-[.9375rem] last-of-type:mr-[.4375rem] sm:w-[calc(25%-18px)] md:first-of-type:ml-10 md:last-of-type:mr-8 lg:w-[calc(20%-14.4px)] xl:w-[calc(20%-18.4px)] xl:first-of-type:ml-[3.125rem] xl:first-of-type:ml-[3.125rem] xl:last-of-type:mr-[2.625rem] 2xl:w-[calc(16.667%-15.33364px)]"
              >
                <div
                  class="relative h-0 overflow-hidden pt-[150%] transition-transform duration-500 ease-in-out group-hover:scale-[1.03]"
                >
                  <img
                    class="absolute left-0 top-0 block h-full w-full"
                    :src="`${TMDB_IMAGE_BASE}/w370_and_h556_bestv2${media.poster_path}`"
                    :alt="media.name"
                  />
                </div>
                <p class="mt-2.5 truncate">{{ media.name }}</p>
                <div class="flex items-baseline gap-1">
                  <StarsRate class="w-[4.5rem]" :value="media.vote_average" />
                  <p class="text-sm text-gray-400">
                    {{ media.vote_average }}
                  </p>
                </div>
              </CarouselItem>
            </template>
          </Carousel>
        </section>
      </main>
      <TheFooter />
    </div>
  </div>
</template>
