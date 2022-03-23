import axios from 'axios'
import Avatar from 'components/Common/Avatar'
import { sentryCaptureException } from 'lib/sentry'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { parseImgUrl } from 'utils/common'

const FETCH_TOKENS_LIMIT = 30

const TabOwners = ({ localToken }) => {
  const [tokens, setTokens] = useState([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isFetching, setIsFetching] = useState(false)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    if (localToken.token_series_id) {
      await fetchTokens()
    }
  }, [localToken])

  const fetchTokens = async () => {
    console.log('masuk fetch token')

    if (!hasMore || isFetching) {
      return
    }

    setIsFetching(true)
    const resp = await axios.get(`${process.env.COMIC_API_URL}/tokens`, {
      params: {
        token_series_id: localToken.token_series_id,
        __skip: page * FETCH_TOKENS_LIMIT,
        __limit: FETCH_TOKENS_LIMIT,
      },
    })
    const newData = resp.data.data

    const newTokens = [...(tokens || []), ...newData.results]
    setTokens(newTokens)
    setPage(page + 1)
    if (newData.results.length < FETCH_TOKENS_LIMIT) {
      setHasMore(false)
    } else {
      setHasMore(true)
    }
    setIsFetching(false)
  }

  return (
    <div>
      <InfiniteScroll
        dataLength={tokens.length}
        next={fetchTokens}
        hasMore={hasMore}
        className="pb-4"
        scrollableTarget="TokenSeriesScroll"
      >
        {tokens.map((token) => (
          <Owner token={token} key={token.token_id} />
        ))}
      </InfiniteScroll>
    </div>
  )
}

const Owner = ({ token = {} }) => {
  const [profile, setProfile] = useState({})

  useEffect(() => {
    if (token.owner_id) {
      fetchOwnerProfile()
    }
  }, [token.owner_id])

  const fetchOwnerProfile = async () => {
    try {
      const resp = await axios.get(`${process.env.PARAS_API_URL}/profiles`, {
        params: {
          accountId: token.owner_id,
        },
      })
      const newData = resp.data.data.results[0] || {}
      setProfile(newData)
    } catch (err) {
      sentryCaptureException(err)
    }
  }

  return (
    <div className="bg-white border border-blueGray-200 mt-3 p-3 rounded-md shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link href={`/${token.owner_id}`}>
            <a className="hover:opacity-80">
              <Avatar
                size="md"
                src={parseImgUrl(profile.imgUrl)}
                className="align-bottom"
              />
            </a>
          </Link>
          <Link href={`/${token.owner_id}`}>
            <a className="hover:opacity-80">
              <p className="ml-2 text-black font-semibold">{token.owner_id}</p>
            </a>
          </Link>
        </div>
        <div className="flex">
          <Link href={`/token/${token.token_series_id}/${token.token_id}`}>
            <a className="hover:opacity-80">
              <p className="text-black font-semibold">
                Edition #{token.edition_id}
              </p>
            </a>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default TabOwners
