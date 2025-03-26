import { ChannelType } from '@prisma/client'
import { redirect } from 'next/navigation'
import ChatHeader from '~/components/layout/chat/chat-header'
import ChatInput from '~/components/layout/chat/chat-input'
import ChatMessages from '~/components/layout/chat/chat-messages'
import { MediaRoom } from '~/components/media-room'
import { db } from '~/db'
import { currentProfile } from '~/lib/db/current-profile'

async function ChannelIdPage({
  params,
}: {
  params: Promise<{ serverId: string; channelId: string }>
}) {
  const profile = await currentProfile()
  const serverId = (await params).serverId
  const channelId = (await params).channelId

  if (!profile) {
    return redirect('/')
  }

  const channel = await db.channel.findUnique({
    where: {
      id: channelId,
    },
  })

  const member = await db.member.findFirst({
    where: {
      serverId,
      profileId: profile.id,
    },
  })

  if (!channel || !member) {
    return redirect('/')
  }

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <ChatHeader name={channel.name} type="channel" />
      <main className="mt-10 flex flex-col relative flex-1">
        {channel.type === ChannelType.TEXT && (
          <ChatMessages
            member={member}
            name={channel.name}
            chatId={channel.id}
            type="channel"
            apiUrl="/api/messages"
            socketUrl="/api/socket/messages"
            socketQuery={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
            paramKey="channelId"
            paramValue={channel.id}
          />
        )}

        {channel.type === ChannelType.AUDIO && (
          <div className="absolute bottom-0 w-full">
            <MediaRoom chatId={channel.id} video={false} audio />
          </div>
        )}
        {channel.type === ChannelType.VIDEO && (
          <div className="absolute bottom-0 w-full">
            <MediaRoom chatId={channel.id} video audio />
          </div>
        )}
      </main>
      {/* 固定底部输入框, 后序考虑固定定位 */}
      {channel.type === ChannelType.TEXT && (
        <ChatInput
          name={channel.name}
          type="channel"
          apiUrl="/api/socket/messages"
          query={{
            channelId: channel.id,
            serverId: channel.serverId,
          }}
        />
      )}
    </div>
  )
}

export default ChannelIdPage
