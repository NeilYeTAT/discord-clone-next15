'use server'

import { db } from '~/db'
import { currentProfile } from '~/lib/db/current-profile'
import { IServer } from '~/types'

type IDeleteServerResponse =
  | { success: true; data: { server: IServer } }
  | { success: false; error: string }

export async function deleteServer(
  serverId: string,
): Promise<IDeleteServerResponse> {
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
