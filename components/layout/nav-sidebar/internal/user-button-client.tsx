'use client'

import type { ComponentProps } from 'react'
import { UserButton } from '@clerk/nextjs'

// * ComponentProps 工具类型, 用于推导 React 组件的 props 类型~
type IUserButtonProps = ComponentProps<typeof UserButton>

function UserButtonClient({ ...props }: IUserButtonProps) {
  return <UserButton {...props} />
}

export default UserButtonClient
