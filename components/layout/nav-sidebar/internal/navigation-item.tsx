'use client'

import { useParams, useRouter } from 'next/navigation'
import ActionTooltip from './action-tooltip'
import { cn } from '~/lib/utils'
import { group } from 'console'
import Image from 'next/image'

interface INavButtonProps {
  name?: string
  imageUrl: string
  id?: string
}

const NavigationItem = ({ name = 'null', id, imageUrl }: INavButtonProps) => {
  // * 获取之后点击跳转的链接地址~
  const params = useParams()
  const router = useRouter()
  console.log(imageUrl, ' - url')

  return (
    <ActionTooltip side="right" align="center" label={name}>
      <button
        onClick={() => {
          router.push(`/servers/${id}`)
        }}
        className="group flex items-center size-12 cursor-pointer rounded-3xl hover:rounded-xl transition-all mx-auto"
      >
        {/* 选中以后的左侧小白条~ */}
        <div
          className={cn(
            'absolute left-0 bg-primary rounded-full transition-all w-1',
            params?.serverId !== id && 'group-hover:h-5',
            params?.serverId === id ? 'h-9' : 'h-2',
          )}
        />
        {/* 左侧一个个群组的按扭 */}
        <div
          className={cn(
            'relative group flex rounded-3xl group-hover:rounded-2xl transition-all overflow-hidden  bg-pink-400 size-full items-center justify-center',
            params?.serverId === id && 'bg-primary/10 text-primary rounded-2xl',
          )}
        >
          {/* 如果图片不显示, 记得添加 unoptimized */}
          <Image
            src={imageUrl}
            alt="如果图片不显示, 使用 unoptimized"
            unoptimized
            fill
          />
        </div>
      </button>
    </ActionTooltip>
  )
}

export default NavigationItem
