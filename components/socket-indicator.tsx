'use client'

import { useSocket } from '~/lib/socket-context'
import { Badge } from './ui/badge'

function SocketIndicator() {
  const { isConnected } = useSocket()

  return (
    <Badge
      variant="outline"
      className={isConnected ? 'bg-emerald-500' : 'bg-yellow-500'}
    >
      <span className="text-white">
        {isConnected ? <>已连接</> : <>断联中</>}
      </span>
    </Badge>
  )
}

export default SocketIndicator
