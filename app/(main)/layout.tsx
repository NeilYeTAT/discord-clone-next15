import NavigationSidebar from '~/components/layout/nav-sidebar/navigation-sidebar'

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen flex gap-4">
      <NavigationSidebar />
      <div>{children}</div>
    </div>
  )
}

export default MainLayout
