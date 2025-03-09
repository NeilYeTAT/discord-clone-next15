'use client'

import axios from 'axios'
import qs from 'query-string'
import { useState } from 'react'
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

function DeleteMessageModal() {
  const { isOpen, onClose, type, data } = useModal()
  const { apiUrl, query } = data
  const isModalOpen = isOpen && type === 'deleteMessage'
  const [isLoading, setIsLoading] = useState(false)

  const handleDeleteChannel = async () => {
    try {
      setIsLoading(true)
      const url = qs.stringifyUrl({
        url: apiUrl || '',
        query,
      })

      await axios.delete(url)

      onClose()
    }
    catch (error) {
      console.error('删除聊天信息出错, 爱来自 delete-message-modal 😘', error)
    }
    finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="m-auto text-2xl">删除信息</DialogTitle>
          <DialogDescription>确定要删除 这条信息吗🥹?</DialogDescription>
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

export default DeleteMessageModal
