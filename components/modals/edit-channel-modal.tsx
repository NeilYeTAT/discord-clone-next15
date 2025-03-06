'use client'

import { useForm } from 'react-hook-form'
import axios from 'axios'
import qs from 'query-string'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { Button } from '~/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { useRouter } from 'next/navigation'
import { useModal } from '~/hooks/use-modal-store'
import { ChannelType } from '@prisma/client'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'
import { useEffect, useState } from 'react'

const formSchema = z.object({
  channelName: z
    .string()
    .min(1, {
      message: '频道名不能为空~',
    })
    .refine(name => name !== 'general', {
      message: "不能使用 'general' 作为频道名!",
    }),
  type: z.nativeEnum(ChannelType),
})

const EditChannelModal = () => {
  const router = useRouter()

  const { isOpen, onClose, type, data } = useModal()
  const [isLoading, setIsLoading] = useState(false)

  const isModalOpen = isOpen && type === 'editChannel'
  const { channel, server } = data

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      channelName: '',
      type: channel?.type || ChannelType.TEXT,
    },
  })

  useEffect(() => {
    if (channel) {
      form.setValue('channelName', channel.name)
      form.setValue('type', channel.type)
    }
  }, [form, channel])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true)
      const url = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}`,
        query: {
          serverId: server?.id,
        },
      })
      await axios.patch(url, values)

      form.reset()
      router.refresh()
      onClose()
    } catch (error) {
      console.error('修改出错, 爱来自 edit-channel-modal 😘', error)
    } finally {
      setIsLoading(false)
    }
  }

  // ! 同样的问题, 在 创建频道的时候也会出现, 暂时先放着...
  const handleModalClose = () => {
    form.reset()
    onClose()
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="m-auto text-2xl">修改频道</DialogTitle>
        </DialogHeader>

        {/* 表单配置 */}
        <Form {...form}>
          {/* 当点击底部按扭时, 触发这个提交事件~ */}
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            {/* 输入框 */}
            <FormField
              control={form.control}
              disabled={isLoading}
              name="channelName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>频道名</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 创建频道的类型 */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>频道类型</FormLabel>
                  <Select
                    disabled={isLoading}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="请选择创建频道的类型" />
                      </SelectTrigger>
                    </FormControl>

                    <SelectContent>
                      {Object.values(ChannelType).map(t => (
                        <SelectItem key={t} value={t} className="capitalize">
                          {t.toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full" type="submit">
              保存修改
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default EditChannelModal
