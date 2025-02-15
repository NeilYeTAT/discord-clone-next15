'use client'

import { useSocket } from './providers/socket-provider'
import { Badge } from './ui/badge'

const SocketIndicator = () => {
  const { isConnected } = useSocket()

  return (
    <Badge
      variant={'outline'}
      className={isConnected ? 'bg-emerald-400' : 'bg-yellow-400'}
    >
      {isConnected ? <>connected</> : <>disconnected</>}
    </Badge>
  )
}

export default SocketIndicator
