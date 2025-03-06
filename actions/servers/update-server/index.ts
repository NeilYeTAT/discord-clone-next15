'use server'

import { db } from '~/db'
import { currentProfile } from '~/lib/db/current-profile'
import { IServer } from '~/types'

type IUpdateServerResponse =
  | { success: true; data: { server: IServer } }
  | { success: false; error: string }

export async function updateServer({
  serverId,
  serverName,
  imageUrl,
}: {
  serverId: string
  serverName: string
  imageUrl: string
}): Promise<IUpdateServerResponse> {
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
      imageUrl: imageUrl,
    },
  })

  return {
    success: true,
    data: {
      server,
    },
  }
}
