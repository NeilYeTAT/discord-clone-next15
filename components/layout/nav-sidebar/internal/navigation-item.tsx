'use client'

import { motion } from 'motion/react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import ActionTooltip from '~/components/ui/action-tooltip'

function NavigationItem({
  name,
  id,
  imageUrl,
}: {
  name: string
  imageUrl: string
  id?: string
}) {
  // * 获取之后点击跳转的链接地址~
  const params = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  return (
    <ActionTooltip
      side="right"
      align="center"
      label={name}
    >
      <button
        type="button"
        className="group flex items-center size-12 cursor-pointer rounded-3xl hover:rounded-xl transition-all mx-auto mb-2"
        onClick={() => {
          router.push(`/servers/${id}`)
        }}
      >
        <div
          className="relative group flex rounded-3xl transition-all overflow-hidden size-full items-center justify-center"
        >
          {/* 骨架屏加载效果~ */}
          {isLoading && (
            <span
              className="absolute inset-0 bg-gray-300 animate-pulse size-full transition-all"
            />
          )}

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
          && (
            <motion.span
              className="bg-slate-50 h-10 w-[3px] absolute rounded-full left-0"
              layoutId="white-line"
            />
          )}
        {params?.serverId === id
          && (
            <motion.span
              className="absolute left-2 rounded-full size-12 ring-4 ring-purple-800 ring-offset-1 animate-ye-ping-1.1 z-50"
              layoutId="highlight-bg"
            />
          )}
      </button>
    </ActionTooltip>
  )
}

export default NavigationItem
