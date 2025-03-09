'use client'

import { useSocket } from './providers/socket-provider'
import { Badge } from './ui/badge'

function SocketIndicator() {
  const { isConnected } = useSocket()

  return (
    <Badge
      variant="outline"
      className={isConnected ? 'bg-emerald-500' : 'bg-yellow-500'}
    >
      {isConnected ? <>已连接</> : <>断联中</>}
    </Badge>
  )
}

export default SocketIndicator
