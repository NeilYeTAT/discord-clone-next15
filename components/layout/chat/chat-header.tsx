import { Hash } from 'lucide-react'
import UserAvatar from '../user-avatar/user-avatar'

interface IChatHeaderProps {
  serverId: string
  name: string
  type: 'channel' | 'conversation'
  imageUrl?: string
}

const ChatHeader = ({ name, serverId, type, imageUrl }: IChatHeaderProps) => {
  return (
    <div className="px-3 flex items-center h-12 border-b-2 gap-2">
      {type === 'channel' && <Hash className="size-5" />}
      {type === 'conversation' && (
        <UserAvatar src={imageUrl} className="size-8" />
      )}
      <p>{name}</p>
    </div>
  )
}

export default ChatHeader
