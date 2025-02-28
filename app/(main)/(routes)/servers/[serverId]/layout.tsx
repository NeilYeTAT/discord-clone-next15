import { redirect } from 'next/navigation'
import NavigationSidebar from '~/components/layout/nav-sidebar/navigation-sidebar'
import ServerSidebar from '~/components/layout/server-sidebar/server-sidebar'
import { db } from '~/db'
import { currentProfile } from '~/lib/db/current-profile'

const ServerIdLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{
    serverId: string
  }>
}) => {
  const profile = await currentProfile()

  if (!profile) {
    return redirect('/sign-in')
  }

  const server = await db.server.findUnique({
    where: {
      id: (await params).serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  })

  if (!server) {
    return redirect('/')
  }

  return (
    <div className="flex h-screen">
      <NavigationSidebar />
      <ServerSidebar serverId={server.id} />
      {/* 聊天记录展示~ */}
      <main className="flex-1 flex-grow overflow-auto">{children}</main>
    </div>
  )
}

export default ServerIdLayout
