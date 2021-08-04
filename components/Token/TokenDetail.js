import Link from 'next/link'
import { useState } from 'react'
import { Blurhash } from 'react-blurhash'
import Scrollbars from 'react-custom-scrollbars-2'

import Button from '../Common/Button'
import Token from './Token'
import { IconDots } from '../Icons'
import { TOKEN_DATA } from 'constants/dummy'
import { parseImgUrl } from 'utils/common'
import TabInfo from './Tabs/TabInfo'
import TabOwners from './Tabs/TabOwners'
import TabHistory from './Tabs/TabHistory'

const TokenDetail = ({ localToken = TOKEN_DATA }) => {
  const [activeTab, setActiveTab] = useState('info')

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

  return (
    <div className="max-w-6xl m-auto">
      <div
        className="flex flex-wrap h-full rounded-lg overflow-hidden"
        style={{ height: `85vh` }}
      >
        <div className="w-full h-1/2 lg:h-full lg:w-3/5 bg-dark-primary-1 p-12 relative">
          <div className="absolute inset-0 opacity-75">
            <Blurhash
              hash={
                localToken.metadata.blurhash ||
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
            <Token
              imgUrl={parseImgUrl(localToken.metadata.image, null, {
                useOriginal: true,
              })}
              imgBlur={localToken.metadata.blurhash}
              token={{
                name: localToken.metadata.name,
                collection: localToken.metadata.collection,
                description: localToken.metadata.description,
                creatorId: localToken.creatorId,
                supply: localToken.supply,
                tokenId: localToken.tokenId,
                createdAt: localToken.createdAt,
              }}
              initialRotate={{
                x: 15,
                y: 15,
              }}
            />
          </div>
        </div>
        <div className="flex flex-col w-full h-1/2 lg:h-full lg:w-2/5 bg-blueGray-800">
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
                    {localToken.metadata.name}
                  </h1>
                  <p className="text-white">
                    by{' '}
                    <span className="font-semibold">
                      <Link href={`/${localToken.creatorId}`}>
                        <a className="text-white font-semibold border-b-2 border-transparent hover:border-white">
                          {localToken.creatorId}
                        </a>
                      </Link>
                    </span>
                  </p>
                </div>
                <div>
                  <IconDots color="#ffffff" />
                </div>
              </div>
              <div className="flex mt-3 space-x-4">
                {tabDetail('info')}
                {tabDetail('owners')}
                {tabDetail('history')}
              </div>
              {activeTab === 'info' && <TabInfo localToken={localToken} />}
              {activeTab === 'owners' && <TabOwners localToken={localToken} />}
              {activeTab === 'history' && (
                <TabHistory localToken={localToken} />
              )}
            </div>
          </Scrollbars>
          <div className="p-3">
            <Button isFullWidth>Buy for 1 Ⓝ</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TokenDetail
