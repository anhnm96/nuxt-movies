<script setup lang="ts">
import type { MediaType } from '@/types'
import { TMDB_IMAGE_BASE } from '@/constants/images'

const { locale } = useI18n()
definePageMeta({
  key: (route) => route.fullPath,
  validate: ({ params }) => {
    return ['movie', 'tv'].includes(params.type as MediaType)
  },
})

const route = useRoute()
const type = (route.params.type as MediaType) || 'movie'
const id = route.params.id as string
// const type = computed(() => (route.params.type as MediaType) || 'movie')
// const id = computed(() => route.params.id as string)

const item = await getMedia(type, id)
console.log(item)
const tab = ref<'overview' | 'videos' | 'photos'>('overview')

const externalIds = (function () {
  if (!item.external_ids) return []
  const res = []
  for (const [key, value] of Object.entries(item.external_ids)) {
    const id = key.substring(0, key.length - 3)
    let link
    if (id === 'imdb') {
      link = `https://imdb.com/title/${value}`
    } else if (id === 'wikidata') {
      link = `https://wikidata.org/wiki/${value}`
    } else {
      link = `https://${id}.com/${value}`
    }

    res.push({
      id,
      link,
      icon: `simple-icons:${id}`,
    })
  }
  res.push({ id: 'homepage', link: item.homepage, icon: 'i-ph-link-simple' })

  return res
})()

const directors = computed(
  () => item.credits?.crew.filter((person) => person.job === 'Director'),
)
</script>

