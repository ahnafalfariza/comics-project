import { useState } from 'react'
import Button from 'components/Common/Button'
import Modal from 'components/Common/Modal'
import near from 'lib/near'
import useStore from 'lib/store'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import LoginModal from './LoginModal'

const TokenBuyModal = ({
  show,
  onClose,
  data = {
    token_type: 'paradigm-1',
    comic_id: 'paradigm',
    chapter_id: 1,
    metadata: {
      title: 'Paradigm Ch.1 : The Metaverse',
      description:
        "While waiting for the hackathon's final stage, Abee got transferred into an unknown world",
      media: 'bafybeih4vvtevzfxtwsq2oadkvg6rtpspih4pyqqegtocwklcmnhe7p5mi',
      media_hash: null,
      copies: null,
      issued_at: '2021-08-21T16:33:28.475Z',
      expires_at: null,
      starts_at: null,
      updated_at: null,
      extra: null,
      reference: 'bafybeiaqaxyw2x6yx6vnbntg3dpdqzv2hpq2byffcrbit7dygcksauv3ta',
      reference_hash: null,
      blurhash: 'UCQ0XJ~qxu~q00IUayM{00M{M{M{00ayofWB',
      author_ids: ['afiq.testnet'],
      page_count: 12,
      collection: 'Paradigm',
      subtitle: 'The Metaverse',
    },
    price: '0',
  },
}) => {
  const [showLogin, setShowLogin] = useState(false)
  const buyChapter = useStore((state) => state.buyChapter)

  const onBuyToken = () => {
    if (!near.currentUser) {
      setShowLogin(true)
      return
    }
    buyChapter(data.token_series_id, data.price)
  }

  return (
    <>
      <Modal
        isShow={show}
        closeOnBgClick={false}
        closeOnEscape={false}
        close={onClose}
      >
        <div className="max-w-sm w-full p-4 bg-white m-4 md:m-auto rounded-md">
          <div>
            <h1 className="text-2xl font-bold text-black tracking-tight">
              Confirm Buy
            </h1>
            <p className="text-gray-800 mt-2">
              You are about to purchase <b>{data.metadata.title}</b>
            </p>
            <div className="mt-4">
              <div className="mt-2 text-sm text-red-500"></div>
            </div>
            <div className="mt-4 text-center">
              <div className="text-gray-800 my-1">
                <div className="flex justify-between">
                  <div className="text-sm">Total</div>
                  {data.price && (
                    <div className="text">{formatNearAmount(data.price)} Ⓝ</div>
                  )}
                </div>
                <div className="flex justify-between">
                  <div className="text-sm">Transaction Fee</div>
                  <div className="text">0.01832 Ⓝ</div>
                </div>
              </div>
            </div>
            <p className="text-gray-800 mt-4 text-sm text-center opacity-90">
              *Small transaction fee is applied
            </p>
            <p className="text-gray-800 mt-2 text-sm text-center opacity-90">
              You will be redirected to NEAR Web Wallet to confirm your
              transaction.
            </p>
            <div className="mt-6">
              <Button
                isDisabled={!data.price}
                size="md"
                isFullWidth
                onClick={onBuyToken}
              >
                {data.price
                  ? data.price !== '0'
                    ? 'Buy'
                    : 'Get for Free'
                  : data.is_non_mintable
                  ? 'Sold Out'
                  : 'Coming Soon'}
              </Button>
              <Button
                variant="ghost"
                size="md"
                isFullWidth
                className="mt-4"
                onClick={onClose}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      </Modal>
      <LoginModal onClose={() => setShowLogin(false)} show={showLogin} />
    </>
  )
}

export default TokenBuyModal
