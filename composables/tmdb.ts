import type { MediaType } from '../types'

const apiBaseUrl = '/api'
export async function fetchTMDB(
  url: string,
  params: Record<string, string | number | boolean | undefined> = {},
): Promise<any> {
  if (params.language == null) {
    const locale = useNuxtApp().$i18n.locale
    params.language = unref(locale)
  }

  return await $fetch(url, {
    baseURL: `${apiBaseUrl}/tmdb`,
    params,
  })
}

export function getMediaList(type: MediaType, query: string, page: number) {
  return fetchTMDB(`${type}/${query}`, { page })
}

/**
 * Get trending
 */
export function getTrending(media: string, page = 1) {
  return fetchTMDB(`trending/${media}/week`, { page })
}
