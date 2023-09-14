import type { Media, MediaType, PageResult, Person } from '../types'

const apiBaseUrl = '/api'
export async function fetchTMDB<T>(
  url: string,
  params: Record<string, string | number | boolean | undefined> = {},
) {
  if (params.language == null) {
    const locale = useNuxtApp().$i18n.locale
    params.language = unref(locale)
  }

  const { data, error, ...args } = await useFetch<T>(url, {
    baseURL: `${apiBaseUrl}/tmdb`,
    params,
  })

  if (error.value)
    throw createError({
      ...error.value,
      statusMessage: `Could not fetch data from ${url}`,
    })

  return { data: data as Ref<T>, ...args }
}

export function getMediaList(type: MediaType, query: string, page: number) {
  return fetchTMDB<PageResult<Media>>(`${type}/${query}`, { page })
}

/**
 * Get trending
 */
export function getTrending(type: MediaType, page = 1) {
  return fetchTMDB<PageResult<Media>>(`trending/${type}/week`, { page })
}

export function getMedia(type: MediaType, id: string) {
  return fetchTMDB<Media>(`${type}/${id}`, {
    append_to_response:
      'videos,credits,images,external_ids,release_dates,combined_credits',
    include_image_language: 'en',
  })
}

/**
 * Get recommended
 */
export function getRecommendations(type: MediaType, id: string, page = 1) {
  return fetchTMDB<PageResult<Media>>(`${type}/${id}/recommendations`, { page })
}

/**
 * Get genre list
 */
export function getGenreList(media: string) {
  return fetchTMDB<{ genres: { name: string; id: number }[] }>(
    `genre/${media}/list`,
  ).then(({ data }) => data.value!.genres)
}

/**
 * Discover media by genre
 */
export function getMediaByGenre(media: string, genre: string, page = 1) {
  return fetchTMDB<PageResult<Media>>(`discover/${media}`, {
    with_genres: genre,
    page,
  })
}

/**
 * Search (searches movies, tv and people)
 */
export function searchShows(query: string, page = 1) {
  return fetchTMDB('search/multi', { query, page, include_adult: false })
}

/**
 * Get person (single)
 */
export function getPerson(id: string): Promise<Person> {
  return fetchTMDB(`person/${id}`, {
    append_to_response: 'images,combined_credits,external_ids',
    include_image_language: 'en',
  })
}
