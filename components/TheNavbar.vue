<script setup lang="ts">
import { useSearch } from '@/stores/search'

const searchStore = useSearch()
const navLinks = [
  { name: 'Home', icon: 'i-ph-house', url: '/' },
  { name: 'Movies', icon: 'i-ph-film-strip', url: '/movie' },
  { name: 'TV Shows', icon: 'i-ph-television-simple', url: '/tv' },
]
</script>

<template>
  <nav
    class="sticky bottom-0 z-20 row-start-2 bg-black lg:top-0 lg:row-start-auto lg:h-screen lg:border-r lg:border-gray-800"
  >
    <ul class="flex h-full lg:flex-col lg:justify-evenly">
      <li v-for="link in navLinks" :key="link.name" class="w-full">
        <NuxtLink
          v-slot="{ isActive }"
          :to="link.url"
          :aria-label="link.name"
          class="flex justify-center py-2 text-3xl lg:p-5"
        >
          <Icon
            :name="isActive ? `${link.icon}-fill` : link.icon"
            :class="[isActive && 'text-primary']"
          />
        </NuxtLink>
      </li>
      <li class="w-full">
        <button
          class="flex justify-center py-2 text-3xl lg:p-5"
          aria-label="Search"
          aria-haspopup="true"
          :aria-expanded="searchStore.searchOpen"
          @click="searchStore.toggleSearch(true)"
        >
          <Icon
            :name="
              searchStore.searchOpen
                ? `i-ph-magnifying-glass-fill`
                : 'i-ph-magnifying-glass'
            "
            :class="[searchStore.searchOpen && 'text-primary']"
          />
        </button>
      </li>
    </ul>
  </nav>
</template>
