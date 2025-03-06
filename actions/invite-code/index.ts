'use server'

import { db } from '~/db'
import { currentProfile } from '~/lib/db/current-profile'
import { v4 } from 'uuid'

type IServer = {
  name: string
  id: string
  imageUrl: string
  updatedAt: Date
  inviteCode: string
  profileId: string
  createdAt: Date
}

export async function getInviteCode(serverId = ''): Promise<{
  success: boolean
  error?: string
  data?: { server: IServer }
}> {
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
