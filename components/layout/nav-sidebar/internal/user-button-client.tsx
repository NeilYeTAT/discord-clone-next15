'use client'

import { UserButton } from '@clerk/nextjs'
import type { ComponentProps } from 'react'

// * ComponentProps 工具类型, 用于推导 React 组件的 props 类型~
type IUserButtonProps = ComponentProps<typeof UserButton>

const UserButtonClient = ({ ...props }: IUserButtonProps) => {
  return <UserButton {...props} />
}

export default UserButtonClient
