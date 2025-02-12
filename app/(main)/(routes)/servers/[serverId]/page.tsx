import { redirect } from 'next/navigation'
import { db } from '~/db'
import { currentProfile } from '~/lib/db/current-profile'

// * 点击左侧服务器图片时, 默认来选中第一个 general 频道~
const ServerIdPage = async ({
  params,
}: {
  params: Promise<{
    serverId: string
  }>
}) => {
  const profile = await currentProfile()
  const serverId = (await params).serverId

  if (!profile) {
    return redirect('/')
  }

  const server = await db.server.findUnique({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      channels: {
        where: {
          name: 'general',
        },
        orderBy: {
          created: 'asc',
        },
      },
    },
  })

  const initialChannel = server?.channels[0]

  if (initialChannel?.name !== 'general') {
    return null
  }

  return redirect(`/servers/${serverId}/channels/${initialChannel.id}`)
}

export default ServerIdPage
