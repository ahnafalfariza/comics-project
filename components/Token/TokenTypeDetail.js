import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Blurhash } from 'react-blurhash'
import Scrollbars from 'react-custom-scrollbars-2'
import { useRouter } from 'next/router'
import { formatNearAmount } from 'near-api-js/lib/utils/format'

import Button from '../Common/Button'
import { IconDots } from '../Icons'
import TabInfo from './Tabs/TabInfo'
import TabOwners from './Tabs/TabOwners'
import TabHistory from './Tabs/TabHistory'

import TokenBuyModal from 'components/Modal/TokenBuyModal'
import TokenMoreModal from 'components/Modal/TokenMoreModal'
import TokenShareModal from 'components/Modal/TokenShareModal'
import TokenDetailUpdateModal from 'components/Modal/TokenDetailUpdateModal'
import TokenType from './TokenType'
import useStore from 'lib/store'
import LoginModal from 'components/Modal/LoginModal'
import near from 'lib/near'

const TokenTypeDetail = ({ token, metadata, className }) => {
  const [activeTab, setActiveTab] = useState('info')
  const [showModal, setShowModal] = useState(null)
  const router = useRouter()

  const isOwned = useStore((state) => state.isOwned)
  const fetchOwned = useStore((state) => state.fetchOwned)

  useEffect(() => {
    fetchOwned(token.token_type)
  }, [fetchOwned, token.token_type])

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

  const onClickBuy = () => {
    if (!near.currentUser) {
      setShowModal('notLogin')
      return
    }
    setShowModal('confirmBuy')
  }

  const onClickRead = () => {
    router.push({
      pathname: `/viewer/${token.comic_id}/${token.chapter_id}`,
    })
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
            <TokenType metadata={metadata} />
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
                      <Link href={`/${token.metadata.author_ids[0]}`}>
                        <a className="text-white font-semibold border-b-2 border-transparent hover:border-white">
                          {token.metadata.author_ids[0]}
                        </a>
                      </Link>
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
                {tabDetail('owners')}
                {/* {tabDetail('history')} */}
              </div>
              {activeTab === 'info' && <TabInfo localToken={token} />}
              {activeTab === 'owners' && <TabOwners localToken={token} />}
              {activeTab === 'history' && <TabHistory localToken={token} />}
            </div>
          </Scrollbars>
          <div className="p-3">
            {isOwned && isOwned === 'not_owned' && (
              <Button onClick={onClickBuy} isFullWidth>
                {token.price === '0'
                  ? 'Free'
                  : `Buy for ${formatNearAmount(token.price)} Ⓝ`}
              </Button>
            )}
            {isOwned && isOwned === 'owned' && (
              <Button onClick={onClickRead} isFullWidth>
                Read
              </Button>
            )}
          </div>
        </div>
      </div>
      <TokenBuyModal
        show={showModal === 'confirmBuy'}
        onClose={onDismissModal}
        data={token}
      />
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
      <LoginModal show={showModal === 'notLogin'} onClose={onDismissModal} />
    </div>
  )
}

export default TokenTypeDetail
