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

const EmojiPicker = ({ onChange }: { onChange: (value: string) => void }) => {
  const { resolvedTheme } = useTheme()

  return (
    <div
      className="absolute top-8 right-8
                  flex justify-center items-center size-8  
                bg-gray-400 rounded-full"
    >
      <Popover>
        <PopoverTrigger>
          <Smile />
        </PopoverTrigger>
        <PopoverContent
          side="bottom"
          sideOffset={34}
          className="size-fit p-0 mr-4"
        >
          <Picker
            theme={resolvedTheme}
            data={data}
            onEmojiSelect={(emoji: any) => onChange(emoji.native)}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default EmojiPicker
