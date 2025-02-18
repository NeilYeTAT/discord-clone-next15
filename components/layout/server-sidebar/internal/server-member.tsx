'use client'

import { Member, Profile } from '@prisma/client'
import { useParams, useRouter } from 'next/navigation'
import { cn } from '~/lib/utils'
import UserAvatar from '~/components/layout/user-avatar/user-avatar'
import { ROLE_ICON_MAP } from '~/constants/icon-map'

const ServerMember = ({
  member,
}: {
  member: Member & { profile: Profile }
}) => {
  const params = useParams()
  const router = useRouter()

  const handleNavigation = () => {
    router.push(`/servers/${params?.serverId}/conversations/${member.id}`)
  }

  return (
    <button
      onClick={handleNavigation}
      className={cn(
        'group p-2 rounded-md flex items-center w-full gap-4 hover:bg-slate-800 duration-300',
        params?.memberId === member.id && 'bg-slate-800',
        // bg-zinc-700/20
      )}
    >
      <UserAvatar src={member.profile.imageUrl} />
      <p
        className={cn(
          'flex items-center font-mono text-sm justify-between w-full',
          params?.memberId === member.id && 'text-purple-500',
        )}
      >
        {member.profile.name}
        {ROLE_ICON_MAP[member.role]}
      </p>
    </button>
  )
}

export default ServerMember
