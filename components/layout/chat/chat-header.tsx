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
    <div className="px-3 flex items-center h-12 gap-2 border-b border-dashed z-50 backdrop-blur-3xl">
      {type === 'channel' && <Hash className="size-5" />}
      {type === 'conversation' && (
        <UserAvatar src={imageUrl} className="size-8 relative" />
      )}
      <p className="font-mono font-semibold">{name}</p>
      <div className="flex items-center">
        {type === 'conversation' && <ChatVideoButton />}
        <SocketIndicator />
      </div>
    </div>
  )
}

export default ChatHeader
