'use client'

import { ChannelType, MemberRole } from '@prisma/client'
import { ServerWithMembersWithProfiles } from '~/types'
import ActionTooltip from '../../../ui/action-tooltip'
import { Plus, Settings } from 'lucide-react'
import { useModal } from '~/hooks/use-modal-store'

interface IServerSectionProps {
  label: string
  role?: MemberRole
  sectionType: 'channels' | 'members'
  channelType?: ChannelType
  server?: ServerWithMembersWithProfiles
}

const ServerSection = ({
  label,
  sectionType,
  channelType,
  role,
  server,
}: IServerSectionProps) => {
  const { onOpen } = useModal()

  return (
    <div className="flex items-center justify-between p-2 duration-300 rounded-md my-1">
      <h3 className="font-sans">{label}</h3>
      {role !== MemberRole.GUEST && sectionType === 'channels' && (
        <ActionTooltip label="创建频道" side="top">
          <button onClick={() => onOpen('createChannel', { channelType })}>
            <Plus className="size-4 cursor-pointer" />
          </button>
        </ActionTooltip>
      )}

      {role === MemberRole.ADMIN && sectionType === 'members' && (
        <ActionTooltip label="管理成员" side="top">
          {/* 别忘了传递 server 🤡🤡🤡 */}
          <button onClick={() => onOpen('members', { server })}>
            <Settings className="size-4" />
          </button>
        </ActionTooltip>
      )}
    </div>
  )
}

export default ServerSection
