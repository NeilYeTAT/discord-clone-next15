'use client'

import { useForm } from 'react-hook-form'
import axios from 'axios'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogContent,
  DialogDescription,
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
import FileUpload from '../file-upload'
import { useRouter } from 'next/navigation'
import { useModal } from '~/hooks/use-modal-store'
import { useEffect } from 'react'

const formSchema = z.object({
  serverName: z.string().min(1, {
    message: '群组名不能为空~',
  }),
  imageUrl: z.string().min(1, {
    message: '群组图片不能为空~',
  }),
})

const EditServerModal = () => {
  const router = useRouter()

  const { isOpen, onClose, type, data } = useModal()
  const isModalOpen = isOpen && type === 'editServer'
  const { server } = data

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serverName: '',
      imageUrl: '',
    },
  })

  // * 数据回显~
  useEffect(() => {
    if (server) {
      form.setValue('serverName', server.name)
      form.setValue('imageUrl', server.imageUrl)
    }
  }, [form, server])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/servers/${server?.id}`, values)
      handleModalClose()
      router.refresh()
    } catch (error) {
      console.warn('修改群组出错, 爱来自 edit-server-modal 😘', error)
    }
  }

  const handleModalClose = () => {
    form.reset()
    onClose()
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="m-auto text-2xl">请创建你的群组</DialogTitle>
          <DialogDescription className="m-auto">
            请给群组创建名字和头像, 之后可以也可以再修改~
          </DialogDescription>
        </DialogHeader>

        {/* 表单配置 */}
        <Form {...form}>
          {/* 当点击底部按扭时, 触发这个提交事件~ */}
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            {/* 上传文件组件~ */}
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem className="flex items-center justify-center flex-col">
                  <FormControl>
                    <FileUpload
                      endpoint="serverImage"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* 输入框 */}
            <FormField
              control={form.control}
              name="serverName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>群组名</FormLabel>
                  <FormControl>
                    <Input placeholder="想好取什么名字了吗~" {...field} />
                  </FormControl>
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

export default EditServerModal
