<script setup lang="ts">
import { useSearch } from '@/stores/search'

const route = useRoute()
const router = useRouter()
const searchStore = useSearch()

const query = ref(route.query.q)
const goToRoute = debounce(() => {
  if (query.value) {
    router.push({
      name: 'search',
      query: { q: query.value },
    })
  } else {
    router.push({
      path: searchStore.fromPage,
    })
  }
}, 500)

function goBack() {
  if (route.name === 'search') {
    router.push(searchStore.fromPage)
  }
  searchStore.toggleSearch(false)
}

function unFocus() {
  if (route.name !== 'search') {
    searchStore.toggleSearch(false)
  }
}
</script>

<template>
  <div class="fixed left-0 right-0 top-0 z-20 lg:left-[70px]">
    <form @submit.prevent>
      <label class="sr-only" for="search">Search</label>
      <div class="flex bg-neutral-800 text-white">
        <input
          id="search"
          v-model.trim="query"
          v-focus
          name="search"
          type="text"
          :placeholder="$t('Search placeholder')"
          class="wrapper w-full bg-transparent py-5 outline-none"
          @keyup="goToRoute"
          @blur="unFocus"
        />

        <button
          type="button"
          aria-label="Close"
          class="px-8 py-5"
          @click="goBack"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
            viewBox="0 0 15 15"
          >
            <g
              fill="none"
              stroke="#fff"
              stroke-linecap="round"
              stroke-miterlimit="10"
              stroke-width="1.5"
            >
              <path d="M.75.75l13.5 13.5M14.25.75L.75 14.25" />
            </g>
          </svg>
        </button>
      </div>
    </form>
  </div>
</template>
