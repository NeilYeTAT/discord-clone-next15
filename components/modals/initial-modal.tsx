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
  DialogTrigger,
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

const formSchema = z.object({
  serverName: z.string().min(1, {
    message: '服务器名不能为空~',
  }),
  imageUrl: z.string().min(1, {
    message: '服务器图片不能为空~',
  }),
})

const InitialModal = () => {
  const router = useRouter()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      serverName: '',
      imageUrl: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post('/api/servers', values)
      form.reset()
      router.refresh()
      window.location.reload()
    } catch (error) {
      console.warn('初始化创建服务器出错, 爱来自 initial-modal 😘', error)
    }
  }

  return (
    <Dialog open>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="m-auto text-2xl">
            请创建你的服务器
          </DialogTitle>
          <DialogDescription className="m-auto">
            请给服务器创建名字和头像喵, 之后可以也可以再修改~
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
                  <FormLabel>服务器名</FormLabel>
                  <FormControl>
                    <Input placeholder="想好取什么名字了喵~" {...field} />
                  </FormControl>
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

export default InitialModal
