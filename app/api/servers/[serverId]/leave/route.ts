import { NextRequest, NextResponse } from 'next/server'
import { db } from '~/db'
import { currentProfile } from '~/lib/db/current-profile'

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
      return new NextResponse('未找到群组id', { status: 400 })
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

    return NextResponse.json(server)
  } catch (error) {
    console.warn('leave route error', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
