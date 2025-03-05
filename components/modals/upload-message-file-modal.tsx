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
  FormMessage,
} from '~/components/ui/form'
import FileUpload from '../file-upload'
import { useRouter } from 'next/navigation'
import { useModal } from '~/hooks/use-modal-store'
import qs from 'query-string'

const formSchema = z.object({
  fileUrl: z.string().min(1, {
    message: '文件不能为空~',
  }),
})

// todo 该组件后序应该考虑修改, 一个是预览时不应该使用圆角, 其次就是现在不支持上传 file 文件, 暂时只能上传图片...
const MessageFileModal = () => {
  const router = useRouter()

  const { isOpen, onClose, type, data } = useModal()
  const { apiUrl = '', query } = data

  const isModalOpen = isOpen && type === 'uploadMessageFile'

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fileUrl: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query,
      })
      await axios.post(url, {
        ...values,
        content: values.fileUrl,
      })
      router.refresh()
      handleModalClose()
    } catch (error) {
      console.warn('文件消息出错, 爱来自 messages-file-modal 😘', error)
    }
  }

  const handleModalClose = () => {
    form.reset()
    onClose()
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
      <DialogContent className="max-w-fit">
        <DialogHeader>
          <DialogTitle className="m-auto text-2xl">添加附件</DialogTitle>
          <DialogDescription className="m-auto">
            发送文件到消息
          </DialogDescription>
        </DialogHeader>

        {/* 表单配置 */}
        <Form {...form}>
          {/* 当点击底部按扭时, 触发这个提交事件~ */}
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            {/* 上传文件组件~ */}
            <FormField
              control={form.control}
              name="fileUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <FileUpload
                      // * 支持图片, pdf, markdown
                      endpoint="messageFile"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full" type="submit">
              发送
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default MessageFileModal
