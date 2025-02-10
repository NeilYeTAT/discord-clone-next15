import { currentProfile } from '~/lib/db/current-profile'
import { db } from '~/db'
import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { MemberRole } from '@prisma/client'

// * 请求体来自 initial-modal 中的 values
interface ICreateServerRequest {
  serverName: string
  imageUrl: string
}

export async function POST(req: NextRequest) {
  try {
    // * 获取服务器名称和图片地址, 准备创建服务器(群组)
    const { serverName, imageUrl }: ICreateServerRequest = await req.json()
    // * 拿到准备创建服务器的用户信息
    const profile = await currentProfile()

    if (!profile) {
      return new NextResponse('未登陆~', {
        status: 400,
      })
    }

    const server = await db.server.create({
      data: {
        profileId: profile.id,
        name: serverName,
        imageUrl,
        inviteCode: uuidv4(),
        channels: {
          create: [
            {
              // * 用过 discord 吧, qq 群中还可以创建不同的频道~ 比如 原神交流频道😋 二次元交流频道😋
              // * 这里默认创建一个 general 频道~
              name: 'general',
              profileId: profile.id,
            },
          ],
        },
        members: {
          create: [
            {
              profileId: profile.id,
              role: MemberRole.ADMIN,
            },
          ],
        },
      },
    })

    return NextResponse.json(server)
  } catch (error) {
    console.warn('servers/route.ts ', error)

    return new NextResponse('Internal Error', {
      status: 500,
    })
  }
}
