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
      'http://localhost:3000',
      {
        path: '/api/socket/io',
        transports: ['websocket'],
      },
    )

    socketInstance.on('connect', () => {
      setIsConnected(true)
    })

    socketInstance.on('disconnect', () => {
      setIsConnected(false)
    })

    setSocket(socketInstance)

    return () => {
      console.warn('断开连接')
      socketInstance.disconnect()
    }
  }, [])

  return (
    <SocketContext value={{ socket, isConnected }}>
      {children}
    </SocketContext>
  )
}
