'use client'

import { Member, Profile } from '@prisma/client'
import { useParams, useRouter } from 'next/navigation'
import { cn } from '~/lib/utils'
import UserAvatar from '~/components/layout/user-avatar/user-avatar'
import { ROLE_ICON_MAP } from '~/constants/icon-map'
import { AnimatePresence, motion } from 'motion/react'

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
    <motion.button
      onClick={handleNavigation}
      className={cn(
        'relative group p-2 rounded-md flex items-center w-full gap-4 hover:bg-primary-foreground duration-300',
        params?.memberId === member.id && 'bg-primary-foreground',
      )}
      whileHover={{ scale: 1.05 }}
      transition={{ type: 'spring', stiffness: 300 }}
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
      <AnimatePresence>
        {params?.memberId === member.id && (
          <motion.span
            className="absolute top-0 left-0 size-full bg-white/10 rounded-md"
            layoutId="server-sidebar-primary-selected"
          />
        )}
      </AnimatePresence>
    </motion.button>
  )
}

export default ServerMember
