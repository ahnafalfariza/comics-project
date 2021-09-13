import { useEffect, useState } from 'react'
import axios from 'axios'

import Layout from 'components/Common/Layout'
import Head from 'components/Common/Head'
import ComicInfo from 'components/Comic/ComicInfo'

import { parseImgUrl } from 'utils/common'
import { FETCH_TOKENS_LIMIT } from 'constants/constant'
import CardList from 'components/Token/CardList'

const Collectibles = ({ comicInfo }) => {
  const [tokens, setTokens] = useState([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isFetching, setIsFetching] = useState(false)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchTokens(true)
  }, [])

  const fetchTokens = async (initial) => {
    const _tokens = initial ? [] : tokens
    const _page = initial ? 0 : page
    const _hasMore = initial ? true : hasMore

    if (!_hasMore || isFetching) {
      return
    }

    setIsFetching(true)

    const params = {
      category: `collectible`,
      comic_id: comicInfo.comic_id,
      __skip: _page * FETCH_TOKENS_LIMIT,
      __limit: FETCH_TOKENS_LIMIT,
    }

    const resp = await axios.get(`${process.env.COMIC_API_URL}/token_types`, {
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

  return (
    <Layout>
      <Head
        title={'Get collectibles from ' + comicInfo.title}
        description={comicInfo.description}
        image={parseImgUrl(comicInfo.media)}
      />
      <ComicInfo data={comicInfo} defaultIndex={1} />
      <div className="mt-4 max-w-5xl m-auto">
        <CardList tokens={tokens} hasMore={hasMore} fetchTokens={fetchTokens} />
      </div>
    </Layout>
  )
}

export default Collectibles

export async function getServerSideProps({ params }) {
  const response = await axios.get(
    `${process.env.COMIC_API_URL}/comics?comic_id=${params.id}`
  )
  const comicInfo = response.data.data.results[0] || null

  return {
    props: { comicInfo },
  }
}
