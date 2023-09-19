import { defineStore } from 'pinia'

export const useSearch = defineStore('search', () => {
  const searchOpen = ref(false)
  const fromPage = ref('/')

  function toggleSearch(state?: boolean) {
    if (state !== undefined) searchOpen.value = state
    else searchOpen.value = !searchOpen.value
  }

  function setFromPage(page: string) {
    fromPage.value = page
  }

  return { searchOpen, fromPage, toggleSearch, setFromPage }
})
