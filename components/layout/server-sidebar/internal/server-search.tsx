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
  data: {
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

const ServerSearch = ({ data }: IServerSearchProps) => {
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

  const handleClick = ({
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
        className="p-2 rounded-md flex items-center gap-2 w-full"
        onClick={() => setOpen(true)}
      >
        <Search className="size-4" />
        <p>Search</p>
        <kbd
          className="pointer-events-none inline-flex h-5 select-none items-center 
                      gap-1 rounded border bg-muted font-mono text-[10px] 
                      font-medium text-muted-foreground ml-auto px-[1.5]"
        >
          <span>CMD</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <DialogTitle>{/* 控制台报错, 必须添加这个... */}</DialogTitle>
        <CommandInput placeholder="搜索成员互频道" />

        <CommandList>
          <CommandEmpty>没有喵~</CommandEmpty>

          {data.map(({ label, type, data }) => {
            if (!data?.length) return null

            return (
              <CommandGroup key={label} heading={label}>
                {data?.map(({ id, icon, name }) => (
                  <CommandItem
                    key={id}
                    // * onClick 不生效哦~
                    onSelect={() => handleClick({ id, type })}
                  >
                    {icon}
                    <span>{name}</span>
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
