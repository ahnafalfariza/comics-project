import Link from 'next/link'
import ReactLinkify from 'react-linkify'

const TabInfo = ({ localToken }) => {
  return (
    <div>
      <div className="flex bg-blueGray-900 border border-blueGray-700 mt-4 p-3 rounded-md shadow-md">
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
      </div>
      <div className="bg-blueGray-900 border border-blueGray-700 mt-4 p-3 rounded-md shadow-md">
        <p className="text-sm text-white font-bold">Description</p>
        <ReactLinkify
          componentDecorator={(decoratedHref, decoratedText, key) => (
            <a target="blank" href={decoratedHref} key={key}>
              {decoratedText}
            </a>
          )}
        >
          <p
            className="text-gray-100 whitespace-pre-line"
            style={{
              wordBreak: 'break-word',
            }}
          >
            {localToken.metadata.description.replace(/\n\s*\n\s*\n/g, '\n\n')}
          </p>
        </ReactLinkify>
      </div>
      <div className="flex items-center bg-blueGray-900 border border-blueGray-700 mt-4 p-3 rounded-md shadow-md space-x-3">
        <div className="w-1/2">
          <p className="text-sm text-white font-bold">Created</p>
          <p className="text-gray-100">
            10 August 2021
            {/* {parseDate(localToken.metadata.createdAt)} */}
          </p>
        </div>
        <div className="w-1/2">
          <p className="text-sm text-white font-bold">Supply</p>
          <p className="text-gray-100">{localToken.supply} pcs</p>
        </div>
      </div>
    </div>
  )
}

export default TabInfo
