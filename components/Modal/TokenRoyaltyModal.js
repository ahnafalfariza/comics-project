import LinkToProfile from 'components/Common/LinkToProfile'
import Modal from 'components/Common/Modal'
import { IconArrowSmall, IconX } from 'components/Icons'
import Scrollbars from 'react-custom-scrollbars-2'

const TokenRoyaltyModal = ({ show, onClose, royalty }) => {
  return (
    <Modal isShow={show} close={onClose} closeOnBgClick closeOnEscape>
      <div className="max-w-sm py-4 w-full bg-white m-auto rounded-md relative">
        <div className="absolute right-0 top-0 pr-4 pt-4">
          <div className="cursor-pointer" onClick={onClose}>
            <IconX color="black" />
          </div>
        </div>
        <div className="px-4">
          <p className="text-2xl font-semibold text-black">Royalty</p>
        </div>
        <div>
          <Scrollbars autoHeight autoHeightMax="20vh">
            <div className="ml-2">
              {Object.keys(royalty).map((accountId, idx) => {
                return (
                  <div className="flex mt-2" key={idx}>
                    <div className="w-2/3 flex text-gray-100">
                      <IconArrowSmall color="black" />
                      <LinkToProfile
                        className="text-black hover:border-primary"
                        accountId={accountId}
                      />
                    </div>
                    <div className="w-1/3 text-right pr-6">
                      <p className="text-black">{royalty[accountId] / 100}%</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </Scrollbars>
        </div>
      </div>
    </Modal>
  )
}

export default TokenRoyaltyModal
