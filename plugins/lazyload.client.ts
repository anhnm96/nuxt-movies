function finishLoading(el: HTMLElement) {
  el.parentElement!.classList.remove('lazy-img-wrapper')
  el.parentElement!.classList.add('loaded')
}

function load(e: Event) {
  finishLoading(e.target as HTMLElement)
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('lazyload', {
    mounted(el: HTMLElement) {
      if (el.complete) return finishLoading(el)
      el.parentElement!.classList.remove('loaded')
      el.parentElement!.classList.add('lazy-img-wrapper')

      el.addEventListener('load', load)
    },
    beforeUpdate(el: HTMLImageElement) {
      if (el.complete) {
        finishLoading(el)
      }
    },
    beforeUnmount(el: HTMLElement) {
      el.removeEventListener('load', load)
    },
  })
})
