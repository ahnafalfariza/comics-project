import Button from 'components/Common/Button'
import Modal from 'components/Common/Modal'
import { IconX } from 'components/Icons'
import React from 'react'

const CommentDeleteModal = ({ showDeleteCommentConfirm, onClick, onClose }) => {
  return (
    <Modal
      isShow={showDeleteCommentConfirm}
      closeOnEscape={false}
      closeOnBgClick={false}
    >
      <div className="w-full md:max-w-md bg-white p-3 flex flex-col m-auto">
        <div className="flex items-center justify-between p-3">
          <p className="text-xl font-medium text-black">Delete Comment</p>
          <IconX onClick={onClose} className="cursor-pointer" color="#A1A1AA" />
        </div>
        <hr className="my-2 -mx-3 opacity-20" />
        <div className="my-2 md:my-4">
          <p>Are you sure you want to delete your comment?</p>
        </div>
        <div className="flex justify-end items-center">
          <Button size="sm" className="float-right" onClick={onClick}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default CommentDeleteModal
