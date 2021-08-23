import axios from 'axios'
import Avatar from 'components/Common/Avatar'
import Button from 'components/Common/Button'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { parseImgUrl } from 'utils/common'

const FETCH_TOKENS_LIMIT = 12

const TabOwners = ({ localToken }) => {
  const [tokens, setTokens] = useState([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isFetching, setIsFetching] = useState(false)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    if (localToken.token_type) {
      await fetchTokens()
    }
  }, [localToken])

  const fetchTokens = async () => {
    if (!hasMore || isFetching) {
      return
    }

    setIsFetching(true)
    const resp = await axios.get(`${process.env.COMIC_API_URL}/tokens`, {
      params: {
        token_type: localToken.token_type,
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
    <div className="mt-4">
      {tokens.map((token) => (
        <Owner token={token} key={token.token_id} />
      ))}
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
      const newData = resp.data.data.results[0]
      setProfile(newData)
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="bg-blueGray-900 border border-blueGray-700 mt-3 p-3 rounded-md shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Link href={`/${token.owner_id}`}>
            <a className="hover:opacity-80">
              <Avatar size="md" src={parseImgUrl(profile.imgUrl)} />
            </a>
          </Link>
          <Link href={`/${token.owner_id}`}>
            <a className="hover:opacity-80">
              <p className="ml-2 text-white font-semibold">{token.owner_id}</p>
            </a>
          </Link>
        </div>
        <div className="flex">
          <Link href={`/${token.token_type}/${token.token_id}`}>
            <a className="hover:opacity-80">
              <p className="text-white font-semibold">
                Edition #{token.edition_id}
              </p>
            </a>
          </Link>
        </div>
      </div>
      {/* <div className="mt-2 flex items-center justify-between">
        <p className="text-white text-sm opacity-80">On sale for 5 Ⓝ</p>
        <Button size="sm" className="w-20">
          Buy
        </Button>
      </div> */}
    </div>
  )
}

export default TabOwners
