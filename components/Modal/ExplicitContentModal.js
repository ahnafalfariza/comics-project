import Button from 'components/Common/Button'
import Modal from 'components/Common/Modal'

const ExplicitContentModal = ({ show, onClose, onClickYes }) => {
  return (
    <Modal closeOnBgClick closeOnEscape isShow={show}>
      <div className="max-w-xs w-full my-auto mx-8 md:mx-auto">
        <div className="p-4 bg-white rounded-md">
          <p className="text-xl mb-2">Warning</p>
          <p className="text-sm">
            This work contains content for ages 18 and over. Are you old enough
            to read it?
          </p>
          <div className="flex mt-2 gap-2 justify-end">
            <Button
              onClick={onClose}
              size="sm"
              variant="ghost"
              className="w-16"
            >
              No
            </Button>
            <Button onClick={onClickYes} size="sm" className="w-16">
              Yes
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ExplicitContentModal
