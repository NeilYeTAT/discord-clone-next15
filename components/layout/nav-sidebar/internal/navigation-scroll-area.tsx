'use client'

import { useEffect, useState } from 'react'
import { ScrollArea } from '~/components/ui/scroll-area'
import NavigationItem from './navigation-item'
import Link from 'next/link'
import { motion } from 'motion/react'
import { useLocalStorageState } from 'ahooks'

type IServers = {
  id: string
  name: string
  imageUrl: string
  updatedAt: Date
  inviteCode: string
  profileId: string
  createdAt: Date
}

const NavigationScrollArea = ({ servers }: { servers: IServers[] }) => {
  const [localSelectedIndex, setLocalSelectedIndex] = useLocalStorageState<
    number | undefined
  >('local-selected-index', {
    defaultValue: 0,
  })
  const [selectedIndex, setSelectedIndex] = useState(() => {
    console.log('render in use state')
    if (localSelectedIndex) {
      return localSelectedIndex
    }
    return 0
  })

  useEffect(() => {
    console.log('Component mounted')

    return () => {
      console.log('Component unmounted')
    }
  }, [])

  return (
    <ScrollArea className="w-full h-4/5">
      {servers.map((server, i) => (
        <Link
          href={`/servers/${server.id}`}
          key={server.id}
          replace
          className="relative"
          onClick={() => {
            setSelectedIndex(i)
            setLocalSelectedIndex(i)
          }}
        >
          <NavigationItem
            id={server.id}
            name={server.name}
            imageUrl={server.imageUrl}
          />
          {selectedIndex === i ? (
            <motion.span
              key={server.id}
              className="bg-white absolute left-0 top-0 h-full w-1 rounded-r-full"
              layoutId="white-line"
            />
          ) : null}
        </Link>
      ))}
    </ScrollArea>
  )
}

export default NavigationScrollArea
