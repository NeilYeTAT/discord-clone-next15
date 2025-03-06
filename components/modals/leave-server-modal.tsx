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
import { Button } from '~/components/ui/button'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { leaveServer } from '~/actions/servers/leave-server'

const LeaveServerModal = () => {
  const router = useRouter()
  const {
    isOpen,
    onClose,
    type,
    data: { server },
  } = useModal()
  const isModalOpen = isOpen && type === 'leaveServer'
  const [isLoading, setIsLoading] = useState(false)

  const handleLeaveServer = async () => {
    try {
      setIsLoading(true)

      await leaveServer(server?.id ?? '')

      onClose()
      router.refresh()
      router.push('/')
    } catch (error) {
      console.error('退出群组出错, 爱来自 leave-server-modal 😘', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="m-auto text-2xl">退出群组</DialogTitle>
          <DialogDescription>
            确定要退出
            <span className="font-semibold text-indigo-500">
              {` ${server?.name} `}
            </span>
            群组吗?
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

export default LeaveServerModal
