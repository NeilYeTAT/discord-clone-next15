'use server'

import { db } from '~/db'
import { currentProfile } from '~/lib/db/current-profile'
import { IServer } from '~/types'

type ILeaveServerResponse =
  | { success: true; data: { server: IServer } }
  | { success: false; error: string }

export async function leaveServer(
  serverId: string,
): Promise<ILeaveServerResponse> {
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
