import { ChannelType } from '@prisma/client'
import { redirect } from 'next/navigation'
import { ScrollArea } from '~/components/ui/scroll-area'
import { CHANNEL_TYPE_ICON_MAP, ROLE_ICON_MAP } from '~/constants/icon-map'
import { db } from '~/db'
import { currentProfile } from '~/lib/db/current-profile'
import ServerChannel from './internal/server-channel'
import ServerChannelHeader from './internal/server-channel-header'
import ServerHeader from './internal/server-header'
import ServerMember from './internal/server-member'
import ServerSearch from './internal/server-search'

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

async function ServerSidebar({ serverId }: { serverId: string }) {
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

  // * 我在群组(群组)里的权限
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
    <section className="flex flex-col w-64 dark:border-x border-dashed border-x border-x-pink-500 dark:border-x-slate-500 bg-slate-100 dark:bg-black">
      <ServerHeader server={server} role={myRole} />
      {/* ScrollArea 源码中隐藏了滚动条的显示 */}
      <ScrollArea className="px-2 py-1">
        {/* 搜索框, 点击后展示 modal 层 */}
        <ServerSearch searchData={searchData} />
        {/* 频道列表渲染 */}
        {/* 这里必须使用 !! 两次取反, 因为如果为 0 值的话, 页面会直接渲染成 0 的!!!!!!! */}
        {!!textChannels?.length && (
          <div className="mb-2 mr-2 px-2">
            <ServerChannelHeader
              sectionType="channels"
              channelType={ChannelType.TEXT}
              role={myRole}
              label="聊天频道"
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
          <div className="mb-2 mr-2 px-2">
            <ServerChannelHeader
              sectionType="channels"
              channelType={ChannelType.AUDIO}
              role={myRole}
              label="语音房间"
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
          <div className="mb-2 mr-2 px-2">
            <ServerChannelHeader
              sectionType="channels"
              channelType={ChannelType.VIDEO}
              role={myRole}
              label="视频房间"
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
          <div className="mb-2 mr-2 px-2">
            <ServerChannelHeader
              sectionType="members"
              role={myRole}
              label="成员"
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
