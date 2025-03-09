import { Hash } from 'lucide-react'

function ChatWelcome({
  name,
  type,
}: {
  name: string
  type: 'channel' | 'conversation'
}) {
  return (
    <section className="space-y-2 px-4 mb-4">
      {type === 'channel' && (
        <div className="size-20 rounded-full bg-primary-foreground flex items-center justify-center">
          <Hash className="size-12 text-white" />
        </div>
      )}
      <p className="text-xl md:text-3xl font-bold font-mono">
        {type === 'channel' && '欢迎来到 #'}
        {name}
      </p>
      <p className="text-zinc-600 dark:text-zinc-400 text-sm">
        {type === 'channel'
          ? `开始在 #${name} 频道聊天吧~.`
          : `开始和 ${name} 聊天吧~`}
      </p>
    </section>
  )
}

export default ChatWelcome
