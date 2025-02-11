import { ChannelType, MemberRole } from '@prisma/client'
import {
  AwardIcon,
  Hash,
  Mic,
  RollerCoaster,
  ShieldAlert,
  ShieldCheck,
  Video,
} from 'lucide-react'
import { redirect } from 'next/navigation'
import { db } from '~/db'
import { currentProfile } from '~/lib/db/current-profile'
import ServerHeader from './internal/server-header'
import ServerSearch from './internal/server-search'
import { ScrollArea } from '~/components/ui/scroll-area'

interface IServerSidebarProps {
  serverId: string
}

const CHANNEL_TYPE_ICON_MAP: Record<ChannelType, React.ReactNode> = {
  TEXT: <Hash className="mr-2 size-4" />,
  AUDIO: <Mic className="mr-2 size-4" />,
  VIDEO: <Video className="mr-2 size-4" />,
}
const ROLE_ICON_MAP: Record<MemberRole, React.ReactNode> = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="size-4 mr-2 text-indigo-500" />,
  ADMIN: <ShieldAlert className="size-4 mr-2 text-rose-500" />,
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
      <ScrollArea className="flex-1 px-3">
        <div>
          <ServerSearch
            data={[
              {
                label: 'Text Channel',
                type: 'channel',
                data: textChannels?.map(channel => ({
                  id: channel.id,
                  name: channel.name,
                  icon: CHANNEL_TYPE_ICON_MAP[channel.type],
                })),
              },

              {
                label: 'Voice Channel',
                type: 'channel',
                data: audioChannels?.map(channel => ({
                  id: channel.id,
                  name: channel.name,
                  icon: CHANNEL_TYPE_ICON_MAP[channel.type],
                })),
              },

              {
                label: 'Video Channel',
                type: 'channel',
                data: videoChannels?.map(channel => ({
                  id: channel.id,
                  name: channel.name,
                  icon: CHANNEL_TYPE_ICON_MAP[channel.type],
                })),
              },

              {
                label: 'Member',
                type: 'member',
                data: members?.map(member => ({
                  id: member.id,
                  name: member.profile.name,
                  icon: ROLE_ICON_MAP[member.role],
                })),
              },
            ]}
          />
        </div>
      </ScrollArea>
    </div>
  )
}

export default ServerSidebar
