'use server'

import type { IServer } from '~/types'
import { MemberRole } from '@prisma/client'
import { v4 } from 'uuid'
import { db } from '~/db'
import { currentProfile } from '~/lib/db/current-profile'

type IBaseResponse =
  | { success: true, data: { server: IServer } }
  | { success: false, error: string }

interface IValues {
  serverName: string
  imageUrl: string
}

export async function createServer(values: IValues): Promise<IBaseResponse> {
  const { imageUrl, serverName } = values
  const profile = await currentProfile()

  if (!profile) {
    return { success: false, error: '未授权' }
  }

  const server = await db.server.create({
    data: {
      profileId: profile.id,
      name: serverName,
      imageUrl,
      inviteCode: v4(),
      channels: {
        create: [
          {
            // * 这里默认创建一个 general 频道~
            name: 'general',
            profileId: profile.id,
          },
        ],
      },
      members: {
        create: [
          {
            profileId: profile.id,
            role: MemberRole.ADMIN,
          },
        ],
      },
    },
  })

  return {
    success: true,
    data: { server },
  }
}

export async function updateServer({
  serverId,
  serverName,
  imageUrl,
}: {
  serverId: string
  serverName: string
  imageUrl: string
}): Promise<IBaseResponse> {
  const profile = await currentProfile()

  if (!profile) {
    return { success: false, error: '未授权' }
  }

  const server = await db.server.update({
    where: {
      id: serverId,
      profileId: profile.id,
    },
    data: {
      name: serverName,
      imageUrl,
    },
  })

  return {
    success: true,
    data: {
      server,
    },
  }
}

export async function leaveServer(serverId: string): Promise<IBaseResponse> {
  const profile = await currentProfile()

  if (!profile) {
    return { success: false, error: '未授权' }
  }
  if (!serverId) {
    return { success: false, error: '未找到群组id' }
  }

  const server = await db.server.update({
    where: {
      id: serverId,
      profileId: {
        not: profile.id,
      },
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    data: {
      members: {
        deleteMany: {
          profileId: profile.id,
        },
      },
    },
  })

  return {
    success: true,
    data: { server },
  }
}

export async function deleteServer(serverId: string): Promise<IBaseResponse> {
  const profile = await currentProfile()

  if (!profile) {
    return { success: false, error: '未授权' }
  }

  const server = await db.server.delete({
    where: {
      id: serverId,
      profileId: profile.id,
    },
  })

  return {
    success: true,
    data: {
      server,
    },
  }
}

export async function getInviteCode(serverId: string): Promise<IBaseResponse> {
  const profile = await currentProfile()

  if (!profile) {
    return { success: false, error: '未授权' }
  }
  if (!serverId) {
    return { success: false, error: '未找到群组id' }
  }

  const server = await db.server.update({
    where: {
      id: serverId,
      profileId: profile.id,
    },
    data: {
      inviteCode: v4(),
    },
  })

  return {
    success: true,
    data: { server },
  }
}
