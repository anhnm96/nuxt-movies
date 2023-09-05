<template>
  <Carousel
    class="relative overflow-hidden"
    items-class="w-[calc(100vw-16px)] scroll-p-[.9375rem] overflow-x-scroll whitespace-nowrap md:scroll-p-10 lg:w-[calc(100vw-86px)] xl:scroll-p-[3.125rem]"
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
    <template #default="scope">
      <slot name="default" v-bind="scope" />
    </template>
  </Carousel>
</template>
