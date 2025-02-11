'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { useModal } from '~/hooks/use-modal-store'
import { ServerWithMembersWithProfiles } from '~/types'
import { ScrollArea } from '../ui/scroll-area'
import UserAvatar from '../layout/user-avatar/user-avatar'
import { ShieldAlert, ShieldCheck } from 'lucide-react'
import { MemberRole } from '@prisma/client'

const ROLE_ICON_MAP: Record<MemberRole, React.ReactNode> = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="size-4 text-indigo-500" />,
  ADMIN: <ShieldAlert className="size-4 text-rose-500" />,
}

const MembersModal = () => {
  const { isOpen, onClose, onOpen, type, data } = useModal()

  const { server } = data as { server: ServerWithMembersWithProfiles }

  const isModalOpen = isOpen && type === 'members'

  const handleClose = () => {
    onClose()
  }

  return (
    <div className="bg-pink-500">
      <Dialog open={isModalOpen} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="m-auto text-2xl">管理成员</DialogTitle>

            <DialogDescription className="text-center">
              {server?.members?.length} 位成员
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="mt-8 max-h-[420px] pr-6 font-mono">
            {server?.members?.map(member => (
              <main key={member.id} className="flex items-center gap-x-2 mb-6">
                <UserAvatar src={member.profile.imageUrl} />
                <section className="flex flex-col px-2">
                  <div className="flex gap-2 items-center">
                    <span>{member.profile.name}</span>
                    <span>{ROLE_ICON_MAP[member.role]}</span>
                  </div>

                  <p className="text-sm text-gray-400">
                    {member.profile.email}
                  </p>
                </section>
              </main>
            ))}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default MembersModal
