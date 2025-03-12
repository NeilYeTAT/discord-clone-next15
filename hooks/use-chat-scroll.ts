import { useEffect, useState } from 'react'

export function useChatScroll({
  chatRef,
  bottomRef,
  shouldLoadMore,
  loadMore,
  count,
}: {
  chatRef: React.RefObject<HTMLDivElement>
  bottomRef: React.RefObject<HTMLDivElement>
  shouldLoadMore: boolean
  loadMore: () => void
  count: number
}) {
  const [hasInitialized, setHasInitialized] = useState(false)

  useEffect(() => {
    const topDiv = chatRef?.current

    const handleScroll = () => {
      const scrollTop = topDiv?.scrollTop

      if (scrollTop === 0 && shouldLoadMore) {
        loadMore()
      }
    }

    topDiv?.addEventListener('scroll', handleScroll)

    return () => {
      topDiv?.removeEventListener('scroll', handleScroll)
    }
  }, [shouldLoadMore, loadMore, chatRef])

  useEffect(() => {
    const bottomDiv = bottomRef?.current
    const topDiv = chatRef.current
    const shouldAutoScroll = () => {
      if (!hasInitialized && bottomDiv) {
        setHasInitialized(true)
        return true
      }

      if (!topDiv) {
        return false
      }

      const distanceFromBottom
        = topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight
      return distanceFromBottom <= 100
    }

    let timer: NodeJS.Timeout

    if (shouldAutoScroll()) {
      timer = setTimeout(() => {
        bottomRef.current?.scrollIntoView({
          behavior: 'smooth',
        })
      }, 100)
    }

    return () => {
      clearTimeout(timer)
    }
  }, [bottomRef, chatRef, count, hasInitialized])
}
