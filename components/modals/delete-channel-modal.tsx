'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { useModal } from '~/hooks/use-modal-store'
import { Button } from '../ui/button'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import qs from 'query-string'

const DeleteChannelModal = () => {
  const router = useRouter()

  const { isOpen, onClose, onOpen, type, data } = useModal()
  const { server, channel } = data
  const isModalOpen = isOpen && type === 'deleteChannel'
  const [isLoading, setIsLoading] = useState(false)

  const handleDeleteChannel = async () => {
    try {
      setIsLoading(true)
      const url = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}`,
        query: {
          serverId: server?.id,
        },
      })

      await axios.delete(url)

      onClose()
      // * 妈的, 这里要先跳转再刷新
      router.push(`/servers/${server?.id}`)
      router.refresh()
    } catch (error) {
      console.warn('delete channel modal error', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-pink-500">
      <Dialog open={isModalOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="m-auto text-2xl">删除频道</DialogTitle>
            <DialogDescription>
              确定要删除{' '}
              <span className="font-semibold text-indigo-500">
                #{channel?.name}
              </span>{' '}
              频道喵🥹?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex items-center">
            <Button
              disabled={isLoading}
              variant={'default'}
              onClick={handleDeleteChannel}
            >
              确定
            </Button>
            <Button disabled={isLoading} variant={'ghost'} onClick={onClose}>
              取消
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default DeleteChannelModal
