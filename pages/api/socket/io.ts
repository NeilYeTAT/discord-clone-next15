import type { NextApiRequest } from 'next'
import type { Server as NetServer } from 'node:http'
import type { NextApiResponseServerIo } from '~/types'

import { Server as ServerIO } from 'socket.io'

export const config = {
  api: {
    bodyParser: false,
  },
}

function ioHandler(req: NextApiRequest, res: NextApiResponseServerIo) {
  if (!res.socket.server.io) {
    const path = '/api/socket/io'
    const httpServer: NetServer = res.socket.server as any
    const io = new ServerIO(httpServer, {
      path,
      addTrailingSlash: false,
    })
    res.socket.server.io = io
  }

  res.end()
}

export default ioHandler
