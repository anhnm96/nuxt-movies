import type { Media, MediaType, PageResult } from '../types'

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

export function getMediaList(
  type: MediaType,
  query: string,
  page: number,
): Promise<PageResult<Media>> {
  return fetchTMDB(`${type}/${query}`, { page })
}

/**
 * Get trending
 */
export function getTrending(media: string, page = 1) {
  return fetchTMDB(`trending/${media}/week`, { page })
}

export function getMedia(type: MediaType, id: string): Promise<Media> {
  return fetchTMDB(`${type}/${id}`, {
    append_to_response:
      'videos,credits,images,external_ids,release_dates,combined_credits',
    include_image_language: 'en',
  })
}

/**
 * Get recommended
 */
export function getRecommendations(
  type: MediaType,
  id: string,
  page = 1,
): Promise<PageResult<Media>> {
  return fetchTMDB(`${type}/${id}/recommendations`, { page })
}
