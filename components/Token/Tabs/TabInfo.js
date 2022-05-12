import TokenRoyaltyModal from 'components/Modal/TokenRoyaltyModal'
import Link from 'next/link'
import { useState } from 'react'
import ReactLinkify from 'react-linkify'

const TabInfo = ({ localToken, isNFT }) => {
  const [showModal, setShowModal] = useState('')

  const supply = localToken.metadata.copies
    ? `${localToken.metadata.copies}pcs`
    : `Open Edition`
  return (
    <div>
      {/* <div className="flex bg-blueGray-900 border border-blueGray-700 mt-4 p-3 rounded-md shadow-md">
        <div>
          <p className="text-sm text-white font-bold">Collection</p>
          <Link
            href={{
              pathname: '/[id]/collection/[collectionName]',
              query: {
                collectionName: encodeURIComponent(
                  localToken.metadata.collection
                ),
                id: localToken.creatorId,
              },
            }}
          >
            <a className="text-gray-100 font-semibold border-b-2 border-transparent hover:border-gray-100">
              {localToken.metadata.collection}
            </a>
          </Link>
        </div>
      </div> */}
      <div className="bg-white border border-blueGray-200 mt-4 p-3 rounded-md shadow-md">
        <p className="text-sm text-black font-bold">Description</p>
        <ReactLinkify
          componentDecorator={(decoratedHref, decoratedText, key) => (
            <a target="blank" href={decoratedHref} key={key}>
              {decoratedText}
            </a>
          )}
        >
          <p
            className="text-black whitespace-pre-line"
            style={{
              wordBreak: 'break-word',
            }}
          >
            {localToken.metadata.description.replace(/\n\s*\n\s*\n/g, '\n\n')}
          </p>
        </ReactLinkify>
      </div>
      {isNFT && (
        <div className="flex bg-white border border-blueGray-200 mt-4 p-3 rounded-md shadow-md">
          <div>
            <p className="text-sm text-black font-bold">Owner</p>
            <Link href={`/${localToken.owner_id}`}>
              <a className="text-black font-semibold hover:opacity-80">
                {localToken.owner_id}
              </a>
            </Link>
          </div>
        </div>
      )}
      {localToken.royalty && Object.keys(localToken.royalty).length !== 0 && (
        <div className="flex bg-white border border-blueGray-200 mt-4 p-3 rounded-md shadow-md">
          <div>
            <p className="text-sm text-black font-bold">Royalty</p>
            <div
              className="flex items-center cursor-pointer hover:opacity-80"
              onClick={() => setShowModal('royalty')}
            >
              <p className="text-black font-semibold">
                {Object.keys(localToken.royalty).length !== 0
                  ? `${Object.values(localToken.royalty)[0] / 100} %`
                  : `None`}
              </p>
              <div className="pl-1 pb-0.5">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M0 8C0 12.4183 3.58172 16 8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8ZM14 8C14 11.3137 11.3137 14 8 14C4.68629 14 2 11.3137 2 8C2 4.68629 4.68629 2 8 2C11.3137 2 14 4.68629 14 8ZM7 10V9.5C7 8.28237 7.42356 7.68233 8.4 6.95C8.92356 6.55733 9 6.44904 9 6C9 5.44772 8.55229 5 8 5C7.44772 5 7 5.44772 7 6H5C5 4.34315 6.34315 3 8 3C9.65685 3 11 4.34315 11 6C11 7.21763 10.5764 7.81767 9.6 8.55C9.07644 8.94267 9 9.05096 9 9.5V10H7ZM9.00066 11.9983C9.00066 12.5506 8.55279 12.9983 8.00033 12.9983C7.44786 12.9983 7 12.5506 7 11.9983C7 11.4461 7.44786 10.9983 8.00033 10.9983C8.55279 10.9983 9.00066 11.4461 9.00066 11.9983Z"
                    fill="rgb(0, 0, 0)"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="flex bg-white border border-blueGray-200 mt-4 p-3 rounded-md shadow-md">
        <div>
          <p className="text-sm text-black font-bold">Edition</p>
          <Link href={`/token/${localToken.token_series_id}`}>
            <a className="text-black font-semibold hover:opacity-80">
              #{localToken.edition_id} of {supply}
            </a>
          </Link>
        </div>
      </div>
      {showModal === 'royalty' && (
        <TokenRoyaltyModal
          show={true}
          royalty={localToken.royalty}
          onClose={() => setShowModal('')}
        />
      )}
    </div>
  )
}

export default TabInfo
