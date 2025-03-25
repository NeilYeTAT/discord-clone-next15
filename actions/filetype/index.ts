'use server'

import { v4 } from 'uuid'
import { db } from '~/db'
import { currentProfile } from '~/lib/db/current-profile'

export async function getChatHistoryFileType(url: string) {
  const profile = await currentProfile()

  if (!profile) {
    return { success: false, error: '未授权' }
  }

  const server = await db.fileType.findUnique({
    where: {
      fileUrl: url,
    },
    include: {
      messages: true,
      directMessages: true,
    },
  })

  if (!server) {
    return { success: false, error: '文件未找到' }
  }

  return {
    success: true,
    data: {
      fileType: server.fileType,
    },
  }
}

export async function createChatHistoryFileType(url: string, fileType: string) {
  const profile = await currentProfile()

  if (!profile) {
    return { success: false, error: '未授权' }
  }

  const server = await db.fileType.create({
    data: {
      fileType,
      fileUrl: url,
      id: v4(),
    },
  })

  return {
    success: true,
    data: {
      server,
    },
  }
}
