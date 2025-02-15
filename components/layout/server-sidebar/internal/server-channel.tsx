'use client'

import { Channel, ChannelType, MemberRole, Server } from '@prisma/client'
import { Edit, Hash, Lock, Mic, Trash, Video } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import ActionTooltip from '~/components/ui/action-tooltip'
import { ModalType, useModal } from '~/hooks/use-modal-store'
import { cn } from '~/lib/utils'

interface IServerChannelProps {
  channel: Channel
  server: Server
  role?: MemberRole
}

const CHANNEL_TYPE_ICON_MAP: Record<ChannelType, React.ReactNode> = {
  TEXT: <Hash className="size-4" />,
  AUDIO: <Mic className="size-4" />,
  VIDEO: <Video className="size-4" />,
}

const ServerChannel = ({ channel, server, role }: IServerChannelProps) => {
  const params = useParams()
  const router = useRouter()
  const { onOpen } = useModal()

  const handleNavigation = () => {
    router.push(`/servers/${params?.serverId}/channels/${channel.id}`)
  }

  const onAction = (e: React.MouseEvent, action: ModalType) => {
    e.stopPropagation()
    onOpen(action, { channel, server })
  }

  return (
    <button
      onClick={handleNavigation}
      className={cn(
        'group px-2 py-[6px] rounded-md flex items-center w-full gap-1 cursor-pointer hover:bg-slate-800 duration-300 mb-1',
        params?.channelId === channel.id && 'bg-slate-800',
      )}
    >
      {CHANNEL_TYPE_ICON_MAP[channel.type]}
      <p>{channel.name}</p>
      {/* 管理员可以编辑频道 */}
      {channel.name !== 'general' && role !== MemberRole.GUEST && (
        // !!! hover bug, 暂时先放着, 去修理别的地方先~
        <div className="ml-auto hidden group-hover:flex gap-2">
          <ActionTooltip label="编辑">
            <Edit
              className="size-4"
              onClick={e => onAction(e, 'editChannel')}
            />
          </ActionTooltip>
          <ActionTooltip label="删除">
            <Trash
              className="size-4"
              onClick={e => onAction(e, 'deleteChannel')}
            />
          </ActionTooltip>
        </div>
      )}

      {channel.name === 'general' && <Lock className="ml-auto size-4" />}
    </button>
  )
}

export default ServerChannel
