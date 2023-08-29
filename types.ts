export type MediaType = 'movie' | 'tv'

export interface Media {
  adult: boolean
  backdrop_path: string
  genre_ids: number[]
  id: string
  original_language: string
  original_title: string
  overview: string
  popularity: number
  poster_path: string
  release_date: string
  title: string
  name?: string
  video: boolean
  vote_average: number
  vote_count: number
  // details
  budget?: number
  homepage?: string
  genres?: Genre[]
  revenue?: number
  runtime?: number
  status?: string
  production_companies?: any[]
  videos?: {
    results: Video[]
  }
  credits?: {
    cast: Person[]
    crew: Person[]
  }
  images?: {
    backdrops: Image[]
    posters: Image[]
  }
}

export interface Image {
  aspect_ratio: number
  height: number
  iso_639_1: string
  file_path: string
  vote_average: number
  vote_count: number
  width: number
}

export interface Person {
  adult: boolean
  gender: number
  id: number
  known_for_department: string
  name: string
  original_name: string
  profile_path: string
  popularity: number
  cast_id: number
  character: string
  credit_id: string
  order: number
}

export interface Video {
  iso_639_1: string
  iso_3166_1: string
  name: string
  key: string
  site: string
  size: number
  type: string
  official: boolean
  published_at: string
  id: string
}

export interface Genre {
  id: number
  name: string
}

export interface PageResult<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}
