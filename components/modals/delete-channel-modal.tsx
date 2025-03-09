'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { deleteChannel } from '~/actions/channels'
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

function DeleteChannelModal() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const {
    isOpen,
    onClose,
    type,
    data: { server, channel },
  } = useModal()

  const isModalOpen = isOpen && type === 'deleteChannel'

  const handleDeleteChannel = async () => {
    try {
      setIsLoading(true)

      const response = await deleteChannel({
        serverId: server?.id ?? '',
        channelId: channel?.id ?? '',
      })

      if (!response.success) {
        console.error('出错了', response.error)
        return
      }

      onClose()
      // * 妈的, 这里要先跳转再刷新
      router.push(`/servers/${server?.id}`)
      router.refresh()
    }
    catch (error) {
      console.error('删除频道出错, 爱来自 delete-channel-modal 😘', error)
    }
    finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="m-auto text-2xl">删除频道</DialogTitle>
          <DialogDescription>
            确定要删除
            {' '}
            <span className="font-semibold text-indigo-500">
              #
              {channel?.name}
            </span>
            {' '}
            频道吗🥹?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex items-center">
          <Button disabled={isLoading} onClick={handleDeleteChannel}>
            确定
          </Button>
          <Button disabled={isLoading} variant="ghost" onClick={onClose}>
            取消
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteChannelModal
