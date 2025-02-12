'use client'

import { Channel, ChannelType, MemberRole, Server } from '@prisma/client'
import { Edit, Hash, Lock, Mic, Trash, Video } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import ActionTooltip from '~/components/ui/action-tooltip'
import { useModal } from '~/hooks/use-modal-store'
import { cn } from '~/lib/utils'

interface IServerChannelProps {
  channel: Channel
  server: Server
  role?: MemberRole
}

const CHANNEL_TYPE_ICON_MAP: Record<ChannelType, React.ReactNode> = {
  TEXT: <Hash className="mr-2 size-4" />,
  AUDIO: <Mic className="mr-2 size-4" />,
  VIDEO: <Video className="mr-2 size-4" />,
}

const ServerChannel = ({ channel, server, role }: IServerChannelProps) => {
  const params = useParams()
  const router = useRouter()
  const { onOpen } = useModal()

  const Icon = CHANNEL_TYPE_ICON_MAP[channel.type]

  return (
    <button
      onClick={() => {}}
      className={cn(
        'group p-2 rounded-md flex items-center w-full gap-2 bg-purple-700 z-10 cursor-pointer',
        params?.channelId === channel.id && 'bg-slate-300',
      )}
    >
      {Icon}
      <p>{channel.name}</p>
      {/* 管理员可以编辑频道 */}
      {channel.name !== 'general' && role !== MemberRole.GUEST && (
        <div className="ml-auto hidden group-hover:flex gap-2">
          <ActionTooltip label="Edit">
            <Edit className="size-4" />
          </ActionTooltip>
          <ActionTooltip label="Delete">
            <Trash
              className="size-4"
              onClick={() => onOpen('deleteChannel', { server, channel })}
            />
          </ActionTooltip>
        </div>
      )}

      {channel.name === 'general' && <Lock className="ml-auto size-4" />}
    </button>
  )
}

export default ServerChannel
