import { NextRequest, NextResponse } from 'next/server'
import { db } from '~/db'
import { currentProfile } from '~/lib/db/current-profile'

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ memberId: string }> },
) {
  try {
    const profile = await currentProfile()
    const memberId = (await params).memberId
    const { searchParams } = new URL(request.url)
    const serverId = searchParams.get('serverId')

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 })
    }
    if (!serverId) {
      return new NextResponse('Server ID missing', { status: 400 })
    }
    if (!memberId) {
      return new NextResponse('Member ID missing', { status: 400 })
    }

    const server = await db.server.update({
      where: {
        id: serverId,
        profileId: profile.id,
      },
      data: {
        members: {
          deleteMany: {
            id: memberId,
            profileId: {
              not: profile.id,
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

    return NextResponse.json(server)
  } catch (error) {
    console.error('memberId route error delete', error)
    return new NextResponse('Internal Error', { status: 500 })
  }
}
