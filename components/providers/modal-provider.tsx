'use client'

import CreateServerModal from '~/components/modals/create-server-modal'
import InviteUsersModal from '~/components/modals/invite-users-modal'
import EditServerModal from '~/components/modals/edit-server-modal'
import ManageMembersModal from '~/components/modals/manage-members-modal'
import CreateChannelModal from '~/components/modals/create-channel-modal'
import LeaveServerModal from '~/components/modals/leave-server-modal'
import DeleteServerModal from '~/components/modals/delete-server-modal'
import DeleChannelModal from '~/components/modals/delete-channel-modal'
import EditChannelModal from '~/components/modals/edit-channel-modal'
import MessageFileModal from '~/components/modals/upload-message-file-modal'
import DeleteMessageModal from '~/components/modals/delete-message-modal'

export const ModalProvider = () => {
  return (
    <>
      <CreateServerModal />
      <InviteUsersModal />
      <EditServerModal />
      <ManageMembersModal />
      <CreateChannelModal />
      <LeaveServerModal />
      <DeleteServerModal />
      <DeleChannelModal />
      <EditChannelModal />
      <MessageFileModal />
      <DeleteMessageModal />
    </>
  )
}
