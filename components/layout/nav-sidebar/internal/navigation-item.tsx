'use client'

import { AnimatePresence, motion } from 'motion/react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import ActionTooltip from '~/components/ui/action-tooltip'
import { cn } from '~/lib/utils'

function NavigationItem({
  name = 'null',
  id,
  imageUrl,
}: {
  name?: string
  imageUrl: string
  id?: string
}) {
  // * 获取之后点击跳转的链接地址~
  const params = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  return (
    <ActionTooltip side="right" align="center" label={name}>
      <button
        className="group flex items-center size-12 cursor-pointer rounded-3xl hover:rounded-xl transition-all mx-auto mb-2"
        onClick={() => {
          router.replace(`/servers/${id}`)
        }}
      >
        <div
          className={cn(
            'relative group flex rounded-3xl group-hover:rounded-2xl transition-all overflow-hidden size-full items-center justify-center',
            params?.serverId === id
            && 'bg-primary/10 text-primary rounded-2xl transition-all',
          )}
        >
          {/* 骨架屏加载效果~ */}
          <AnimatePresence>
            {isLoading && (
              <motion.div
                className="absolute inset-0 bg-gray-300 animate-pulse size-full transition-all"
                exit={{
                  opacity: 0,
                }}
              />
            )}
          </AnimatePresence>

          <Image
            src={imageUrl}
            alt="server image"
            unoptimized
            loading="lazy"
            fill
            onLoad={() => {
              setIsLoading(false)
            }}
          />
        </div>
        {params?.serverId === id
          ? (
              <motion.span
                className="bg-white h-10 w-1 absolute rounded-full left-0"
                layoutId="white-line"
              />
            )
          : null}
      </button>
    </ActionTooltip>
  )
}

export default NavigationItem
