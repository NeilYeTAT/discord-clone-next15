'use server'

import { MemberRole } from '@prisma/client'
import { db } from '~/db'
import { currentProfile } from '~/lib/db/current-profile'

export async function updateMemberRole({
  serverId,
  memberId,
  role,
}: {
  serverId: string
  memberId: string
  role: MemberRole
}) {
  const profile = await currentProfile()

  if (!profile) {
    return { success: false, error: '未授权' }
  }

  if (!serverId) {
    return { success: false, error: '服务器 ID 未找到' }
  }

  if (!memberId) {
    return { success: false, error: '成员 ID 未找到' }
  }

  const server = await db.server.update({
    // * 找到要更新的群组~
    where: {
      id: serverId,
      profileId: profile.id,
    },
    // * 需要更新的字段~
    data: {
      members: {
        update: {
          where: {
            id: memberId,
            profileId: {
              not: profile.id,
            },
          },
          data: {
            role,
          },
        },
      },
    },
    include: {
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: 'asc',
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
