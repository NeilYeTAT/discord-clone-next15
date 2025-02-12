import { redirect } from 'next/navigation'
import ChatHeader from '~/components/layout/chat/chat-header'
import { db } from '~/db'
import { getOrCreateConversation } from '~/lib/conversation'
import { currentProfile } from '~/lib/db/current-profile'

const MemberIdPage = async ({
  params,
}: {
  params: Promise<{ memberId: string; serverId: string }>
}) => {
  console.log('yessssssssss')
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
    <div className="">
      <ChatHeader
        imageUrl={otherMember.profile.imageUrl}
        name={otherMember.profile.name}
        serverId={serverId}
        type="conversation"
      />
    </div>
  )
}

export default MemberIdPage
