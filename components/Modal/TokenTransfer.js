import axios from 'axios'
import Button from 'components/Common/Button'
import { InputText } from 'components/Common/form/index'
import Modal from 'components/Common/Modal'
import getConfig from 'lib/config/near'
import near from 'lib/near'
import { sentryCaptureException } from 'lib/sentry'
import useStore from 'lib/store'
import { useState } from 'react'

const TokenTransfer = ({
  show,
  onClose,
  data = {
    token_id: 'paradigm-1:2',
    comic_id: 'paradigm',
    chapter_id: 1,
    edition_id: 2,
    metadata: {
      title: 'Paradigm Ch.1 : The Metaverse #2',
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
    owner_id: 'ahnaf.testnet',
    token_type: 'paradigm-1',
  },
}) => {
  const [receiverId, setReceiverId] = useState('')
  const setToastConfig = useStore((state) => state.setToastConfig)

  const transfer = async () => {
    const params = {
      token_id: data.token_id,
      receiver_id: receiverId,
    }

    try {
      if (receiverId === near.currentUser.accountId) {
        throw new Error(`Cannot transfer to self`)
      }
      const nearConfig = getConfig(process.env.APP_ENV || 'development')

      const resp = await axios.post(nearConfig.nodeUrl, {
        jsonrpc: '2.0',
        id: 'dontcare',
        method: 'query',
        params: {
          request_type: 'view_account',
          finality: 'final',
          account_id: receiverId,
        },
      })
      if (resp.data.error) {
        throw new Error(`Account ${receiverId} not exist`)
      }
      near.contract.nft_transfer(params, '50000000000000', '1')
    } catch (err) {
      sentryCaptureException(err)
      const message = err.message || 'Something went wrong, try again later'
      setToastConfig({
        text: (
          <div className="font-semibold text-center text-sm">{message}</div>
        ),
        type: 'error',
        duration: 2500,
      })
    }
  }

  return (
    <Modal isShow={show} close={onClose}>
      <div className="max-w-sm w-full p-4 bg-blueGray-800 m-4 md:m-auto rounded-md">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Confirm Transfer
          </h1>
          <div className="mt-4">
            <label className="block text-sm text-white opacity-90 mb-2">
              Address (Account ID)
            </label>
            <InputText
              type="text"
              value={receiverId}
              onChange={(e) => setReceiverId(e.target.value)}
              placeholder="New Owner Address"
            />
            <div className="mt-2 text-sm text-red-500"></div>
          </div>
          <p className="mt-4 text-sm text-center text-white opacity-90 mb-2">
            You will be transfering <b>{data.metadata.title}</b>
            {receiverId && ` to `}
            <b>{receiverId}</b>
          </p>
          <div className="">
            <Button
              isFullWidth
              className="my-3"
              isDisabled={receiverId === ''}
              onClick={transfer}
            >
              Transfer
            </Button>
            <Button isFullWidth variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default TokenTransfer
