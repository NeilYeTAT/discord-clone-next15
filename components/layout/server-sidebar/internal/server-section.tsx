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
    <div className="flex items-center py-2 justify-between hover:bg-slate-400 duration-300">
      <p>{label}</p>
      {/* Text Channels */}
      {role !== MemberRole.GUEST && sectionType === 'channels' && (
        <ActionTooltip label="Create Channel" side="top">
          <button onClick={() => onOpen('createChannel')}>
            <Plus className="size-4" />
          </button>
        </ActionTooltip>
      )}

      {role === MemberRole.ADMIN && sectionType === 'members' && (
        <ActionTooltip label="Manage members" side="top">
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
