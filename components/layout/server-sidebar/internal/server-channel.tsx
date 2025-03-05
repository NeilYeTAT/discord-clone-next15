'use client'

import { Channel, MemberRole, Server } from '@prisma/client'
import { Edit, Lock, Trash } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useParams, useRouter } from 'next/navigation'
import ActionTooltip from '~/components/ui/action-tooltip'
import { CHANNEL_TYPE_ICON_MAP } from '~/constants/icon-map'
import { ModalType, useModal } from '~/hooks/use-modal-store'
import { cn } from '~/lib/utils'

const ServerChannel = ({
  channel,
  server,
  role,
}: {
  channel: Channel
  server: Server
  role?: MemberRole
}) => {
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
    <motion.button
      onClick={handleNavigation}
      className={cn(
        'relative group px-1 py-[6px] rounded-md flex items-center w-full gap-1 cursor-pointer duration-300 mb-1 hover:bg-primary-foreground',
        params?.channelId === channel.id && 'bg-primary-foreground',
      )}
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      {CHANNEL_TYPE_ICON_MAP[channel.type]}
      <p className="max-w-36 truncate text-left">{channel.name}</p>
      {/* 管理员可以编辑频道 */}
      {channel.name !== 'general' && role !== MemberRole.GUEST && (
        // !!! hover bug, 暂时先放着, 去修理别的地方先~
        <motion.div className="ml-auto group-hover:flex gap-2 hidden duration-300 z-50">
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
        </motion.div>
      )}

      {channel.name === 'general' && <Lock className="ml-auto size-4" />}
      <AnimatePresence>
        {params?.channelId === channel.id && (
          <motion.span
            className="absolute top-0 left-0 size-full bg-white/10 rounded-md"
            layoutId="server-sidebar-primary-selected"
          />
        )}
      </AnimatePresence>
    </motion.button>
  )
}

export default ServerChannel
