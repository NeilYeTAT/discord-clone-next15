import { NextRequest, NextResponse } from 'next/server'
import { db } from '~/db'
import { currentProfile } from '~/lib/db/current-profile'

interface IServerRequest {
  serverName: string
  imageUrl: string
}

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
    const { serverName, imageUrl }: IServerRequest = await request.json()

    if (!profile) {
      return new NextResponse('Unauthorized', { status: 401 })
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

    return NextResponse.json(server)
  } catch (error) {
    console.error('Server id patch error', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}

export async function DELETE(
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
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const server = await db.server.delete({
      where: {
        id: serverId,
        profileId: profile.id,
      },
    })

    return NextResponse.json(server)
  } catch (error) {
    console.error('Server delete error', error)
    return new NextResponse('Internal error', { status: 500 })
  }
}
