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
import axios from 'axios'
import qs from 'query-string'

const DeleteMessageModal = () => {
  const { isOpen, onClose, onOpen, type, data } = useModal()
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
            <DialogTitle className="m-auto text-2xl">删除信息</DialogTitle>
            <DialogDescription>确定要删除 这条信息喵🥹?</DialogDescription>
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

export default DeleteMessageModal
