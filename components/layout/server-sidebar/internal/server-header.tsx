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
      <DropdownMenuTrigger className="focus:outline-none" asChild>
        <button
          className="w-full px-3 flex items-center h-12 border-neutral-200 justify-between
                    dark:border-neutral-800 border-b-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 
                      transition"
        >
          {server.name}
          <ChevronDown className="size-5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 text-xs font-medium space-y-[2px]">
        {/* 管理员可以拉人~ */}
        {isModerator && (
          <DropdownMenuItem onClick={() => onOpen('invite', { server })}>
            邀请他人 <UserPlus className="size-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {/* 群主可以设置服务器 */}
        {isAdmin && (
          <DropdownMenuItem onClick={() => onOpen('editServer', { server })}>
            服务器设置 <Settings className="size-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {/* 群主可以管理成员, 踢人~ */}
        {isAdmin && (
          <DropdownMenuItem>
            管理成员 <Users className="size-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {/* 创建频道 */}
        {isModerator && (
          <DropdownMenuItem>
            创建频道 <PlusCircle className="size-4 ml-auto" />
          </DropdownMenuItem>
        )}
        {/* 分隔符~ */}
        {isModerator && <DropdownMenuSeparator />}

        {isAdmin && (
          <DropdownMenuItem className="text-rose-500">
            删除频道 <Trash className="size-4 ml-auto" />
          </DropdownMenuItem>
        )}

        {!isAdmin && (
          <DropdownMenuItem className="text-rose-500">
            退出频道 <LogOut className="size-4 ml-auto" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ServerHeader
