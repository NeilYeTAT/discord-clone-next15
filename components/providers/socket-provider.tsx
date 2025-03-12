// 'use client'

// import { createContext, useContext, useEffect, useState } from 'react'
// import { io as ClientIO } from 'socket.io-client'

// interface SocketContextType {
//   socket: any | null
//   isConnected: boolean
// }

// const SocketContext = createContext<SocketContextType>({
//   socket: null,
//   isConnected: false,
// })

// export function useSocket() {
//   return useContext(SocketContext)
// }

// export function SocketProvider({ children }: { children: React.ReactNode }) {
//   const [socket, setSocket] = useState(null)
//   const [isConnected, setIsConnected] = useState(false)

//   useEffect(() => {
//     const socketInstance = new (ClientIO as any)(
//       'http://localhost:3000',
//       {
//         path: '/api/socket/io',
//         transports: ['websocket'],
//       },
//     )

//     socketInstance.on('connect', () => {
//       setIsConnected(true)
//     })

//     socketInstance.on('disconnect', () => {
//       setIsConnected(false)
//     })

//     setSocket(socketInstance)

//     return () => {
//       console.warn('断开连接')
//       socketInstance.disconnect()
//     }
//   }, [])

//   return (
//     <SocketContext value={{ socket, isConnected }}>
//       {children}
//     </SocketContext>
//   )
// }

'use client'

import { useEffect, useMemo, useState } from 'react'
import { io as ClientIO } from 'socket.io-client'
import { SocketContext } from '~/lib/socket-context'
// import { SocketContext } from './socket-context' // ✅ 只引入 Context

export function SocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const socketInstance = new (ClientIO as any)('http://localhost:3000', {
      path: '/api/socket/io',
      addTrailingSlash: false,
    })

    socketInstance.on('connect', () => setIsConnected(true))
    socketInstance.on('disconnect', () => setIsConnected(false))

    setSocket(socketInstance)

    return () => {
      console.warn('断开连接')
      socketInstance.disconnect()
    }
  }, [])

  // ✅ 用 useMemo 避免每次渲染都重新创建对象
  const contextValue = useMemo(() => ({ socket, isConnected }), [socket, isConnected])

  return <SocketContext value={contextValue}>{children}</SocketContext>
}
