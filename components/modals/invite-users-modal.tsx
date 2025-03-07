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
import { Button } from '~/components/ui/button'
import { Check, Copy, RefreshCw } from 'lucide-react'
import { useOrigin } from '~/hooks/use-origin'
import { useState } from 'react'
import { getInviteCode } from '~/actions/servers'
import { useCopyToClipboard, useThrottle } from '@uidotdev/usehooks'

const InviteUsersModal = () => {
  const origin = useOrigin()
  const {
    isOpen,
    onClose,
    onOpen,
    type,
    data: { server },
  } = useModal()
  const isModalOpen = isOpen && type === 'inviteServer'
  // * inviteCode 是数据库中给定的字段
  const inviteUrl = `${origin}/invite/${server?.inviteCode}`

  const [isLoading, setIsLoading] = useState(false)
  const [copiedText, copyToClipboard] = useCopyToClipboard()
  const hasCopiedText = copiedText === inviteUrl
  // * 节流, 等 3s 才可以重新生成
  const throttledIsLoading = useThrottle(isLoading, 3000)

  const generateNewLink = async () => {
    try {
      setIsLoading(true)

      const response = await getInviteCode(server?.id ?? '')

      if (!response.success) {
        console.error('出错了', response.error)
        return
      }

      onOpen('inviteServer', { server: response.data?.server })
    } catch (error) {
      console.error('获取邀请码失败：', error)
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

          <main className="flex items-center mt-2 gap-x-2">
            <Input value={inviteUrl} readOnly />
            <Button
              size="icon"
              onClick={() => copyToClipboard(inviteUrl)}
              disabled={isLoading}
            >
              {hasCopiedText ? (
                <Check className="size-4" />
              ) : (
                <Copy className="size-4" />
              )}
            </Button>
          </main>

          {/* 这里使用普通按扭是因为 shadcnUI 中 Button 无法控制鼠标禁用样式 */}
          <button
            onClick={generateNewLink}
            disabled={throttledIsLoading}
            className="flex text-xs mt-2 text-zinc-500 cursor-pointer underline
                        disabled:cursor-not-allowed disabled:text-zinc-600 transition-colors"
          >
            生成一个新的邀请链接~
            <RefreshCw className="size-4 ml-1" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default InviteUsersModal
