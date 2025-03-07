'use client'

import { Member, Message, Profile } from '@prisma/client'
import ChatWelcome from './internal/chat-welcome'
import { useChatQuery } from '~/hooks/use-chat-query'
import { Divide, Loader2, ServerCrash } from 'lucide-react'
import { Fragment, useRef } from 'react'
import { ChatItem } from './internal/chat-item'
import { format } from 'date-fns'
import { useChatSocket } from '~/hooks/use-chat-socket'
import { Button } from '~/components/ui/button'
import { useChatScroll } from '~/hooks/use-chat-scroll'

interface IChatMessagesProps {
  name: string
  member: Member
  chatId: string
  apiUrl: string
  socketUrl: string
  socketQuery: Record<string, string>
  paramKey: 'channelId' | 'conversationId'
  paramValue: string
  type: 'channel' | 'conversation'
}

type IMessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile
  }
}

const DATE_FORMAT = 'd MMM yyyy, HH:mm'

const ChatMessages = ({
  apiUrl,
  chatId,
  member,
  name,
  paramKey,
  paramValue,
  socketQuery,
  socketUrl,
  type,
}: IChatMessagesProps) => {
  const queryKey = `chat:${chatId}`
  const addKey = `chat:${chatId}:messages`
  const updateKey = `chat:${chatId}:messages:update`

  const chatRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    isSuccess,
  } = useChatQuery({
    queryKey,
    apiUrl,
    paramKey,
    paramValue,
  })
  useChatSocket({ queryKey, addKey, updateKey })
  useChatScroll({
    chatRef,
    bottomRef,
    loadMore: fetchNextPage,
    shouldLoadMore: !isFetchingNextPage && !!hasNextPage,
    count: data?.pages?.[0].items?.length ?? 0,
  })

  if (isLoading) {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <Loader2 className="h-7 w-7 text-zinc-500 animate-spin my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          正在加载消息...
        </p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex flex-col flex-1 justify-center items-center">
        <ServerCrash className="h-7 w-7 text-zinc-500 my-4" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">出错了...</p>
      </div>
    )
  }

  return (
    <main ref={chatRef} className="flex-1 flex flex-col py-4 overflow-y-auto">
      {!hasNextPage && <div className="flex-1" />}
      {!hasNextPage && <ChatWelcome type={type} name={name} />}

      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="size-6" />
          ) : (
            <Button onClick={() => fetchNextPage()}>加载更多...</Button>
          )}
        </div>
      )}
      <div className="flex flex-col-reverse mt-auto">
        {data?.pages?.map((group, i) => (
          <Fragment key={i}>
            {group?.items?.map((message: IMessageWithMemberWithProfile) => (
              // <p key={message.id}>{message.content}</p>
              <ChatItem
                key={message.id}
                id={message.id}
                currentMember={member}
                member={message.member}
                content={message.content}
                fileUrl={message.fileUrl}
                deleted={message.deleted}
                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                isUpdated={message.updatedAt !== message.createdAt}
                socketUrl={socketUrl}
                socketQuery={socketQuery}
              />
            ))}
          </Fragment>
        ))}
      </div>
      <div ref={bottomRef} />
    </main>
  )
}

export default ChatMessages
