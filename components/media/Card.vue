<script setup lang="ts" generic="T">
import type { Media, MediaType, Person } from '@/types'
import { TMDB_IMAGE_BASE } from '@/constants/images'

defineProps<{
  item: T
  type: MediaType | 'person'
}>()
</script>

<template>
  <template v-if="instanceOf<Media>(item, 'overview')">
    <NuxtLink draggable="false" class="group" :to="`/${type}/${item.id}`">
      <div
        class="relative h-0 overflow-hidden pt-[150%] transition-transform duration-500 ease-in-out group-hover:scale-[1.03]"
      >
        <img
          v-lazyload
          class="lazy-img absolute left-0 top-0 block h-full w-full"
          :src="`${TMDB_IMAGE_BASE}/w370_and_h556_bestv2${item.poster_path}`"
          :alt="item.title || item.name"
          draggable="false"
          loading="lazy"
        />
      </div>
      <p class="mt-2.5 truncate">{{ item.title || item.name }}</p>
      <div class="flex items-baseline gap-1">
        <StarsRate class="w-[4.5rem]" :value="item.vote_average" />
        <p class="text-sm text-gray-400">
          {{ item.vote_average }}
        </p>
      </div>
    </NuxtLink>
  </template>
  <template v-if="instanceOf<Person>(item, 'gender')">
    <NuxtLink draggable="false" class="group" :to="`/person/${item.id}`">
      <div
        class="relative h-0 overflow-hidden pt-[150%] transition-transform duration-500 ease-in-out group-hover:scale-[1.03]"
      >
        <img
          v-if="item.profile_path"
          v-lazyload
          class="lazy-img absolute left-0 top-0 block h-full w-full"
          :src="`${TMDB_IMAGE_BASE}/w370_and_h556_bestv2${item.profile_path}`"
          :alt="item.name"
          draggable="false"
          loading="lazy"
        />
        <div
          v-else
          class="absolute left-0 top-0 grid h-full w-full place-items-center bg-gray-800 text-4xl"
        >
          <Icon name="clarity:image-line" />
        </div>
      </div>
      <p class="mt-2.5 truncate">{{ item.name }}</p>
      <p class="text-sm text-gray-400">
        {{ item.character || item.known_for_department }}
      </p>
    </NuxtLink>
  </template>
</template>
