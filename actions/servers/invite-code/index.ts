'use server'

import { db } from '~/db'
import { currentProfile } from '~/lib/db/current-profile'
import { v4 } from 'uuid'
import { IServer } from '~/types'

type IGetInviteCodeResponse =
  | { success: true; data: { server: IServer } }
  | { success: false; error: string }

export async function getInviteCode(
  serverId: string,
): Promise<IGetInviteCodeResponse> {
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
