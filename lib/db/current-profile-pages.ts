import type { NextApiRequest } from 'next'
import { getAuth } from '@clerk/nextjs/server'
import { db } from '~/db'

export async function currentProfilePages(req: NextApiRequest) {
  const { userId } = await getAuth(req)

  if (!userId)
    return null

  const profile = await db.profile.findUnique({
    where: {
      userId,
    },
  })

  return profile
}
