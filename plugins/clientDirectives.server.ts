export default defineNuxtPlugin((nuxtApp) => {
  const directiveNames = ['focus', 'trapFocus'] as const
  directiveNames.forEach((name) => nuxtApp.vueApp.directive(name, {}))
})
