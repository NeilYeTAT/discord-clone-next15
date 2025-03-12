import { createContext, useContext } from 'react'

interface SocketContextType {
  socket: any | null
  isConnected: boolean
}

export const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
})

export function useSocket() {
  return useContext(SocketContext)
}
