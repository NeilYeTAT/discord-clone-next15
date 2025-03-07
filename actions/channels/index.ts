'use server'

import { ChannelType, MemberRole } from '@prisma/client'
import { db } from '~/db'
import { currentProfile } from '~/lib/db/current-profile'

export async function createChannel({
  serverId,
  channelName,
  type,
}: {
  serverId: string
  channelName: string
  type: ChannelType
}) {
  const profile = await currentProfile()

  if (!profile) {
    return { success: false, error: '未授权' }
  }

  if (!serverId) {
    return { success: false, error: '服务器 ID 没找到' }
  }

  if (channelName === 'general') {
    return { success: false, error: `频道名不能为 'general'` }
  }

  const server = await db.server.update({
    where: {
      id: serverId,
      members: {
        some: {
          profileId: profile.id,
          role: {
            in: [MemberRole.ADMIN, MemberRole.MODERATOR],
          },
        },
      },
    },
    data: {
      channels: {
        create: {
          profileId: profile.id,
          name: channelName,
          type,
        },
      },
    },
  })

  return {
    success: true,
    data: {
      server,
    },
  }
}