<template>
  <div class="scrollbar lg:grid lg:grid-cols-[min-content_auto]">
    <nav class="hidden h-screen w-[100px] bg-green-500 lg:block"></nav>
    <div>
      <main>
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
              <p class="line-clamp-3 hidden md:block">
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
        <!-- end hero -->
        <section class="pt-6">
          <div class="flex justify-center xl:gap-16">
            <button
              class="text-anim flex-auto py-3 text-sm font-medium uppercase xl:inline-block xl:flex-initial xl:text-xl"
              :class="[
                tab === 'overview'
                  ? 'border-b-2 border-white text-white'
                  : 'text-gray-400/90 hover:text-white',
              ]"
              @click="tab = 'overview'"
            >
              Overview
            </button>
            <button
              class="text-anim flex-auto py-3 text-sm font-medium uppercase xl:inline-block xl:flex-initial xl:text-xl"
              :class="[
                tab === 'videos'
                  ? 'border-b-2 border-white text-white'
                  : 'text-gray-400/90 hover:text-white',
              ]"
              @click="tab = 'videos'"
            >
              Videos
            </button>
            <button
              class="text-anim flex-auto py-3 text-sm font-medium uppercase xl:inline-block xl:flex-initial xl:text-xl"
              :class="[
                tab === 'photos'
                  ? 'border-b-2 border-white text-white'
                  : 'text-gray-400/90 hover:text-white',
              ]"
              @click="tab = 'photos'"
            >
              Photos
            </button>
          </div>
          <!-- tab content -->
          <div class="margin-y">
            <div class="lg:container lg:mx-auto">
              <section
                class="wrapper grid grid-cols-[minmax(auto,25%)_1fr] gap-8 xl:gap-14"
              >
                <img
                  :src="`${TMDB_IMAGE_BASE}/w370_and_h556_bestv2${item.poster_path}`"
                  :alt="item.title"
                />
                <div class="space-y-6">
                  <h2>Storyline</h2>
                  <p>{{ item.overview }}</p>
                  <ul
                    class="grid grid-cols-[min-content_1fr] gap-x-6 gap-y-3 lg:grid-cols-[auto_1fr_auto_1fr]"
                  >
                    <template v-if="item.release_date">
                      <li class="contents">
                        <p>Release Date</p>
                        <p>{{ item.release_date }}</p>
                      </li>
                    </template>
                    <template v-if="item.runtime">
                      <li class="contents">
                        <p>Runtime</p>
                        <p>{{ formatTime(item.runtime) }}</p>
                      </li>
                    </template>
                    <template v-if="directors?.length">
                      <li class="contents">
                        <p>Directors</p>
                        <div class="flex flex-wrap gap-1">
                          <a
                            v-for="person of directors"
                            :key="person.id"
                            :to="`/person/${person.id}`"
                            class="rounded bg-gray-600/50 px-2 py-1 text-sm transition hover:bg-gray-600/70"
                            >{{ person.name }}</a
                          >
                        </div>
                      </li>
                    </template>
                    <template v-if="item.budget">
                      <li class="contents">
                        <p>Budget</p>
                        <p>${{ numberWithCommas(item.budget) }}</p>
                      </li>
                    </template>
                    <template v-if="item.revenue">
                      <li class="contents">
                        <p>Revenue</p>
                        <p>${{ numberWithCommas(item.revenue) }}</p>
                      </li>
                    </template>
                    <template v-if="item.genres?.length">
                      <p>Genre</p>

                      <p class="flex flex-wrap gap-1">
                        <a
                          v-for="genre of item.genres"
                          :key="genre.id"
                          :to="`/genre/${genre.id}/${type}`"
                          class="rounded bg-gray-600/50 px-2 py-1 text-sm transition hover:bg-gray-600/70"
                        >
                          {{ genre.name }}
                        </a>
                      </p>
                    </template>
                    <template v-if="item.status">
                      <li class="contents">
                        <p>Status</p>
                        <p>
                          {{ item.status }}
                        </p>
                      </li>
                    </template>
                    <template v-if="item.original_language">
                      <li class="contents">
                        <p>Language</p>
                        <p>
                          {{ item.original_language }}
                        </p>
                      </li>
                    </template>
                    <template v-if="item?.production_companies?.length">
                      <li class="contents">
                        <p>Production</p>
                        <p>
                          {{
                            item.production_companies
                              .map((i) => i.name)
                              .join(', ')
                          }}
                        </p>
                      </li>
                    </template>
                  </ul>
                  <ul class="-ml-[0.6875rem] flex">
                    <li v-for="e in externalIds" :key="e.id">
                      <a
                        class="text-anim inline-flex h-11 w-11 items-center justify-center hover:text-primary"
                        :href="e.link"
                        target="_blank"
                        :aria-label="`Link to ${e.id} account`"
                        rel="noopener noreferrer"
                      >
                        <Icon :name="e.icon" size="1.375em" />
                      </a>
                    </li>
                  </ul>
                </div>
              </section>
            </div>
            <!-- cast -->
            <section class="margin-y">
              <div
                class="mx-[.9375rem] flex items-baseline md:mx-10 xl:mx-[3.125rem]"
              >
                <h2 class="text-lg md:text-xl lg:text-2xl xl:text-3xl">Cast</h2>
              </div>
              <Carousel
                v-if="item.credits?.cast?.length"
                class="relative mt-4 overflow-hidden"
                items-class="w-[calc(100vw-16px)] scroll-p-[.9375rem] overflow-x-scroll whitespace-nowrap md:scroll-p-10 lg:w-[calc(100vw-116px)] xl:scroll-p-[3.125rem]"
              >
                <template #header="{ prev, next }">
                  <button
                    class="ease absolute bottom-14 left-0 top-0 z-10 hidden w-10 bg-black/50 text-3xl transition duration-200 hover:bg-black/75 md:block xl:w-[3.125rem]"
                    aria-label="Previous"
                    @click="prev"
                  >
                    <Icon name="heroicons:chevron-left" />
                  </button>
                  <button
                    class="ease absolute bottom-14 right-0 top-0 z-10 hidden w-10 bg-black/50 text-3xl transition duration-200 hover:bg-black/75 md:block xl:w-[3.125rem]"
                    aria-label="Next"
                    @click="next"
                  >
                    <Icon name="heroicons:chevron-right" />
                  </button>
                </template>
                <template #default>
                  <CarouselItem
                    v-for="person in item.credits.cast"
                    :key="person.id"
                    class="group inline-block w-[calc(33.33%-7.33326px)] snap-start pr-2 leading-relaxed first-of-type:ml-[.9375rem] last-of-type:mr-[.4375rem] sm:w-[calc(25%-18px)] md:first-of-type:ml-10 md:last-of-type:mr-8 lg:w-[calc(20%-14.4px)] xl:w-[calc(20%-18.4px)] xl:first-of-type:ml-[3.125rem] xl:last-of-type:mr-[2.625rem] 2xl:w-[calc(16.667%-15.33364px)]"
                  >
                    <NuxtLink :to="`/person/${person.id}`">
                      <div
                        class="relative h-0 overflow-hidden pt-[150%] transition-transform duration-500 ease-in-out group-hover:scale-[1.03]"
                      >
                        <img
                          v-if="person.profile_path"
                          class="absolute left-0 top-0 block h-full w-full"
                          :src="`${TMDB_IMAGE_BASE}/w370_and_h556_bestv2${person.profile_path}`"
                          :alt="person.name"
                        />
                        <div
                          v-else
                          class="absolute left-0 top-0 grid h-full w-full place-items-center bg-gray-800 text-4xl"
                        >
                          <Icon name="clarity:image-line" />
                        </div>
                      </div>
                      <p class="mt-2.5 truncate">{{ person.name }}</p>
                      <p class="text-sm text-gray-400">
                        {{ person.character || person.known_for_department }}
                      </p>
                    </NuxtLink>
                  </CarouselItem>
                </template>
              </Carousel>
            </section>
          </div>
        </section>
      </main>
      <TheFooter />
    </div>
  </div>
</template>
