'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import UserAvatar from '../layout/user-avatar/user-avatar'
import { ScrollArea } from '~/components/ui/scroll-area'
import {
  Check,
  Gavel,
  Loader2,
  MoreVertical,
  Shield,
  ShieldCheck,
  ShieldQuestion,
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'

import { useModal } from '~/hooks/use-modal-store'
import qs from 'query-string'
import { ServerWithMembersWithProfiles } from '~/types'
import { MemberRole } from '@prisma/client'
import { useState } from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { ROLE_ICON_MAP } from '~/constants/icon-map'

const ManageMembersModal = () => {
  const router = useRouter()
  const { isOpen, onClose, onOpen, type, data } = useModal()
  const [loadingId, setLoadingId] = useState('')

  const { server } = data as { server: ServerWithMembersWithProfiles }
  const isModalOpen = isOpen && type === 'members'

  const handleRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId)
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
        },
      })
      const response = await axios.patch(url, { role })

      router.refresh()

      onOpen('members', { server: response.data })
    } catch (error) {
      console.warn('管理成员出错, 爱来自 manage-members-modal 😘', error)
    } finally {
      setLoadingId('')
    }
  }

  const handleKick = async (memberId: string) => {
    try {
      setLoadingId(memberId)
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server?.id,
        },
      })

      const response = await axios.delete(url)

      router.refresh()
      onOpen('members', { server: response.data })
    } catch (error) {}
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
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

                <p className="text-sm text-gray-400">{member.profile.email}</p>
              </section>
              {/* 对其他人的操作~ */}
              {server.profileId !== member.profileId &&
                loadingId !== member.id && (
                  <div className="ml-auto">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVertical className="size-4" />
                      </DropdownMenuTrigger>

                      <DropdownMenuContent side="left">
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="flex items-center">
                            <ShieldQuestion className="size-4 mr-2" />
                            <span>Role</span>
                          </DropdownMenuSubTrigger>

                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuItem
                                onClick={() =>
                                  handleRoleChange(member.id, 'GUEST')
                                }
                              >
                                <Shield className="size-4 ml-2" />
                                GUEST
                                {member.role === 'GUEST' && (
                                  <Check className="size-4" />
                                )}
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() =>
                                  handleRoleChange(member.id, 'MODERATOR')
                                }
                              >
                                <ShieldCheck className="size-4 ml-2" />
                                Moderator
                                {member.role === 'MODERATOR' && (
                                  <Check className="size-4" />
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        {/* 分割 */}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleKick(member.id)}>
                          <Gavel className="size-4 ml-2" />
                          移出
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              {/*  */}
              {loadingId === member.id && (
                <Loader2 className="size-4 animate-spin ml-auto" />
              )}
            </main>
          ))}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default ManageMembersModal
