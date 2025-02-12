import { Avatar, AvatarImage } from '~/components/ui/avatar'
import { cn } from '~/lib/utils'

interface IUserAvatarProps {
  src?: string
  className?: string
}
const UserAvatar = ({ src, className }: IUserAvatarProps) => {
  return (
    <Avatar className={cn('size-', className)}>
      <AvatarImage src={src} />
    </Avatar>
  )
}

export default UserAvatar
