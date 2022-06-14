import Layout from 'components/Common/Layout'
import Head from 'components/Common/Head'
import Profile from 'components/Common/Profile'
import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useRouter } from 'next/router'
import axios from 'axios'
import Token from 'components/Token/Token'
import { parseImgUrl } from 'utils/common'
import Link from 'next/link'
import { FETCH_TOKENS_LIMIT } from 'constants/constant'
import CardListLoader from 'components/Token/CardListLoader'
import BuyChapterModal from 'components/Modal/BuyChapterModal'
import useStore from 'lib/store'
import near from 'lib/near'

const ProfilePageLiked = ({ profile }) => {
  const router = useRouter()
  const [tokens, setTokens] = useState([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isFetching, setIsFetching] = useState(false)
  const [userData, setUserData] = useState(profile)
  const [chapterOpen, setChapterOpen] = useState(null)
  const { currentUser } = useStore()

  useEffect(() => {
    if (currentUser) fetchTokens(true)
  }, [router, currentUser])

  const fetchTokens = async (initial) => {
    const _tokens = initial ? [] : tokens
    const _page = initial ? 0 : page
    const _hasMore = initial ? true : hasMore

    if (!_hasMore || isFetching) {
      return
    }

    setIsFetching(true)

    const params = {
      __skip: _page * FETCH_TOKENS_LIMIT,
      __limit: FETCH_TOKENS_LIMIT,
      liked_by: profile.accountId,
    }

    const resp = await axios.get(`${process.env.COMIC_API_URL}/chapters`, {
      params,
    })
    const newData = resp.data.data

    const newTokens = [..._tokens, ...newData.results]
    setTokens(newTokens)
    setPage(_page + 1)
    if (newData.results.length < FETCH_TOKENS_LIMIT) {
      setHasMore(false)
    } else {
      setHasMore(true)
    }
    setIsFetching(false)
  }

  const onClickChapter = (data) => {
    setChapterOpen(data)
    router.push(
      {
        query: {
          ...router.query,
          chapterId: data.metadata.chapter_id,
        },
      },
      '',
      {
        scroll: false,
        shalllow: true,
      }
    )
  }

  const onCloseChapterDetail = () => {
    setChapterOpen(null)
    router.replace(router.asPath.split('?')[0], '', {
      scroll: false,
      shalllow: true,
    })
  }

  return (
    <Layout>
      <Head title={`${profile.accountId}`} />
      <Profile userData={userData} setUserData={setUserData} />
      <div className="max-w-5xl mx-auto pt-8 pb-16 -mt-8">
        {tokens.length === 0 && !hasMore && (
          <div className="w-full">
            <div className="m-auto text-2xl text-gray-600 font-semibold py-32 text-center">
              <div className="w-40 m-auto">
                <img src="/cardstack.png" className="opacity-75" />
              </div>
              <p className="mt-4">There is no chapters that you like</p>
            </div>
          </div>
        )}
        {currentUser ? (
          <InfiniteScroll
            dataLength={tokens.length}
            next={fetchTokens}
            hasMore={hasMore}
            loader={<CardListLoader size={FETCH_TOKENS_LIMIT} />}
          >
            <div className="flex flex-wrap select-none">
              {tokens.map((token) => {
                return (
                  <div
                    key={token.token_series_id}
                    className={`w-full md:w-1/3 lg:w-1/4 flex-shrink-0 p-8 md:p-4 relative`}
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
                        shadow="special"
                        imgBlur={token.metadata.blurhash}
                        token={token}
                        initialRotate={{
                          x: 0,
                          y: 0,
                        }}
                      />
                    </div>
                    <div className="text-center">
                      <div className="mt-2">
                        <div className="">{token.metadata.title}</div>
                      </div>
                    </div>
                    <div className="text-center mt-2 text-sm">
                      <Link
                        href={`/comics/${token.metadata.comic_id}/chapter?chapterId=${token.metadata.chapter_id}`}
                      >
                        <a
                          className="inline-block text-black cursor-pointer hover:text-opacity-80 text-base font-semibold mb-4"
                          onClick={(e) => {
                            e.preventDefault()
                            onClickChapter(token)
                          }}
                        >
                          See Details
                        </a>
                      </Link>
                    </div>
                  </div>
                )
              })}
            </div>
          </InfiniteScroll>
        ) : (
          <div className="text-center mt-40">
            Please{' '}
            <span
              className="text-primary cursor-pointer hover:underline"
              onClick={() => near.signIn()}
            >
              login
            </span>{' '}
            to see list of liked comics
          </div>
        )}
        <BuyChapterModal
          active={router.query.chapterId}
          data={chapterOpen}
          onClose={onCloseChapterDetail}
        />
      </div>
    </Layout>
  )
}

export async function getServerSideProps({ params }) {
  const response = await axios.get(
    `${process.env.PARAS_API_URL}/profiles?accountId=${params.userId}`
  )

  return {
    props: {
      profile: response.data.data.results[0] || {
        accountId: params.userId,
      },
    },
  }
}

export default ProfilePageLiked
