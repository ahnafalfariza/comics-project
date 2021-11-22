import Link from 'next/link'
import { useState } from 'react'
import { Blurhash } from 'react-blurhash'
import Scrollbars from 'react-custom-scrollbars-2'

import Button from '../Common/Button'
import { IconDots } from '../Icons'
import TabInfo from './Tabs/TabInfo'
import TabHistory from './Tabs/TabHistory'

import TokenMoreModal from 'components/Modal/TokenMoreModal'
import TokenShareModal from 'components/Modal/TokenShareModal'
import TokenDetailUpdateModal from 'components/Modal/TokenDetailUpdateModal'
import near from 'lib/near'
import TokenTransfer from 'components/Modal/TokenTransfer'
import { parseImgUrl } from 'utils/common'

const TokenDetail = ({ token, className }) => {
  const [activeTab, setActiveTab] = useState('info')
  const [showModal, setShowModal] = useState(null)

  const changeActiveTab = (tab) => {
    setActiveTab(tab)
  }

  const tabDetail = (tab) => {
    return (
      <div
        className={`cursor-pointer relative text-center overflow-hidden ${
          activeTab === tab
            ? 'text-gray-100 border-b-2 border-white font-semibold'
            : 'hover:bg-opacity-15 text-gray-100'
        }`}
        onClick={() => changeActiveTab(tab)}
      >
        <div className="capitalize">{tab}</div>
      </div>
    )
  }

  const onDismissModal = () => {
    setShowModal(null)
  }

  const onClickShare = () => {
    setShowModal('share')
  }

  const onClickUpdate = () => {
    setShowModal('update')
  }

  return (
    <div className={`max-w-6xl m-auto ${className}`}>
      <div
        className="flex flex-wrap h-full rounded-lg overflow-hidden"
        style={{ height: `85vh` }}
      >
        <div className="w-full h-2/5 lg:h-full lg:w-3/5 bg-black p-6 md:p-12 relative">
          <div className="absolute inset-0 opacity-75">
            <Blurhash
              hash={
                token.metadata.blurhash ||
                'UZ9ZtPzmpHv;R]ONJ6bKQ-l7Z.S_bow5$-nh'
              }
              width={`100%`}
              height={`100%`}
              resolutionX={32}
              resolutionY={32}
              punch={1}
            />
          </div>
          <div className="h-full flex items-center">
            <img
              className="object-contain w-full h-full relative z-10"
              src={parseImgUrl(token.metadata.media)}
            />
            {/* <TokenSeries metadata={metadata} /> */}
          </div>
        </div>
        <div className="flex flex-col w-full h-3/5 lg:h-full lg:w-2/5 bg-blueGray-800">
          <Scrollbars
            className="h-full"
            universal={true}
            renderView={(props) => (
              <div {...props} id="activityListScroll" className="p-4" />
            )}
          >
            <div>
              <div className="flex justify-between">
                <div>
                  <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight pr-4 break-all">
                    {token.metadata.title}
                  </h1>
                  <p className="mt-1 text-white">
                    by{' '}
                    <span className="font-semibold">
                      {token.metadata.author_ids ? (
                        <Link href={`/${token.metadata.author_ids[0]}`}>
                          <a className="text-white font-semibold border-b-2 border-transparent hover:border-white">
                            {token.metadata.author_ids[0]}
                          </a>
                        </Link>
                      ) : token.metadata.creator_id ? (
                        <Link href={`/${token.metadata.creator_id}`}>
                          <a className="text-white font-semibold border-b-2 border-transparent hover:border-white">
                            {token.metadata.creator_id}
                          </a>
                        </Link>
                      ) : (
                        <Link href={`/${token.contract_id}`}>
                          <a className="text-white font-semibold border-b-2 border-transparent hover:border-white">
                            {token.contract_id}
                          </a>
                        </Link>
                      )}
                    </span>
                  </p>
                </div>
                <div>
                  <IconDots
                    color="#ffffff"
                    className="cursor-pointer"
                    onClick={() => setShowModal('more')}
                  />
                </div>
              </div>
              <div className="flex mt-3 space-x-4">
                {tabDetail('info')}
                {/* {tabDetail('owners')} */}
                {/* {tabDetail('history')} */}
              </div>
              {activeTab === 'info' && (
                <TabInfo localToken={token} isNFT={true} />
              )}
              {activeTab === 'history' && <TabHistory localToken={token} />}
            </div>
          </Scrollbars>
          <div className="p-3">
            {near.currentUser?.accountId === token.owner_id ? (
              <Button
                onClick={() => setShowModal('transfer')}
                isFullWidth
                variant="ghost"
              >
                Transfer
              </Button>
            ) : (
              <>
                <Button variant="ghost" isFullWidth>
                  <a
                    href={`${process.env.NEXT_PUBLIC_PARAS_MARKETPLACE_URL}/token/${token.contract_id}::${token.token_series_id}/${token.token_id}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Trade on Paras Marketplace
                  </a>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      <TokenMoreModal
        show={showModal === 'more'}
        onClose={onDismissModal}
        onClickShare={onClickShare}
        onClickUpdate={onClickUpdate}
      />
      <TokenShareModal show={showModal === 'share'} onClose={onDismissModal} />
      <TokenDetailUpdateModal
        show={showModal === 'update'}
        onClose={onDismissModal}
      />
      <TokenTransfer
        show={showModal === 'transfer'}
        onClose={onDismissModal}
        data={token}
      />
    </div>
  )
}

export default TokenDetail
