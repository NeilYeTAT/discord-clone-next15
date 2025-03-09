import { db } from '~/db'

export async function getOrCreateConversation(memberOneId: string, memberTwoId: string) {
  return (
    (await findConversation(memberOneId, memberTwoId))
    || (await findConversation(memberTwoId, memberOneId))
    || (await createNewConversation(memberOneId, memberTwoId))
  )
}

export async function findConversation(memberOneId: string, memberTwoId: string) {
  try {
    return await db.conversation.findFirst({
      where: {
        AND: [{ memberOneId }, { memberTwoId }],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    })
  }
  catch (error) {
    console.error('FIND CONVERSATION ERROR', error)
    return null
  }
}

export async function createNewConversation(memberOneId: string, memberTwoId: string) {
  try {
    return await db.conversation.create({
      data: {
        memberOneId,
        memberTwoId,
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    })
  }
  catch (error) {
    console.error('CREATE A NEW CONVERSATION ERROR', error)
    return null
  }
}
