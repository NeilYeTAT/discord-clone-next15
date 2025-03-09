import type { NextApiRequest } from 'next'
import type { Server as NetServer } from 'node:http'
import type { NextApiResponseServerIo } from '~/types'

import { Server as ServerIO } from 'socket.io'

export const config = {
  api: {
    bodyParser: false,
  },
}

export function ioHandler(request: NextApiRequest, response: NextApiResponseServerIo) {
  if (!response.socket.server.io) {
    const path = `/api/socket/io`
    const httpServer: NetServer = response.socket.server as any
    const io = new ServerIO(httpServer, {
      path,
      addTrailingSlash: false,
    })
    response.socket.server.io = io
  }

  response.end()
}

export default ioHandler
