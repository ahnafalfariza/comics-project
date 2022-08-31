import Modal from 'components/Common/Modal'
import useStore from 'lib/store'
import CommentList from './CommentList'

const CommentListModal = () => {
  const showComment = useStore((state) => state.showComment)

  return (
    <Modal isShow={showComment} closeOnEscape={false} closeOnBgClick={false}>
      <CommentList />
    </Modal>
  )
}

export default CommentListModal
