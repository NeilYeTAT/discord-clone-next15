import { redirect } from 'next/navigation'
import InitialModal from '~/components/modals/initial-modal'
import { db } from '~/db'
import { initialProfile } from '~/lib/db/initial-profile'

const SetupPage = async () => {
  const profile = await initialProfile()

  // * 查看用户是否有过群组(群组), 有的话找到第一个然后显示~
  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  })

  if (server) {
    return redirect(`/servers/${server.id}`)
  }

  return <InitialModal />
}

export default SetupPage
