import { ModeToggle } from '~/components/ui/mode-toggle'
import { Separator } from '~/components/ui/separator'
import CreateServerButton from './internal/create-server-button'
import NavigationScrollArea from './internal/navigation-scroll-area'
import UserButtonClient from './internal/user-button-client'

async function NavigationSidebar() {
  return (
    <aside className="h-screen flex flex-col items-center gap-2 py-2 flex-shrink-0 w-16">
      <CreateServerButton />
      <Separator className="bg-zinc-100 dark:bg-zinc-300 w-10 mx-auto" />
      {/* 这里滚动区域应该修改成跑马灯的哪个组件!!! */}
      <NavigationScrollArea />
      {/* 底部用户信息按扭和明暗切换按扭 */}
      <div className="absolute bottom-0 pb-3 mt-auto flex flex-col items-center gap-y-4">
        <ModeToggle className="rounded-full size-12" />
        <UserButtonClient
          appearance={{
            elements: {
              avatarBox: 'size-11',
            },
          }}
        />
      </div>
    </aside>
  )
}

export default NavigationSidebar
