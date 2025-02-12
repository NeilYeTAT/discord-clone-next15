'use client'

import { useSocket } from './providers/socket-provider'
import { Badge } from './ui/badge'

const SocketIndicator = () => {
  const { isConnected } = useSocket()
  console.log(isConnected, 'is connected???')

  if (!isConnected) {
    return (
      <Badge variant={'outline'} className="bg-yellow-400">
        Disconnected
      </Badge>
    )
  }

  return (
    <Badge variant={'outline'} className="bg-emerald-400">
      Connected
    </Badge>
  )
}

export default SocketIndicator
