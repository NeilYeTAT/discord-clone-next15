import { redirect } from 'next/navigation'
import { db } from '~/db'
import { currentProfile } from '~/lib/db/current-profile'

const InviteCodePage = async ({
  params,
}: {
  params: Promise<{ inviteCode: string }>
}) => {
  const profile = await currentProfile()
  const inviteCode = (await params).inviteCode

  if (!profile || !inviteCode) {
    console.log('---------no profile or no invite code---------')
    return redirect('/')
  }

  const existingServer = await db.server.findFirst({
    where: {
      inviteCode,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  })

  if (existingServer) {
    console.log('~~~~~~~~~~~~~~~existing server~~~~~~~~~~~~')
    return redirect(`/servers/${existingServer.id}`)
  }

  const server = await db.server.update({
    where: {
      inviteCode,
    },
    data: {
      members: {
        create: [
          {
            profileId: profile.id,
          },
        ],
      },
    },
  })

  if (server) {
    return redirect(`/servers/${server.id}`)
  }

  return null
}

export default InviteCodePage
