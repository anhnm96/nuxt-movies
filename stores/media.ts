import type { QueryClient } from '@tanstack/vue-query'
import { useQueries, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { Media, MediaType, PageResult } from '@/types'

export function updateMediaCache(
  list: PageResult<Media>,
  type: MediaType,
  queryClient: QueryClient,
) {
  list.results.forEach((item) => {
    queryClient.setQueryData([type, item.id], item)
    queryClient.invalidateQueries({
      queryKey: [type, item.id],
      exact: true,
      refetchType: 'none',
    })
  })
}

export function useTrending(type: MediaType, page = 1) {
  const queryClient = useQueryClient()
  const result = useQuery({
    queryKey: [type, 'trending', page],
    queryFn: async () => {
      const list = await getTrending(type, page)
      updateMediaCache(list, type, queryClient)
      const cachedTrending = queryClient.getQueryData([type, 'trending'])
      if (!cachedTrending) {
        queryClient.setQueryData([type, 'trending'], () => {
          return {
            pages: [list],
            pageParams: [1],
          }
        })
      }
      return list
    },
  })

  return result
}

export function useMedia(type: MediaType, id: number) {
  const result = useQuery({
    queryKey: [type, id],
    queryFn: () => getMedia(type, id),
  })

  return result
}

export function getMediaListConfig(
  queryClient: QueryClient,
  type: MediaType,
  query: string,
  page: number,
) {
  return {
    queryKey: [type, query, page],
    queryFn: async () => {
      const list = await getMediaList(type, query, page)
      updateMediaCache(list, type, queryClient)
      const cachedTrending = queryClient.getQueryData([type, query])
      if (!cachedTrending) {
        queryClient.setQueryData([type, query], () => {
          return {
            pages: [list],
            pageParams: [1],
          }
        })
      }
      return list
    },
  }
}
export function useMediaList(type: MediaType, query: string, page: number) {
  const queryClient = useQueryClient()
  const result = useQuery(getMediaListConfig(queryClient, type, query, page))

  return result
}

export function useMediaLists(arr: any[]) {
  const queryClient = useQueryClient()
  const result = useQueries({
    queries: arr.map((q) => {
      return {
        ...getMediaListConfig(queryClient, q.type, q.query, q.page),
        select(data: PageResult<Media>) {
          return data.results
        },
      }
    }),
  })

  return result
}

export function useRecommendations(type: MediaType, id: number) {
  const queryClient = useQueryClient()
  const result = useQuery({
    queryKey: [type, 'recommendations', id],
    queryFn: async () => {
      const list = await getRecommendations(type, id)
      updateMediaCache(list, type, queryClient)
      return list
    },
    select(data) {
      return data.results
    },
  })

  return result
}

export function userGenreList(type: MediaType) {
  const result = useQuery({
    queryKey: ['genres'],
    queryFn: () => getGenreList(type),
    staleTime: Number.POSITIVE_INFINITY,
  })

  return result
}
