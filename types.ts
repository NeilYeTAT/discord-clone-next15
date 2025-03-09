import type { Member, Profile, Server } from '@prisma/client'
import type { NextApiResponse } from 'next'
import type { Server as NetServer, Socket } from 'node:net'
import type { Server as SocketIOServer } from 'socket.io'

export type ServerWithMembersWithProfiles = Server & {
  members: (Member & {
    profile: Profile
  })[]
}

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer
    }
  }
}

export interface IServer {
  name: string
  id: string
  imageUrl: string
  updatedAt: Date
  inviteCode: string
  profileId: string
  createdAt: Date
}
