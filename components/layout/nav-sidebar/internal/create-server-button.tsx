'use client'

import { Plus } from 'lucide-react'
import ActionTooltip from '~/components/ui/action-tooltip'
import { Separator } from '~/components/ui/separator'
import { useModal } from '~/hooks/use-modal-store'

function CreateServerButton() {
  const { onOpen } = useModal()

  return (
    // * 注意这里圆角属性不要使用 rounded-full, 不然过渡效果不明显~ 毕竟 full 的值是 9999px~
    <>
      <ActionTooltip side="right" align="center" label="创建群组">
        <button
          type="button"
          onClick={() => onOpen('createServer')}
          className="flex items-center justify-center
                  dark:bg-slate-50 bg-slate-700 size-12 rounded-3xl cursor-pointer
                    group overflow-hidden duration-300
                  hover:bg-slate-800 hover:rounded-2xl"
        >
          <Plus className="dark:text-slate-900 text-white group-hover:text-white dark:group-hover:text-black duration-300" />
        </button>
      </ActionTooltip>
      <Separator className="dark:bg-zinc-100 bg-black w-10 mx-auto mt-3" />
    </>
  )
}

export default CreateServerButton
