import { ScrollArea } from '~/components/ui/scroll-area'
import { db } from '~/db'
import { currentProfile } from '~/lib/db/current-profile'
import NavigationItem from './navigation-item'

async function NavigationScrollArea() {
  const profile = await currentProfile()

  if (!profile) {
    return
  }

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
    <ScrollArea className="w-full h-5/6 py-2">
      {servers?.map(server => (
        <NavigationItem
          key={server.id}
          id={server.id}
          name={server.name}
          imageUrl={server.imageUrl}
        />
      ))}
    </ScrollArea>
  )
}

export default NavigationScrollArea
