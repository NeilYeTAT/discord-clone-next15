'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { useModal } from '~/hooks/use-modal-store'
import { Label } from '~/components/ui/label'
import { Input } from '~/components/ui/input'
import { Button } from '../ui/button'
import { Check, Copy, RefreshCw } from 'lucide-react'
import { useOrigin } from '~/hooks/use-origin'
import { useState } from 'react'
import axios from 'axios'

const InviteUsersModal = () => {
  const origin = useOrigin()
  const { isOpen, onClose, onOpen, type, data } = useModal()

  const { server } = data

  const isModalOpen = isOpen && type === 'inviteServer'
  const inviteUrl = `${origin}/invite/${server?.inviteCode}`

  const [copied, setCopied] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 1000)
  }
  const generateNewLink = async () => {
    try {
      setIsLoading(true)
      const response = await axios.patch(
        `/api/servers/${server?.id}/inviteCode`,
      )
      onOpen('inviteServer', { server: response.data })
    } catch (error) {
      console.warn('生成邀请链接出错, 爱来自 invite-users-modal 😘', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="m-auto text-2xl">邀请朋友</DialogTitle>
        </DialogHeader>

        <div className="px-6 py-2">
          <Label className="text-xs font-bold text-zinc-300">邀请码</Label>

          <div className="flex items-center mt-2 gap-x-2">
            <Input value={inviteUrl} readOnly />
            <Button size="icon" onClick={handleCopy} disabled={isLoading}>
              {copied ? (
                <Check className="size-4" />
              ) : (
                <Copy className="size-4" />
              )}
            </Button>
          </div>

          <Button
            variant={'link'}
            onClick={generateNewLink}
            disabled={isLoading}
            size={'sm'}
            className="text-xs mt-2 text-zinc-500"
          >
            生成一个新的邀请链接~
            <RefreshCw className="size-4 ml-1" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default InviteUsersModal
