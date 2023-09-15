<script setup lang="ts">
import type { MediaType } from '@/types'
import { TMDB_IMAGE_BASE } from '@/constants/images'

definePageMeta({
  key: (route) => route.fullPath,
  validate: ({ params }) => {
    return ['movie', 'tv'].includes(params.type as MediaType)
  },
})

const route = useRoute()
const type = (route.params.type as MediaType) || 'movie'
const id = route.params.id as string

const [item, recommendations] = await Promise.all([
  getMedia(type, id),
  getRecommendations(type, id),
])

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
    } else if (['facebook', 'twitter'].includes(id)) {
      link = `https://${id}.com/${value}`
    } else break

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

const releaseYear = computed(() => {
  const date = item.release_date ? item.release_date : item.first_air_date
  return date?.slice(0, 4)
})
useHead({
  title: `${item.name || item.title} (${releaseYear.value})`,
  meta: [
    { name: 'description', content: item.overview },
    {
      property: 'og:image',
      content: `${TMDB_IMAGE_BASE}/w370_and_h556_bestv2${item.poster_path}`,
    },
  ],
})
</script>

<template>
  <main>
    <MediaHero :item="item" />
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
      <div class="margin-section">
        <template v-if="tab === 'overview'">
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
                  <template v-if="releaseYear">
                    <li class="contents">
                      <p>Release Date</p>
                      <p>{{ releaseYear }}</p>
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
                      <NuxtLink
                        v-for="genre of item.genres"
                        :key="genre.id"
                        :to="`/genre/${genre.id}/${type}`"
                        class="rounded bg-gray-600/50 px-2 py-1 text-sm transition hover:bg-gray-600/70"
                      >
                        {{ genre.name }}
                      </NuxtLink>
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
          <MediaSection
            v-if="item.credits?.cast?.length"
            title="Cast"
            type="person"
            :items="item.credits.cast"
          />
        </template>
        <template v-if="tab === 'videos'">
          <div
            class="wrapper grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-5 lg:container"
          >
            <div
              v-for="i of item.videos?.results"
              :key="i.id"
              class="flex flex-col gap-2.5"
            >
              <div class="aspect-video">
                <img
                  class="w-full"
                  :src="`https://img.youtube.com/vi/${i.key}/mqdefault.jpg`"
                  :alt="i.name"
                />
              </div>
              <div class="flex grow flex-col justify-between">
                <p>{{ i.name }}</p>
                <p class="mt-1 text-sm text-gray-400">{{ i.type }}</p>
              </div>
            </div>
          </div>
        </template>
        <template v-if="tab === 'photos'">
          <div class="wrapper lg:container">
            <section>
              <div class="flex items-baseline">
                <h2 class="text-lg md:text-xl lg:text-2xl xl:text-3xl">
                  Backdrops
                </h2>
                <span
                  class="ml-2.5 text-xs font-medium text-gray-400/90 md:text-sm xl:text-base"
                  >{{ item.images?.backdrops?.length }} Images</span
                >
              </div>
              <div
                class="mt-4 grid grid-cols-[repeat(auto-fit,_minmax(250px,_1fr))] gap-2 xl:mt-5"
              >
                <div v-for="i of item.images?.backdrops" :key="i.file_path">
                  <img
                    :src="`${TMDB_IMAGE_BASE}/w533_and_h300_bestv2${i.file_path}`"
                    alt="photo"
                  />
                </div>
              </div>
            </section>
            <section class="margin-section">
              <div class="flex items-baseline">
                <h2 class="text-lg md:text-xl lg:text-2xl xl:text-3xl">
                  Posters
                </h2>
                <span
                  class="ml-2.5 text-xs font-medium text-gray-400/90 md:text-sm xl:text-base"
                  >{{ item.images?.posters?.length }} Images</span
                >
              </div>
              <div
                class="mt-4 grid grid-cols-[repeat(auto-fit,_minmax(208px,_1fr))] gap-2 xl:mt-5"
              >
                <div v-for="i of item.images?.posters" :key="i.file_path">
                  <img
                    loading="lazy"
                    :src="`${TMDB_IMAGE_BASE}/w370_and_h556_bestv2${i.file_path}`"
                    alt="photo"
                  />
                </div>
              </div>
            </section>
          </div>
        </template>
      </div>
    </section>
    <!-- recommendations -->
    <MediaSection
      v-if="recommendations.results.length"
      title="More Like This"
      :type="type"
      :items="recommendations.results"
    />
  </main>
</template>
