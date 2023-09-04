<script setup lang="ts">
const navLinks = [
  { name: 'Home', icon: 'i-ph-house', url: '/' },
  { name: 'Movies', icon: 'i-ph-film-strip', url: '/movie' },
  { name: 'TV Shows', icon: 'i-ph-television-simple', url: '/tv' },
  { name: 'Search', icon: 'i-ph-magnifying-glass', url: '/search' },
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
          class="flex justify-center py-2 text-3xl lg:p-5"
        >
          <Icon
            :name="isActive ? `${link.icon}-fill` : link.icon"
            :class="[isActive && 'text-primary']"
          />
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
