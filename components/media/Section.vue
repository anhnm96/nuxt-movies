<script setup lang="ts" generic="T extends Media | Person">
import type { Media, MediaType, Person } from '@/types'

withDefaults(
  defineProps<{
    title: string
    type: MediaType | 'person'
    query?: string
    items?: T[]
    loading?: boolean
  }>(),
  {
    items: () => [],
  },
)
</script>

<template>
  <section class="margin-section">
    <template v-if="loading">
      <div class="mx-[.9375rem] md:mx-10 xl:mx-[3.125rem]">
        <Skeleton class="w-56">
          <h2 class="text-lg md:text-xl xl:text-2xl">&nbsp;</h2>
        </Skeleton>
        <div class="mt-4 grid grid-flow-col gap-2">
          <div
            v-for="i in 7"
            :key="i"
            :class="[
              i === 4 && 'hidden sm:block',
              i === 5 && 'hidden lg:block',
              i === 6 && 'hidden xl:block',
              i === 7 && 'hidden 2xl:block',
            ]"
          >
            <div class="relative pt-[150%]">
              <Skeleton class="absolute left-0 top-0 h-full w-full" />
            </div>
            <Skeleton class="mt-2.5">&nbsp;</Skeleton>
            <Skeleton v-if="type !== 'person'" class="mt-1 h-4 w-20" />
          </div>
        </div>
      </div>
    </template>
    <template v-else-if="items.length">
      <div class="mx-[.9375rem] flex items-baseline md:mx-10 xl:mx-[3.125rem]">
        <h2 class="text-lg md:text-xl xl:text-2xl">{{ title }}</h2>
        <NuxtLink
          v-if="query"
          :to="`/${type}/category/${query}`"
          class="ml-2.5 text-xs font-medium text-primary transition-opacity hover:opacity-80 md:text-sm xl:text-base"
        >
          {{ $t('Explore more') }}
        </NuxtLink>
      </div>
      <MediaList class="mt-4">
        <template v-for="item in items" :key="item.id">
          <CarouselItem
            class="inline-block w-[calc(33.33%-7.33326px)] snap-start pr-2 leading-relaxed first-of-type:ml-[.9375rem] last-of-type:mr-[.4375rem] sm:w-[calc(25%-18px)] md:first-of-type:ml-10 md:last-of-type:mr-8 lg:w-[calc(20%-14.4px)] xl:w-[calc(20%-18.4px)] xl:first-of-type:ml-[3.125rem] xl:last-of-type:mr-[2.625rem] 2xl:w-[calc(16.667%-15.33364px)] min-[1800px]:w-[calc(14.286%-13.14312px)]"
          >
            <MediaCard :item="item" :type="type" />
          </CarouselItem>
        </template>
      </MediaList>
    </template>
  </section>
</template>
