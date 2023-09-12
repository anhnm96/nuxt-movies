<script setup>
const props = defineProps({
  error: Object,
})

const is404 = computed(
  () => props.error?.statusCode === 404 || props.error?.message.includes('404'),
)
const message = computed(() =>
  is404.value ? 'This page could not be found' : 'An error occurred',
)
useHead({
  title: message.value,
})
// eslint-disable-next-line n/prefer-global/process
const isDev = process.dev
</script>

<template>
  <div
    class="mx-auto flex h-screen max-w-md flex-col justify-center gap-4 text-center"
  >
    <div class="text-lg text-white xl:text-2xl">
      {{ message }}
    </div>
    <p class="text-lg text-gray-400/90">
      Looks like you've followed a broken link or entered a URL that doesn't
      exist on this site.
    </p>
    <pre v-if="isDev" class="text-left">{{ error }}</pre>
    <p class="text-lg">
      <span class="text-gray-400/90">Back to our&nbsp;</span>
      <NuxtLink to="/" class="text-white underline opacity-100"
        >home page</NuxtLink
      >
    </p>
  </div>
</template>
