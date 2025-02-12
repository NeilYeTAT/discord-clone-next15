import { redirect } from 'next/navigation'
import ChatHeader from '~/components/layout/chat/chat-header'
import { db } from '~/db'
import { currentProfile } from '~/lib/db/current-profile'

const ChannelIdPage = async ({
  params,
}: {
  params: Promise<{ serverId: string; channelId: string }>
}) => {
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
    <div className="min-h-screen flex flex-col">
      <ChatHeader
        name={channel.name}
        serverId={channel.serverId}
        type="channel"
      />
    </div>
  )
}

export default ChannelIdPage
