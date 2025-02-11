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

const DeleteModal = () => {
  const router = useRouter()
  const { isOpen, onClose, onOpen, type, data } = useModal()
  const { server } = data
  const isModalOpen = isOpen && type === 'deleteServer'
  const [isLoading, setIsLoading] = useState(false)

  const handleLeaveServer = async () => {
    try {
      setIsLoading(true)

      await axios.delete(`/api/servers/${server?.id}`)

      onClose()
      router.refresh()
      router.push('/')
    } catch (error) {
      console.warn('leave server modal error', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-pink-500">
      <Dialog open={isModalOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="m-auto text-2xl">删除服务器</DialogTitle>
            <DialogDescription>
              确定要删除{' '}
              <span className="font-semibold text-indigo-500">
                {server?.name}
              </span>{' '}
              服务器喵🥹?
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex items-center">
            <Button
              disabled={isLoading}
              variant={'default'}
              onClick={handleLeaveServer}
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

export default DeleteModal
