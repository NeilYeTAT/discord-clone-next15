import CreateServerButton from './internal/create-server-button'
import NavigationScrollArea from './internal/navigation-scroll-area'
import NavigationFooter from './internal/navigation-footer'

async function NavigationSidebar() {
  return (
    <aside className="h-screen flex flex-col items-center py-2 w-16">
      <CreateServerButton />
      <NavigationScrollArea />
      {/* 底部用户信息按扭和明暗切换按扭 */}
      <NavigationFooter />
    </aside>
  )
}

export default NavigationSidebar
