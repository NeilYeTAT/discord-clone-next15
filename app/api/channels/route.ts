import { ChannelType, MemberRole } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'
import { db } from '~/db'
import { currentProfile } from '~/lib/db/current-profile'

interface ICreateChannelsProps {
  channelName: string
  type: ChannelType
}

export async function POST(request: NextRequest) {
  try {
    const profile = await currentProfile()
    const { channelName, type }: ICreateChannelsProps = await request.json()
    const { searchParams } = new URL(request.url)
    const serverId = searchParams.get('serverId')

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    if (!serverId) {
      return new NextResponse('Server ID missing', { status: 400 })
    }
    if (channelName === 'general') {
      return new NextResponse("Name cannot be 'general'", { status: 400 })
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

    return NextResponse.json(server)
  } catch (error) {
    console.warn('Channels post', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
