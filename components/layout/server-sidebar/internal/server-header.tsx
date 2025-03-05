'use client'

import { MemberRole } from '@prisma/client'
import { ServerWithMembersWithProfiles } from '~/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import {
  ChevronDown,
  LogOut,
  PlusCircle,
  Settings,
  Trash,
  UserPlus,
  Users,
} from 'lucide-react'
import { useModal } from '~/hooks/use-modal-store'

interface IServerHeaderProps {
  server: ServerWithMembersWithProfiles
  role?: MemberRole
}

const ServerHeader = ({ server, role }: IServerHeaderProps) => {
  const { onOpen } = useModal()

  const isAdmin = role === MemberRole.ADMIN
  const isModerator = isAdmin || role === MemberRole.MODERATOR

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex justify-between h-12 p-1 items-center border-b border-dashed flex-shrink-0">
          <div
            className="flex justify-between items-center w-full rounded-md px-2 h-full
                        duration-300 hover:bg-primary-foreground"
          >
            <span className="font-mono text-xl font-semibold">
              {server.name}
            </span>
            <ChevronDown className="size-5" />
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 font-medium space-y-[2px]">
        {/* 管理员可以拉人~ */}
        {isModerator && (
          <DropdownMenuItem onClick={() => onOpen('inviteServer', { server })}>
            邀请他人 <UserPlus className="size-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {/* 群主可以设置群组 */}
        {isAdmin && (
          <DropdownMenuItem onClick={() => onOpen('editServer', { server })}>
            群组设置 <Settings className="size-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {/* 群主可以管理成员, 踢人~ */}
        {isAdmin && (
          <DropdownMenuItem onClick={() => onOpen('manageMembers', { server })}>
            管理成员 <Users className="size-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {/* 创建频道 */}
        {isModerator && (
          <DropdownMenuItem onClick={() => onOpen('createChannel')}>
            创建频道 <PlusCircle className="size-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {/* 分隔符~ */}
        {isModerator && <DropdownMenuSeparator />}

        {isAdmin && (
          <DropdownMenuItem
            className="text-rose-500"
            onClick={() => onOpen('deleteServer', { server })}
          >
            删除群组 <Trash className="size-4 ml-auto" />
          </DropdownMenuItem>
        )}

        {!isAdmin && (
          <DropdownMenuItem
            className="text-rose-500"
            onClick={() => onOpen('leaveServer', { server })}
          >
            退出群组 <LogOut className="size-4 ml-auto" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ServerHeader
