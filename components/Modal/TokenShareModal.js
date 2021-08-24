import {
  FacebookIcon,
  FacebookShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
} from 'react-share'
import ListModal from './ListModal'

const TokenShareModal = ({ show, onClose }) => {
  const ShareList = [
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
        <TelegramShareButton
          url={window.location.href}
          className="flex text-white"
        >
          <TelegramIcon size={24} round />
          <p className="ml-3">Telegram</p>
        </TelegramShareButton>
      ),
      onClick: () => {},
    },
  ]

  return <ListModal show={show} onClose={onClose} list={ShareList} />
}

export default TokenShareModal
