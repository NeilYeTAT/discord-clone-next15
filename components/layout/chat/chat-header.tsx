import { Hash } from 'lucide-react'

interface IChatHeaderProps {
  serverId: string
  name: string
  type: 'channel' | 'conversation'
  imageUrl?: string
}

const ChatHeader = ({ name, serverId, type, imageUrl }: IChatHeaderProps) => {
  return (
    <div className="px-3 flex items-center h-12 border-b-2">
      {type === 'channel' && <Hash className="size-5" />}
      <p>{name}</p>
    </div>
  )
}

export default ChatHeader
