import { Avatar, AvatarImage } from '~/components/ui/avatar'
import { cn } from '~/lib/utils'

interface IUserAvatarProps {
  src?: string
  className?: string
}
function UserAvatar({ src, className }: IUserAvatarProps) {
  return (
    <Avatar className={cn('size-8', className)}>
      <AvatarImage src={src} />
    </Avatar>
  )
}

export default UserAvatar
