import { redirect } from 'next/navigation'
import InitialModal from '~/components/modals/initial-modal'
import { db } from '~/db'
import { initialProfile } from '~/lib/db/initial-profile'

const SetupPage = async () => {
  const profile = await initialProfile()

  // * 查看用户是否有过服务器(群组), 有的话找到第一个然后显示~
  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  })

  // * 找到第一个服务器了, 重定向到那里去和小伙伴聊天吧~
  if (server) {
    console.log('re server')
    return redirect(`/servers/${server.id}`)
  }

  return <InitialModal />
}

export default SetupPage
