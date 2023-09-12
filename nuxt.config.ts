// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/i18n', '@vueuse/nuxt', 'nuxt-icon'],
  runtimeConfig: {
    tmdbApiKey: '',
  },
  i18n: {
    detectBrowserLanguage: {
      useCookie: true,
      fallbackLocale: 'en',
    },
    locales: [
      {
        code: 'en',
        name: 'English',
        file: 'en.json',
      },
    ],
    strategy: 'no_prefix',
    lazy: true,
    langDir: 'i18n',
    defaultLocale: 'en',
  },
})
