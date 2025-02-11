import { ChannelType } from '@prisma/client'
import { AwardIcon, RollerCoaster } from 'lucide-react'
import { redirect } from 'next/navigation'
import { db } from '~/db'
import { currentProfile } from '~/lib/db/current-profile'
import ServerHeader from './internal/server-header'

interface IServerSidebarProps {
  serverId: string
}

const ServerSidebar = async ({ serverId }: IServerSidebarProps) => {
  const profile = await currentProfile()

  if (!profile) {
    return redirect('/')
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          created: 'asc',
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: 'asc',
        },
      },
    },
  })

  // * 纯聊天频道, discord 还支持语言频道, 视频频道~
  const textChannels = server?.channels.filter(
    channel => channel.type === ChannelType.TEXT,
  )
  const audioChannels = server?.channels.filter(
    channel => channel.type === ChannelType.AUDIO,
  )
  const videoChannels = server?.channels.filter(
    channel => channel.type === ChannelType.VIDEO,
  )
  const members = server?.members.filter(
    member => member.profileId !== profile.id,
  )

  if (!server) {
    return redirect('/')
  }

  // * 我在各个服务器(群组)里的权限
  const myRoles = server.members.find(
    member => member.profileId === profile.id,
  )?.role

  return (
    <div className="flex flex-col h-full">
      <ServerHeader server={server} role={myRoles} />
    </div>
  )
}

export default ServerSidebar
