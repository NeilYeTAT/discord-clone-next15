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
import { useParams, useRouter } from 'next/navigation'
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
      message: "Channel name cannot be 'general'",
    }),
  type: z.nativeEnum(ChannelType),
})

const CreateChannelModal = () => {
  const router = useRouter()
  const params = useParams()

  const { isOpen, onClose, type, data } = useModal()
  const [isLoading, setIsLoading] = useState(false)

  const isModalOpen = isOpen && type === 'createChannel'
  const { channelType = ChannelType.TEXT } = data

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      channelName: '',
      type: channelType || ChannelType.TEXT,
    },
  })

  useEffect(() => {
    form.setValue('type', channelType)
  }, [channelType, form])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true)
      const url = qs.stringifyUrl({
        url: '/api/channels',
        query: {
          serverId: params?.serverId,
        },
      })
      await axios.post(url, values)

      form.reset()
      router.refresh()
      onClose()
    } catch (error) {
      console.warn(error, '创建频道错误~')
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    form.reset()
    onClose()
  }

  return (
    <div className="bg-pink-500">
      <Dialog open={isModalOpen} onOpenChange={handleClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="m-auto text-2xl">创建频道</DialogTitle>
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
                      <Input placeholder="想好取什么名字了喵~" {...field} />
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
                创建
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CreateChannelModal
