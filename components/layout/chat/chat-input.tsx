'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import axios from 'axios'
import { Plus } from 'lucide-react'
import { useRouter } from 'next/navigation'
import qs from 'query-string'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Button } from '~/components/ui/button'
import { Form, FormControl, FormField, FormItem } from '~/components/ui/form'
import { Input } from '~/components/ui/input'
import { useModal } from '~/hooks/use-modal-store'
import EmojiPicker from './internal/emoji-picker'

interface IChatInputProps {
  apiUrl: string
  query: Record<string, any>
  name: string
  type: 'conversation' | 'channel'
}

const formSchema = z.object({
  content: z.string().min(1),
})

function ChatInput({ apiUrl, name, query, type }: IChatInputProps) {
  const router = useRouter()
  const { onOpen } = useModal()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
    },
  })

  const isLoading = form.formState.isSubmitting

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: apiUrl,
        query,
      })

      await axios.post(url, values)
      form.reset()
      router.refresh()
    }
    catch (error) {
      console.error('chat input error', error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative p-4">
                  <Button
                    // * 必须使用 type
                    type="button"
                    onClick={() => {
                      onOpen('uploadMessageFile', { apiUrl, query })
                    }}
                    className="size-8 absolute top-8 left-8 bg-gray-400 rounded-full"
                  >
                    <Plus />
                  </Button>
                  <Input
                    {...field}
                    disabled={isLoading}
                    className="h-16 px-14"
                    placeholder={`给 ${
                      type === 'conversation' ? name : `#${name}`
                    } 发消息~`}
                  />
                  <EmojiPicker
                    onChange={(emoji: any) =>
                      field.onChange(`${field.value} ${emoji}`)}
                  />
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
}

export default ChatInput
