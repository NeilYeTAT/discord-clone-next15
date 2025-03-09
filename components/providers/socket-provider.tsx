'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { io as ClientIO } from 'socket.io-client'

interface SocketContextType {
  socket: any | null
  isConnected: boolean
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
})

export function useSocket() {
  return useContext(SocketContext)
}

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const socketInstance = new (ClientIO as any)(
      process.env.NEXT_PUBLIC_SITE_URL!,
      {
        path: '/api/socket/io',
        addTrailingSlash: false,
      },
    )

    socketInstance.on('connect', () => {
      console.log('✅ 已连接到 WebSocket 服务器')
      setIsConnected(true)
    })

    socketInstance.on('disconnect', () => {
      console.log('❌ 断开连接')
      setIsConnected(false)
    })

    setSocket(socketInstance)

    return () => {
      console.log('useEffect 清理~ 即将断开连接~')
      socketInstance.disconnect()
    }
  }, [])

  return (
    <SocketContext value={{ socket, isConnected }}>
      {children}
    </SocketContext>
  )
}
