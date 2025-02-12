import { redirect } from 'next/navigation'
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
    <div>
      <section className="w-60 fixed h-full z-20 bg-slate-600">
        <ServerSidebar serverId={server.id} />
      </section>
      <main className="h-full pl-60 w-full flex-grow">{children}</main>
    </div>
  )
}

export default ServerIdLayout
