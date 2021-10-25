import CardListLoader from 'components/Token/CardListLoader'
import Token from 'components/Token/Token'
import { FETCH_TOKENS_LIMIT } from 'constants/constant'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import router from 'next/router'
import InfiniteScroll from 'react-infinite-scroll-component'
import { parseImgUrl } from 'utils/common'
import Link from 'next/link'

const ChapterListMarket = ({
  tokens,
  fetchTokens,
  hasMore,
  containerClassName = '',
}) => {
  return (
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
              className={`w-full md:w-1/3 lg:w-1/4 flex-shrink-0 p-8 md:p-4 relative ${containerClassName}`}
            >
              <div className="w-full m-auto">
                <Token
                  imgUrl={parseImgUrl(token.metadata.media, null, {
                    width: `300`,
                  })}
                  onClick={() => {
                    router.push(`/token/${token.token_series_id}`)
                  }}
                  disableFlip
                  shadow="none"
                  imgBlur={token.metadata.blurhash}
                  token={token}
                  initialRotate={{
                    x: 0,
                    y: 0,
                  }}
                />
              </div>
              <div className="text-center">
                <div className="mt-4">
                  <div className="p-2">
                    <div className="text-gray-100 text-2xl">
                      {token.price ? (
                        token.price !== '0' ? (
                          <div>
                            <p className="text-gray-400 text-xs">Start From</p>
                            <div>{`${formatNearAmount(token.price)} Ⓝ`}</div>
                          </div>
                        ) : (
                          <div>
                            <span className="text-gray-100">Free</span>
                          </div>
                        )
                      ) : (
                        <div>
                          <span className="text-gray-100">Not Available</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center mt-2 text-sm">
                <Link
                  href={`/token/${token.token_series_id}`}
                  scroll={false}
                  shallow
                >
                  <a className="inline-block text-gray-100 cursor-pointer text-base font-semibold border-b-2 border-gray-100 mb-4">
                    See Details
                  </a>
                </Link>
              </div>
            </div>
          )
        })}
      </div>
    </InfiniteScroll>
  )
}

export default ChapterListMarket
