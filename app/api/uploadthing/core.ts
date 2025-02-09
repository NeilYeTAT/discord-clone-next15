import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { auth } from '@clerk/nextjs/server'

const f = createUploadthing()

const handleAuth = async () => {
  const { userId } = await auth()

  if (!userId) throw new Error('权限不够喵~')

  return { userId }
}

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  serverImage: f({
    image: {
      maxFileSize: '4MB',
      maxFileCount: 1,
    },
  })
    // * 权限管理
    .middleware(handleAuth)
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log('Upload complete for userId:', metadata.userId)

      console.log('file url', file.url)

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId }
    }),
  // * 聊天中的文件
  messageFile: f(['image', 'pdf', 'text/markdown'])
    .middleware(handleAuth)
    .onUploadComplete(() => {}),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
