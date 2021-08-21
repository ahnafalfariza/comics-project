import {
  FacebookIcon,
  FacebookShareButton,
  TwitterIcon,
  TwitterShareButton,
} from 'react-share'
import ListModal from './ListModal'

const TokenDetailShareModal = ({ show, onClose }) => {
  const ShareList = [
    {
      name: (
        <TwitterShareButton
          title={`Test Share`}
          url={window.location.href}
          className="flex text-white"
        >
          <TwitterIcon size={24} round />
          <p className="ml-3">Twitter</p>
        </TwitterShareButton>
      ),
      onClick: () => {},
    },
    {
      name: (
        <FacebookShareButton
          url={window.location.href}
          className="flex text-white"
        >
          <FacebookIcon size={24} round />
          <p className="ml-3">Facebook</p>
        </FacebookShareButton>
      ),
      onClick: () => {},
    },
  ]

  return <ListModal show={show} onClose={onClose} list={ShareList} />
}

export default TokenDetailShareModal
