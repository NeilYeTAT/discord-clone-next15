import { Server as NetServer } from 'http'
import { Server as ServerIO } from 'socket.io'
import { NextApiRequest } from 'next'

import type { NextApiResponseServerIo } from '~/types'

export const config = {
  api: {
    bodyParser: false,
  },
}

export const ioHandler = (
  request: NextApiRequest,
  response: NextApiResponseServerIo,
) => {
  if (!response.socket.server.io) {
    const path = `/api/socket/io`
    const httpServer: NetServer = response.socket.server as any
    const io = new ServerIO(httpServer, {
      path: path,
      addTrailingSlash: false,
    })
    response.socket.server.io = io
  }

  response.end()
}

export default ioHandler
