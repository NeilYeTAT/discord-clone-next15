'use client'

import { useParams } from 'next/navigation'
import ActionTooltip from '~/components/ui/action-tooltip'
import { cn } from '~/lib/utils'
import Image from 'next/image'
import { useState } from 'react'

const NavigationItem = ({
  name = 'null',
  id,
  imageUrl,
}: {
  name?: string
  imageUrl: string
  id?: string
}) => {
  // * 获取之后点击跳转的链接地址~
  const params = useParams()
  const [isLoading, setIsLoading] = useState(true)

  return (
    <ActionTooltip side="right" align="center" label={name}>
      <div className="group flex items-center size-12 cursor-pointer rounded-3xl hover:rounded-xl transition-all mx-auto mb-2">
        <div
          className={cn(
            'relative group flex rounded-3xl group-hover:rounded-2xl transition-all overflow-hidden size-full items-center justify-center',
            params?.serverId === id &&
              'bg-primary/10 text-primary rounded-2xl transition-all',
          )}
        >
          {/* 骨架屏加载效果~ */}
          {isLoading && (
            <div className="absolute inset-0 bg-gray-300 animate-pulse size-full" />
          )}

          {/* 如果图片不显示, 记得添加 unoptimized */}
          <Image
            src={imageUrl}
            alt="server image"
            unoptimized
            loading="lazy"
            fill
            onLoad={() => setIsLoading(true)}
          />
        </div>
      </div>
    </ActionTooltip>
  )
}

export default NavigationItem
