'use client'

import { Search } from 'lucide-react'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~/components/ui/command'
import { DialogTitle } from '~/components/ui/dialog'

interface IServerSearchProps {
  searchData: {
    label: string
    type: 'channel' | 'member'
    data:
      | {
        icon: React.ReactNode
        name: string
        id: string
      }[]
      | undefined
  }[]
}

function ServerSearch({ searchData }: IServerSearchProps) {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const params = useParams()

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(open => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  const handleNavigation = ({
    id,
    type,
  }: {
    id: string
    type: 'channel' | 'member'
  }) => {
    setOpen(false)

    if (type === 'member') {
      return router.push(`/server/${params?.serverId}/conversations/${id}`)
    }

    if (type === 'channel') {
      return router.push(`/servers/${params?.serverId}/channels/${id}`)
    }
  }

  return (
    <>
      <button
        className="p-2 rounded-md flex items-center gap-2 w-full border-b border-dashed"
        onClick={() => setOpen(true)}
      >
        <Search className="size-4" />
        <p className="text-sm">搜索</p>
        <kbd
          className="pointer-events-none inline-flex h-6 select-none items-center px-2
                      gap-1 rounded border bg-muted font-mono text-[10px]
                      font-medium text-muted-foreground ml-auto"
        >
          <span className="text-2xl">⌘</span>
          {' '}
          <span className="text-lg">K</span>
        </kbd>
        <span />
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <DialogTitle>
          {/* 控制台报错, 必须添加这个...说是为了提高无障碍可访问性... */}
        </DialogTitle>
        <CommandInput placeholder="搜索成员或频道~" />

        <CommandList>
          <CommandEmpty>未找到🥺</CommandEmpty>

          {searchData.map(({ label, type, data }) => {
            if (!data?.length)
              return null

            return (
              <CommandGroup key={label} heading={label}>
                {data?.map(({ id, icon, name }) => (
                  <CommandItem
                    key={id}
                    // * onClick 不生效哦~
                    onSelect={() => handleNavigation({ id, type })}
                  >
                    {icon}
                    {name}
                  </CommandItem>
                ))}
              </CommandGroup>
            )
          })}
        </CommandList>
      </CommandDialog>
    </>
  )
}

export default ServerSearch
