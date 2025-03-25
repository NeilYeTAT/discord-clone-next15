'use client'

import { FileIcon, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import { createChatHistoryFileType } from '~/actions/filetype'
import { UploadDropzone } from '~/lib/uploadthing'
import '@uploadthing/react/styles.css'

function getFileType(filename: string) {
  return filename.split('.').pop() || ''
}

async function storeFileType(fileUrl: string, fileType: string) {
  try {
    const resp = await createChatHistoryFileType(fileUrl, fileType)
    console.warn(resp)
  } catch (error) {
    console.error('设置文件类型出错', error)
  }
}

// * 在这里实现 url => file type 的映射, 存储到数据库中
function FileUpload({
  endpoint,
  value,
  onChange,
  shouldStoreFileType = false,
}: {
  value: string
  endpoint: 'messageFile' | 'serverImage'
  onChange: (url?: string) => void
  shouldStoreFileType?: boolean
}) {
  const fileTypeRef = useRef('')
  const fileType = fileTypeRef.current

  // * 这里的 value 是指保存在云端的图片路径, 只有上传图片才会有值~
  if (value && fileType !== 'pdf') {
    return (
      <div className="relative h-20 w-20 mx-auto">
        <Image
          fill
          src={value}
          alt="upload image"
          className="rounded-full"
          unoptimized
        />
        <X
          onClick={() => onChange()}
          className="absolute -right-1 -top-1 bg-red-600 rounded-full p-1 shadow-sm cursor-pointer"
        />
      </div>
    )
  }

  if (value && fileType === 'pdf') {
    return (
      <div className="flex items-center p-2 mt-1 rounded-md bg-background/10 flex-col gap-1">
        <section className="relative">
          <FileIcon className="h-10 w-10 fill-indigo-200 stroke-indigo-400" />
          <button
            onClick={() => onChange('')}
            className="bg-rose-500 text-white p-1 rounded-full absolute -top-2 -right-1 shadow-sm"
            type="button"
          >
            <X className="size-3" />
          </button>
        </section>
        <Link
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="ml-2 text-sm text-indigo-500 dark:text-indigo-400 hover:underline truncate max-w-md w-80"
        >
          {value}
        </Link>
      </div>
    )
  }

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={([{ name, url }]) => {
        // * 被 React Hook Form 管理
        // * 使用 onChange 方法传递文件的 URL, 更新表单值, 之后再在父组件中将 URL 保存到数据库中~
        fileTypeRef.current = getFileType(name)
        onChange(url)
        if (shouldStoreFileType) {
          storeFileType(url, fileTypeRef.current)
        }
      }}
      onUploadError={error => {
        console.error('图片上传错误~', error)
      }}
    />
  )
}

export default FileUpload
