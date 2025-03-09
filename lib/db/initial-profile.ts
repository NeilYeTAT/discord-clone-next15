import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '~/db'

export async function initialProfile() {
  const user = await currentUser()

  // * 重定向去登陆
  if (!user) {
    redirect('/sign-in')
  }

  const profile = await db.profile.findUnique({
    where: {
      userId: user.id,
    },
  })

  // * 有个人资料就不用再创建了
  if (profile) {
    return profile
  }

  const newProfile = await db.profile.create({
    data: {
      userId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      imageUrl: user.imageUrl,
      email: user?.emailAddresses[0]?.emailAddress,
    },
  })

  return newProfile
}
