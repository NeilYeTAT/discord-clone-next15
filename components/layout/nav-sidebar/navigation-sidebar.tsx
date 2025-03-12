import { ModeToggle } from '~/components/ui/mode-toggle'
import CreateServerButton from './internal/create-server-button'
import NavigationScrollArea from './internal/navigation-scroll-area'
import UserButtonClient from './internal/user-button-client'

async function NavigationSidebar() {
  return (
    <aside className="h-screen flex flex-col items-center py-2 flex-shrink-0 w-16">
      <CreateServerButton />
      <NavigationScrollArea />
      {/* 底部用户信息按扭和明暗切换按扭 */}
      <footer className="absolute bottom-0 p-2 flex flex-col items-center gap-2">
        <ModeToggle className="rounded-full size-12" />
        <UserButtonClient
          appearance={{
            elements: {
              avatarBox: 'size-11',
            },
          }}
        />
      </footer>
    </aside>
  )
}

export default NavigationSidebar
