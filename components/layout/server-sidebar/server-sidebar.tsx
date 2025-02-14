import { ChannelType, MemberRole } from '@prisma/client'
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react'
import { redirect } from 'next/navigation'
import { db } from '~/db'
import { currentProfile } from '~/lib/db/current-profile'
import ServerHeader from './internal/server-header'
import ServerSearch from './internal/server-search'
import { ScrollArea } from '~/components/ui/scroll-area'
import ServerSection from './internal/server-section'
import ServerChannel from './internal/server-channel'
import ServerMember from './internal/server-member'
import { Separator } from '~/components/ui/separator'

type ISearchData = {
  label: string
  type: 'channel' | 'member'
  data:
    | {
        icon: React.ReactNode
        name: string
        id: string
      }[]
    | undefined
}[]

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

const ServerSidebar = async ({ serverId }: { serverId: string }) => {
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
          createdAt: 'asc',
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

  // * 我在服务器(群组)里的权限
  const myRole = server.members.find(
    member => member.profileId === profile.id,
  )?.role

  const searchData: ISearchData = [
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
  ]

  return (
    <section className="flex flex-col w-60 bg-gray-950/80">
      <ServerHeader server={server} role={myRole} />
      <ScrollArea className="px-2">
        {/* 搜索框展示的 modal 层 */}
        <ServerSearch searchData={searchData} />
        <Separator className="bg-slate-300" />
        {/* 频道列表渲染 */}
        {/* 这里必须使用 !! 两次取反, 因为如果为 0 值的话, 页面会直接渲染成 0 的!!!!!!! */}
        {!!textChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.TEXT}
              role={myRole}
              label="Text Channels"
            />

            {textChannels.map(channel => (
              <ServerChannel
                key={channel.id}
                channel={channel}
                role={myRole}
                server={server}
              />
            ))}
          </div>
        )}

        {!!audioChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.AUDIO}
              role={myRole}
              label="Voice Channels"
            />

            {audioChannels.map(channel => (
              <ServerChannel
                key={channel.id}
                channel={channel}
                role={myRole}
                server={server}
              />
            ))}
          </div>
        )}

        {!!videoChannels?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="channels"
              channelType={ChannelType.VIDEO}
              role={myRole}
              label="Video Channels"
            />

            {videoChannels.map(channel => (
              <ServerChannel
                key={channel.id}
                channel={channel}
                role={myRole}
                server={server}
              />
            ))}
          </div>
        )}

        {/* 渲染成员 */}
        {!!members?.length && (
          <div className="mb-2">
            <ServerSection
              sectionType="members"
              role={myRole}
              label="Members"
              server={server}
            />

            {members.map(member => (
              <ServerMember key={member.id} member={member} />
            ))}
          </div>
        )}
      </ScrollArea>
    </section>
  )
}

export default ServerSidebar
