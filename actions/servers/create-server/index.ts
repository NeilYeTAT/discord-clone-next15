'use server'

import { currentProfile } from '~/lib/db/current-profile'
import { v4 } from 'uuid'
import { MemberRole } from '@prisma/client'
import { db } from '~/db'
import { IServer } from '~/types'

interface IValues {
  serverName: string
  imageUrl: string
}

type ICreateServerResponse =
  | { success: true; data: { server: IServer } }
  | { success: false; error: string }

export async function createServer(
  values: IValues,
): Promise<ICreateServerResponse> {
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
