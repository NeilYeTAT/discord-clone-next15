'use client'

import type { Member, Profile } from '@prisma/client'
import { zodResolver } from '@hookform/resolvers/zod'
import { MemberRole } from '@prisma/client'
import axios from 'axios'
import { Edit, FileIcon, Trash } from 'lucide-react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import qs from 'query-string'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { z } from 'zod'
import ActionTooltip from '~/components/ui/action-tooltip'
import { Button } from '~/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { ROLE_ICON_MAP } from '~/constants/icon-map'
import { useModal } from '~/hooks/use-modal-store'
import { cn } from '~/lib/utils'
import UserAvatar from '../../user-avatar/user-avatar'

interface IChatItemProps {
  id: string
  content: string
  member: Member & {
    profile: Profile
  }
  timestamp: string
  fileUrl: string | null
  deleted: boolean
  currentMember: Member
  isUpdated: boolean
  socketUrl: string
  socketQuery: Record<string, string>
}

const formSchema = z.object({
  content: z.string().min(1),
})

export function ChatItem({
  id,
  content,
  member,
  timestamp,
  fileUrl,
  deleted,
  currentMember,
  isUpdated,
  socketUrl,
  socketQuery,
}: IChatItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const { onOpen } = useModal()
  const params = useParams()
  const router = useRouter()

  const onMemberClick = () => {
    if (member.id === currentMember.id) {
      return
    }

    router.push(`/servers/${params?.serverId}/conversations/${member.id}`)
  }

  useEffect(() => {
    const handleKeyDown = (event: any) => {
      if (event.key === 'Escape' || event.keyCode === 27) {
        setIsEditing(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content,
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      })

      await axios.patch(url, values)

      form.reset()
      setIsEditing(false)
    }
    catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    form.reset({
      content,
    })
  }, [content])

  // ! 获取不了类型, url 中不存在后缀
  const fileType = fileUrl?.split('.').pop()
  const isPDF = fileType === 'pdf' && fileUrl
  const isImage = !isPDF && fileUrl

  const isAdmin = currentMember.role === MemberRole.ADMIN
  const isModerator = currentMember.role === MemberRole.MODERATOR
  const isOwner = currentMember.id === member.id
  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner)
  const canEditMessage = !deleted && isOwner && !fileUrl

  return (
    <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
      <div className="group flex gap-x-2 items-start w-full">
        <div
          onClick={onMemberClick}
          className="cursor-pointer hover:drop-shadow-md transition"
        >
          <UserAvatar src={member.profile.imageUrl} />
        </div>
        <div className="flex flex-col w-full">
          <div className="flex items-center gap-x-2">
            <div className="flex items-center">
              <p
                onClick={onMemberClick}
                className="font-semibold text-sm hover:underline cursor-pointer"
              >
                {member.profile.name}
              </p>
              <ActionTooltip label={member.role}>
                {ROLE_ICON_MAP[member.role]}
              </ActionTooltip>
            </div>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">
              {timestamp}
            </span>
          </div>
          <div className="relative">
            {isImage && (
              <>
                {isLoading && (
                  <div className="absolute top-2 rounded-lg bg-gray-300 animate-pulse size-48 z-10" />
                )}
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative aspect-square rounded-md mt-2 overflow-hidden border flex items-center bg-secondary h-48 w-48"
                >
                  <Image
                    src={fileUrl}
                    alt={content}
                    fill
                    className="object-cover"
                    onLoad={() => setIsLoading(false)}
                    unoptimized
                  />
                </a>
              </>
            )}
          </div>
          {isPDF && (
            <div className="relative flex items-center p-2 mt-2 rounded-md bg-background/10">
              <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline"
              >
                PDF
              </a>
            </div>
          )}
          {!fileUrl && !isEditing && (
            <p
              className={cn(
                'text-sm text-zinc-600 dark:text-zinc-300',
                deleted
                && 'italic text-zinc-500 dark:text-zinc-400 text-xs mt-1 line-through',
              )}
            >
              {content}
              {isUpdated && !deleted && (
                <span className="text-[10px] mx-2 text-zinc-500 dark:text-zinc-400">
                  (已编辑)
                </span>
              )}
            </p>
          )}
          {!fileUrl && isEditing && (
            <Form {...form}>
              <form
                className="flex items-center w-full gap-x-2 pt-2"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative w-full">
                          <Input
                            // disabled={isLoading}
                            className="p-2 bg-zinc-200/90 dark:bg-zinc-700/75 border-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-zinc-600 dark:text-zinc-200"
                            placeholder="Edited message"
                            {...field}
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button size="sm">保存</Button>
              </form>
              <span className="text-[10px] mt-1 text-zinc-400">
                <span className="text-primary font-mono font-semibold">
                  ESC
                </span>
                {' '}
                退出
                {' '}

                <span className="text-primary font-mono font-semibold">
                  Enter
                </span>
                {' '}
                保存
              </span>
            </Form>
          )}
        </div>
      </div>
      {canDeleteMessage && (
        <div className="hidden group-hover:flex items-center gap-x-2 absolute p-1 -top-2 right-5 bg-white dark:bg-zinc-800 border rounded-sm">
          {canEditMessage && (
            <ActionTooltip label="Edit">
              <Edit
                onClick={() => setIsEditing(true)}
                className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
              />
            </ActionTooltip>
          )}
          <ActionTooltip label="Delete">
            <Trash
              onClick={() =>
                onOpen('deleteMessage', {
                  apiUrl: `${socketUrl}/${id}`,
                  query: socketQuery,
                })}
              className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
            />
          </ActionTooltip>
        </div>
      )}
    </div>
  )
}
