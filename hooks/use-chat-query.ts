import { useInfiniteQuery } from '@tanstack/react-query'
import qs from 'query-string'
import { useSocket } from '~/lib/socket-context'
// import { useSocket } from '~/components/providers/socket-provider'

interface ChatQueryProps {
  queryKey: string
  apiUrl: string
  paramKey: 'channelId' | 'conversationId'
  paramValue: string
}

export function useChatQuery({
  queryKey,
  apiUrl,
  paramKey,
  paramValue,
}: ChatQueryProps) {
  const { isConnected } = useSocket()

  const fetchMessages = async ({ pageParam = undefined }) => {
    const url = qs.stringifyUrl(
      {
        url: apiUrl,
        query: {
          cursor: pageParam,
          [paramKey]: paramValue,
        },
      },
      { skipNull: true },
    )

    const res = await fetch(url)
    return res.json()
  }

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isSuccess,
    isError,
  }
    // * 我也不想 any 🥹🥹, 马上去学校了, 我想在家多看看风景, 之后回学校会统一修复的
    = useInfiniteQuery({
      queryKey: [queryKey],
      queryFn: fetchMessages,
      getNextPageParam: lastPage => lastPage?.nextCursor,
      // refetchInterval: isConnected ? false : 1000,
      // * 上面这种需要手动刷新再显示, 不确定是不是bug, 使用下面这种可以即时展示
      refetchInterval: 1000,
    } as any)

  return {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isSuccess,
    isError,
    isLoading,
  }
}
