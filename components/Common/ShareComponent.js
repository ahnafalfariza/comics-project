import {
  FacebookIcon,
  FacebookShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
} from 'react-share'

const ShareComponent = ({ title, shareUrl }) => {
  return (
    <div className="mt-4 flex space-x-2 justify-between md:-mb-4 md:-mx-2">
      <div className="text-white mr-4 text-sm opacity-80">Share Now</div>
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
