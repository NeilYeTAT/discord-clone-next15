'use client'

import { Member, MemberRole, Profile, Server } from '@prisma/client'
import { ShieldAlert, ShieldCheck } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { cn } from '~/lib/utils'
import UserAvatar from '../../user-avatar/user-avatar'

interface IServerMemberProps {
  member: Member & { profile: Profile }
  server: Server
}

const ROLE_ICON_MAP: Record<MemberRole, React.ReactNode> = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="size-4 mr-2 text-indigo-500" />,
  ADMIN: <ShieldAlert className="size-4 mr-2 text-rose-500" />,
}

const ServerMember = ({ member, server }: IServerMemberProps) => {
  const params = useParams()
  const router = useRouter()
  const icon = ROLE_ICON_MAP[member.role]

  const handleClick = () => {
    console.log(params?.serverId, member.id)
    router.push(`/servers/${params?.serverId}/conversations/${member.id}`)
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        'group p-2 rounded-md flex items-center w-full',
        params?.memberId === member.id && 'bg-zinc-700/20',
      )}
    >
      <UserAvatar src={member.profile.imageUrl} />
      {icon}
      <p
        className={cn(
          'font-mono text-sm',
          params?.memberId === member.id && 'text-purple-300',
        )}
      >
        {member.profile.name}
      </p>
    </button>
  )
}

export default ServerMember
