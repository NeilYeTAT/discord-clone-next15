import { ModeToggle } from '~/components/ui/mode-toggle'

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      受保护的页面, 登陆成功后才会展示~
      <ModeToggle />
      <div>{children}</div>
    </>
  )
}

export default MainLayout
