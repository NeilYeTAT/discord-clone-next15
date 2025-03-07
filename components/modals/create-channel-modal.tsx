'use client'

import { useForm } from 'react-hook-form'
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
import { createChannel } from '~/actions/channels'

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

const CreateChannelModal = () => {
  const router = useRouter()
  const params = useParams()
  const [isLoading, setIsLoading] = useState(false)
  const {
    isOpen,
    onClose,
    type,
    data: { channelType = ChannelType.TEXT },
  } = useModal()

  const isModalOpen = isOpen && type === 'createChannel'

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      channelName: '',
      type: channelType,
    },
  })

  useEffect(() => {
    form.setValue('type', channelType)
  }, [channelType, form])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true)

      const response = await createChannel({
        serverId: (params?.serverId as string) ?? '',
        ...values,
      })

      if (!response.success) {
        console.error('出错了', response.error)
        return
      }

      handleModalClose()
      router.refresh()
    } catch (error) {
      console.error(error, '创建频道错误~')
    } finally {
      setIsLoading(false)
    }
  }

  // ! 这里会导致报错..., 后序在处理这个报错问题...
  const handleModalClose = () => {
    form.reset()
    onClose()
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
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
                    <Input placeholder="想好取什么名字了吗~" {...field} />
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
  )
}

export default CreateChannelModal
