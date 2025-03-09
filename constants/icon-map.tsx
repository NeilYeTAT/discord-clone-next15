import type { ChannelType, MemberRole } from '@prisma/client'
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react'

export const ROLE_ICON_MAP: Record<MemberRole, React.ReactNode> = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="size-4 mr-2 text-indigo-500" />,
  ADMIN: <ShieldAlert className="size-4 mr-2 text-rose-500" />,
}

export const CHANNEL_TYPE_ICON_MAP: Record<ChannelType, React.ReactNode> = {
  TEXT: <Hash className="size-4" />,
  AUDIO: <Mic className="size-4" />,
  VIDEO: <Video className="size-4" />,
}
