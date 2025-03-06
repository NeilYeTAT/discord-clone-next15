import { MemberRole } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { uptime } from 'process'
import { db } from '~/db'
import { currentProfile } from '~/lib/db/current-profile'

export async function DELETE(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ channelId: string }>
  },
) {
  try {
    const profile = await currentProfile()
    const { searchParams } = new URL(request.url)
    const serverId = searchParams.get('serverId')
    const channelId = (await params).channelId

    if (!profile) {
      return new NextResponse('unauthorized', { status: 401 })
    }
    if (!serverId) {
      return new NextResponse('Server ID missing', { status: 401 })
    }
    if (!channelId) {
      return new NextResponse('Channel ID missing', { status: 401 })
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
          delete: {
            id: channelId,
            name: {
              not: 'general',
            },
          },
        },
      },
    })

    return NextResponse.json(server)
  } catch (error) {
    console.error('CHANNEL_ID_DELETE', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ channelId: string }>
  },
) {
  try {
    const profile = await currentProfile()
    const { searchParams } = new URL(request.url)
    const serverId = searchParams.get('serverId')
    const channelId = (await params).channelId
    const { channelName, type } = await request.json()

    if (!profile) {
      return new NextResponse('unauthorized', { status: 401 })
    }
    if (!serverId) {
      return new NextResponse('Server ID missing', { status: 401 })
    }
    if (!channelId) {
      return new NextResponse('Channel ID missing', { status: 401 })
    }
    if (channelName === 'general') {
      return new NextResponse("Channel name cannot be 'general'", {
        status: 400,
      })
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
          update: {
            where: {
              id: channelId,
              NOT: {
                name: 'general',
              },
            },
            data: {
              name: channelName,
              type,
            },
          },
        },
      },
    })

    return NextResponse.json(server)
  } catch (error) {
    console.error('CHANNEL_ID_PATCH', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
