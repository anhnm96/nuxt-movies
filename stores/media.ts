import type { QueryClient } from '@tanstack/vue-query'
import { useQueries, useQuery, useQueryClient } from '@tanstack/vue-query'
import type { Media, MediaType, PageResult } from '@/types'

export function useTrending(type: MediaType) {
  const queryClient = useQueryClient()
  const result = useQuery({
    queryKey: [type, 'trending'],
    queryFn: async () => {
      const list = await getTrending(type)
      list.results.forEach((item) => {
        queryClient.setQueryData([type, item.id], item)
        queryClient.invalidateQueries({
          queryKey: [type, item.id],
          exact: true,
          refetchType: 'none',
        })
      })
      return list
    },
  })

  return result
}

export function useMedia(type: MediaType, id: string) {
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
      list.results.forEach((item) => {
        queryClient.setQueryData([type, item.id], item)
        queryClient.invalidateQueries({
          queryKey: [type, item.id],
          exact: true,
          refetchType: 'none',
        })
      })
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

export function useRecommendations(type: MediaType, id: string) {
  const result = useQuery({
    queryKey: [type, 'recommendations', id],
    queryFn: () => getRecommendations(type, id),
    select(data) {
      return data.results
    },
  })

  return result
}
