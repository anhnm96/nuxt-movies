<script setup lang="ts" generic="T extends Media | Person">
import type { Media, MediaType, Person } from 'types'

defineProps<{
  title: string
  type: MediaType | 'person'
  query?: string
  items: T[]
}>()
</script>

<template>
  <section class="margin-section">
    <div class="mx-[.9375rem] flex items-baseline md:mx-10 xl:mx-[3.125rem]">
      <h2 class="text-lg md:text-xl xl:text-2xl">{{ title }}</h2>
      <NuxtLink
        v-if="query"
        :to="`/${type}/category/${query}`"
        class="ml-2.5 text-xs font-medium text-primary transition-opacity hover:opacity-80 md:text-sm xl:text-base"
      >
        Explore All
      </NuxtLink>
    </div>
    <MediaList class="mt-4">
      <template v-for="item in items" :key="item.id">
        <CarouselItem
          class="inline-block w-[calc(33.33%-7.33326px)] snap-start pr-2 leading-relaxed first-of-type:ml-[.9375rem] last-of-type:mr-[.4375rem] sm:w-[calc(25%-18px)] md:first-of-type:ml-10 md:last-of-type:mr-8 lg:w-[calc(20%-14.4px)] xl:w-[calc(20%-18.4px)] xl:first-of-type:ml-[3.125rem] xl:last-of-type:mr-[2.625rem] 2xl:w-[calc(16.667%-15.33364px)]"
        >
          <MediaCard :item="item" :type="type" />
        </CarouselItem>
      </template>
    </MediaList>
  </section>
</template>
