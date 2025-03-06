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
import { deleteServer } from '~/actions/servers/delete-server'

const DeleteServerModal = () => {
  const router = useRouter()
  const {
    isOpen,
    onClose,
    type,
    data: { server },
  } = useModal()
  const isModalOpen = isOpen && type === 'deleteServer'
  const [isLoading, setIsLoading] = useState(false)

  const handleLeaveServer = async () => {
    try {
      setIsLoading(true)

      const response = await deleteServer(server?.id ?? '')

      if (!response.success) {
        console.error('出错了', response.error)
        return
      }

      onClose()
      router.refresh()
      router.push('/')
    } catch (error) {
      console.error('删除群组出错, 爱来自 delete-server-modal 😘', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="m-auto text-2xl">删除群组</DialogTitle>
          <DialogDescription>
            确定要删除{' '}
            <span className="font-semibold text-indigo-500">
              {server?.name}
            </span>{' '}
            群组吗🥹?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex items-center">
          <Button disabled={isLoading} onClick={handleLeaveServer}>
            确定
          </Button>
          <Button disabled={isLoading} variant={'ghost'} onClick={onClose}>
            取消
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteServerModal
