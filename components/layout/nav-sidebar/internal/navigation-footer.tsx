import { ModeToggle } from '~/components/ui/mode-toggle'
import UserButtonClient from './user-button-client'

export default function NavigationFooter() {
  return (
    <footer className="absolute bottom-0 p-2 flex flex-col items-center gap-3">
      <ModeToggle className="rounded-full size-12" />
      <UserButtonClient
        appearance={{
          elements: {
            avatarBox: 'size-11',
          },
        }}
      />
    </footer>
  )
}
