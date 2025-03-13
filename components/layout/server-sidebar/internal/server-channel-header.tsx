'use client'

import type { ChannelType } from '@prisma/client'
import type { ServerWithMembersWithProfiles } from '~/types'
import { MemberRole } from '@prisma/client'
import { Plus, Settings } from 'lucide-react'
import ActionTooltip from '~/components/ui/action-tooltip'
import { useModal } from '~/hooks/use-modal-store'

function ServerChannelHeader({
  label,
  sectionType,
  channelType,
  role,
  server,
}: {
  label: string
  role?: MemberRole
  sectionType: 'channels' | 'members'
  channelType?: ChannelType
  server?: ServerWithMembersWithProfiles
}) {
  const { onOpen } = useModal()

  return (
    <div className="flex items-center justify-between p-2 duration-300 rounded-md my-1">
      <h3 className="font-semibold text-slate-700 dark:text-slate-400">{label}</h3>
      {role !== MemberRole.GUEST && sectionType === 'channels' && (
        <ActionTooltip label="创建频道" side="top">
          <button type="button" onClick={() => onOpen('createChannel', { channelType })}>
            <Plus className="size-4 cursor-pointer" />
          </button>
        </ActionTooltip>
      )}

      {role === MemberRole.ADMIN && sectionType === 'members' && (
        <ActionTooltip label="管理成员" side="top">
          <button type="button" onClick={() => onOpen('manageMembers', { server })}>
            <Settings className="size-4" />
          </button>
        </ActionTooltip>
      )}
    </div>
  )
}

export default ServerChannelHeader
