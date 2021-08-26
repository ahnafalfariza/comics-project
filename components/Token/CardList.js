import { useRef } from 'react'
import { parseImgUrl } from 'utils/common'
import { useRouter } from 'next/router'
import InfiniteScroll from 'react-infinite-scroll-component'
import TokenDetailModal from './TokenDetailModal'
import Card from './Card'
import CardListLoader from './CardListLoader'

const FETCH_TOKENS_LIMIT = 8

const CardList = ({
  tokens,
  hasMore,
  fetchTokens,
  containerClassName = '',
}) => {
  const router = useRouter()
  const containerRef = useRef()

  return (
    <div ref={containerRef} className="overflow-x-hidden max-w-6xl mx-auto">
      <TokenDetailModal tokens={tokens} />
      {tokens.length === 0 && !hasMore && (
        <div className="w-full">
          <div className="m-auto text-2xl text-gray-600 font-semibold py-32 text-center">
            <div className="w-40 m-auto">
              <img src="/cardstack.png" className="opacity-75" />
            </div>
            <p className="mt-4">No Tokens</p>
          </div>
        </div>
      )}
      <InfiniteScroll
        dataLength={tokens.length}
        next={fetchTokens}
        hasMore={hasMore}
        loader={
          <CardListLoader
            size={FETCH_TOKENS_LIMIT}
            className={containerClassName}
          />
        }
      >
        <div className="flex flex-wrap select-none">
          {tokens.map((token) => {
            return (
              <div
                key={token.token_id}
                className={`w-1/2 md:w-1/3 lg:w-1/4 flex-shrink-0 p-2 md:p-4 relative ${containerClassName}`}
              >
                <div className="w-full m-auto">
                  <Card
                    imgUrl={parseImgUrl(token.metadata.media, null, {
                      width: `300`,
                    })}
                    onClick={() => {
                      router.push(`/token/${token.token_type}`)
                    }}
                    imgBlur={token.metadata.blurhash}
                    token={token}
                    initialRotate={{
                      x: 0,
                      y: 0,
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </InfiniteScroll>
    </div>
  )
}

export default CardList
