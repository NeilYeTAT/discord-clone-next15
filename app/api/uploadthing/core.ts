import type { FileRouter } from 'uploadthing/next'
import { auth } from '@clerk/nextjs/server'
import { createUploadthing } from 'uploadthing/next'

const f = createUploadthing()

async function handleAuth() {
  const { userId } = await auth()

  if (!userId)
    throw new Error('权限不够')

  return { userId }
}

export const ourFileRouter = {
  serverImage: f({
    image: {
      maxFileSize: '4MB',
      maxFileCount: 1,
    },
  })
    // * 权限管理
    .middleware(handleAuth)
    .onUploadComplete(async ({ metadata }) => ({
      uploadedBy: metadata.userId,
    })),
  messageFile: f(['image', 'pdf', 'text/markdown'])
    .middleware(handleAuth)
    .onUploadComplete(() => {}),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
