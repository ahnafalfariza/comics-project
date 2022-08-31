import {
  FacebookIcon,
  FacebookShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
} from 'react-share'

const ShareComponent = ({ title, shareUrl, withText = true }) => {
  return (
    <div className="flex items-center space-x-2 justify-between">
      {withText && (
        <div className="text-black text-sm opacity-80 pr-4">Share Now</div>
      )}
      <div className="flex space-x-3">
        <FacebookShareButton
          url={shareUrl}
          quote={title}
          className="Demo__some-network__share-button"
        >
          <FacebookIcon size={24} round />
        </FacebookShareButton>

        <TwitterShareButton
          url={shareUrl}
          title={title}
          className="Demo__some-network__share-button"
        >
          <TwitterIcon size={24} round />
        </TwitterShareButton>
        <TelegramShareButton
          url={shareUrl}
          title={title}
          className="Demo__some-network__share-button"
        >
          <TelegramIcon size={24} round />
        </TelegramShareButton>
      </div>
    </div>
  )
}

export default ShareComponent
