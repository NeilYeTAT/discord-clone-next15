import ActionTooltip from './action-tooltip'

interface IIconProps {
  Icon?: React.ElementType
}

const NavigationButton = ({ Icon }: IIconProps) => {
  return (
    // * 注意这里圆角属性不要使用 rounded-full, 不然过渡效果不明显~ 毕竟 full 的值是 9999px~
    <ActionTooltip side="right" align="center" label="add">
      <button
        className="size-12 bg-emerald-400 rounded-3xl flex items-center justify-center cursor-pointer overflow-hidden
                  hover:bg-purple-400 hover:rounded-2xl transition-all"
      >
        {Icon ? <Icon /> : <div>no icon~</div>}
      </button>
    </ActionTooltip>
  )
}

export default NavigationButton
