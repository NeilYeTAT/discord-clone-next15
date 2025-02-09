'use client'

import { X } from 'lucide-react'
import Image from 'next/image'
import { UploadDropzone } from '~/lib/uploadthing'
import '@uploadthing/react/styles.css'

interface IFileuploadProps {
  value: string
  endpoint: 'messageFile' | 'serverImage'
  onChange: (url?: string) => void
}

const FileUpload = ({ endpoint, value, onChange }: IFileuploadProps) => {
  const fileType = value?.split('.').pop()

  // * 这里的 value 是指保存在云端的图片路径, 只有上传图片才会有值~
  // * 我这里多进行了一个 markdown 格式的判断, 是因为我 api/uploadthing/core.ts 文件中允许上传 markdown 文件
  if (value && fileType !== 'pdf' && fileType !== 'text/markdown') {
    return (
      <div className="relative h-20 w-20">
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

  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={res => {
        // * 被 React Hook Form 管理
        // * 使用 onChange 方法传递文件的 URL, 更新表单值, 之后再在父组件中将 URL 保存到数据库中~
        onChange(res[0].url)
      }}
      onUploadError={err => {
        console.warn('图片上传错误~')
      }}
    />
  )
}

export default FileUpload
