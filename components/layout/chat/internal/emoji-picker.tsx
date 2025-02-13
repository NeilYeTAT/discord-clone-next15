'use client'

import { Smile } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover'
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'
import { useTheme } from 'next-themes'

interface IEmojiPickerProps {
  onChange: (value: string) => void
}

const EmojiPicker = ({ onChange }: IEmojiPickerProps) => {
  const { resolvedTheme } = useTheme()
  return (
    <Popover>
      <PopoverTrigger>
        <Smile className="" />
      </PopoverTrigger>
      <PopoverContent side="right" sideOffset={20}>
        <Picker
          theme={resolvedTheme}
          data={data}
          onEmojiSelect={(emoji: any) => onChange(emoji.native)}
        />
      </PopoverContent>
    </Popover>
  )
}

export default EmojiPicker
