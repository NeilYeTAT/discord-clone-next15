import { redirect } from 'next/navigation'
import ChatHeader from '~/components/layout/chat/chat-header'
import ChatInput from '~/components/layout/chat/chat-input'
import ChatMessages from '~/components/layout/chat/chat-messages'
import { db } from '~/db'
import { getOrCreateConversation } from '~/lib/conversation'
import { currentProfile } from '~/lib/db/current-profile'
import { MediaRoom } from '~/components/media-room'

const MemberIdPage = async ({
  params,
  searchParams,
}: {
  params: Promise<{ memberId: string; serverId: string }>
  searchParams: { video: boolean }
}) => {
  const profile = await currentProfile()
  const serverId = (await params).serverId
  const memberId = (await params).memberId

  if (!profile) {
    return redirect('/')
  }

  const currentMember = await db.member.findFirst({
    where: {
      serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  })

  if (!currentMember) {
    return redirect('/')
  }

  const conversation = await getOrCreateConversation(currentMember.id, memberId)

  if (!conversation) {
    return redirect(`/servers/${serverId}`)
  }

  const { memberOne, memberTwo } = conversation

  // * 找到对话中 对面的人
  const otherMember = memberOne.profileId === profile.id ? memberTwo : memberOne

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <ChatHeader
        imageUrl={otherMember.profile.imageUrl}
        name={otherMember.profile.name}
        type="conversation"
      />
      {searchParams.video && (
        <MediaRoom chatId={conversation.id} video={true} audio={true} />
      )}
      {!searchParams.video && (
        <>
          <ChatMessages
            member={currentMember}
            name={otherMember.profile.name}
            chatId={conversation.id}
            type="conversation"
            apiUrl="/api/direct-messages"
            paramKey="conversationId"
            paramValue={conversation.id}
            socketUrl="/api/socket/direct-messages"
            socketQuery={{
              conversationId: conversation.id,
            }}
          />
          <ChatInput
            name={otherMember.profile.name}
            type="conversation"
            apiUrl="/api/socket/direct-messages"
            query={{
              conversationId: conversation.id,
            }}
          />
        </>
      )}
    </div>
  )
}

export default MemberIdPage
