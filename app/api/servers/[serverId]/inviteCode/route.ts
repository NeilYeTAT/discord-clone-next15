import { NextRequest, NextResponse } from 'next/server'
import { db } from '~/db'
import { currentProfile } from '~/lib/db/current-profile'
import { v4 as uuidv4 } from 'uuid'

export async function PATCH(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      serverId: string
    }>
  },
) {
  try {
    const profile = await currentProfile()
    const serverId = (await params).serverId

    if (!profile) {
      return new NextResponse('未授权', { status: 401 })
    }
    if (!serverId) {
      return new NextResponse('未找到服务器id', { status: 400 })
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        inviteCode: uuidv4(),
      },
    })

    return NextResponse.json(server)
  } catch (error) {
    console.warn('ServerId route error', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
