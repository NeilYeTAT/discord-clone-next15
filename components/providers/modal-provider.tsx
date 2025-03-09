'use client'

import CreateChannelModal from '~/components/modals/create-channel-modal'
import CreateServerModal from '~/components/modals/create-server-modal'
import DeleChannelModal from '~/components/modals/delete-channel-modal'
import DeleteMessageModal from '~/components/modals/delete-message-modal'
import DeleteServerModal from '~/components/modals/delete-server-modal'
import InviteUsersModal from '~/components/modals/invite-users-modal'
import LeaveServerModal from '~/components/modals/leave-server-modal'
import ManageMembersModal from '~/components/modals/manage-members-modal'
import UpdateChannelModal from '~/components/modals/update-channel-modal'
import UpdateServerModal from '~/components/modals/update-server-modal'
import MessageFileModal from '~/components/modals/upload-message-file-modal'

export function ModalProvider() {
  return (
    <>
      <CreateServerModal />
      <InviteUsersModal />
      <UpdateServerModal />
      <ManageMembersModal />
      <CreateChannelModal />
      <LeaveServerModal />
      <DeleteServerModal />
      <DeleChannelModal />
      <UpdateChannelModal />
      <MessageFileModal />
      <DeleteMessageModal />
    </>
  )
}
