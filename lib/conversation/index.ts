import { db } from '~/db'

export const getOrCreateConversation = async (
  memberOneId: string,
  memberTwoId: string,
) => {
  return (
    (await findConversation(memberOneId, memberTwoId)) ||
    (await findConversation(memberTwoId, memberOneId)) ||
    (await createNewConversation(memberOneId, memberTwoId))
  )
}

export const findConversation = async (
  memberOneId: string,
  memberTwoId: string,
) => {
  try {
    return await db.conversation.findFirst({
      where: {
        AND: [{ memberOneId: memberOneId }, { memberTwoId: memberTwoId }],
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
  } catch (error) {
    console.error('FIND CONVERSATION ERROR', error)
    return null
  }
}

export const createNewConversation = async (
  memberOneId: string,
  memberTwoId: string,
) => {
  try {
    return await db.conversation.create({
      data: {
        memberOneId: memberOneId,
        memberTwoId: memberTwoId,
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
  } catch (error) {
    console.error('CREATE A NEW CONVERSATION ERROR', error)
    return null
  }
}
