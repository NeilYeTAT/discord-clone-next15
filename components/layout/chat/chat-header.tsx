import { Hash } from 'lucide-react'
import SocketIndicator from '~/components/socket-indicator'
import UserAvatar from '../user-avatar/user-avatar'
import { ChatVideoButton } from './internal/chat-video-button'

function ChatHeader({
  name,
  type,
  imageUrl,
}: {
  name: string
  type: 'channel' | 'conversation'
  imageUrl?: string
}) {
  return (
    <header className="fixed w-full z-50 px-3 flex items-center h-12 gap-2 border-b border-pink-500 dark:border-slate-500 border-dashed backdrop-blur-3xl">
      {type === 'channel' && <Hash className="size-5" />}
      {type === 'conversation' && (
        <UserAvatar src={imageUrl} className="size-8 relative" />
      )}
      <span className="font-mono font-semibold">{name}</span>
      <div className="flex items-center">
        {type === 'conversation' && <ChatVideoButton />}
        <SocketIndicator />
      </div>
    </header>
  )
}

export default ChatHeader
