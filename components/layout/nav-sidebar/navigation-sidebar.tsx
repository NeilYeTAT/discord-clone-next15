import { redirect } from 'next/navigation'
import { db } from '~/db'
import { currentProfile } from '~/lib/db/current-profile'
import { ScrollArea } from '~/components/ui/scroll-area'
import CreateServerButton from './internal/create-server-button'
import { Separator } from '~/components/ui/separator'
import NavigationItem from './internal/navigation-item'
import { ModeToggle } from '~/components/ui/mode-toggle'
import { UserButton } from '@clerk/nextjs'

const NavigationSidebar = async () => {
  const profile = await currentProfile()

  if (!profile) {
    return redirect('/')
  }

  // * 找到加入的所有服务器(群聊)~
  const servers = await db.server.findMany({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  })

  return (
    <aside className="h-screen flex flex-col items-center gap-4 py-2 flex-shrink-0 w-16 bg-black">
      <CreateServerButton />
      <Separator className="bg-zinc-100 dark:bg-zinc-300 w-10 mx-auto" />
      <ScrollArea className="w-full">
        {servers.map(server => (
          <div key={server.id}>
            <NavigationItem
              id={server.id}
              name={server.name}
              imageUrl={server.imageUrl}
            />
          </div>
        ))}
      </ScrollArea>

      {/* 底部用户信息按扭和明暗切换按扭 */}
      <div className="absolute bottom-0 pb-3 mt-auto flex flex-col items-center gap-y-4">
        <ModeToggle className="rounded-full size-12" />
        {/* 去根布局的 layout.tsx 中配置, 视频中的写法已经不推荐~ */}
        <UserButton
          appearance={{
            elements: {
              // * 不知道为啥 size-12 大小不一样, 懒得探究了, 这里直接写 11, 肉眼看差不多
              avatarBox: 'size-11',
            },
          }}
        />
      </div>
    </aside>
  )
}

export default NavigationSidebar
