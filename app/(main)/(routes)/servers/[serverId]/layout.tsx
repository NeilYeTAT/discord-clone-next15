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
      // * nextjs 15, promise 获取动态路由参数~
      id: (await params).serverId,
      // * 确保本人在这个群组中~
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
      <main className="bg-slate-800 flex-1 flex-grow overflow-auto">
        {children}
      </main>
    </div>
  )
}

export default ServerIdLayout
