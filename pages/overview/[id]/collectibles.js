import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import axios from 'axios'

import Layout from 'components/Layout'
import Head from 'components/Common/Head'
import ComicInfo from 'components/Comic/ComicInfo'
import ChapterCollectibles from 'components/Token/TokenList'

import { COMIC_COLLECTIBLES_DATA } from 'constants/dummy'

const LIMIT = 12

const Collectibles = ({ comicInfo }) => {
  const router = useRouter()

  const scrollCollectibles = `${router.query.id}::collectibles`

  const [tokens, setTokens] = useState([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isFetching, setIsFetching] = useState(false)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    await fetchOwnerTokens()
  }, [router.query.id])

  const fetchOwnerTokens = async () => {
    if (!hasMore || isFetching) {
      return
    }

    setIsFetching(true)
    const waitFor = (delay) =>
      new Promise((resolve) => setTimeout(resolve, delay))
    await waitFor(2000)
    const newData = COMIC_COLLECTIBLES_DATA

    const newTokens = [...(tokens || []), ...newData.results]
    setTokens(newTokens)
    setPage(page + 1)
    if (newData.results.length < LIMIT) {
      setHasMore(false)
    } else {
      setHasMore(true)
    }
    setIsFetching(false)
  }

  return (
    <Layout>
      <Head title={comicInfo.title} description={comicInfo.description} />
      <ComicInfo data={comicInfo} defaultIndex={1} />
      <ChapterCollectibles
        name={scrollCollectibles}
        tokens={tokens}
        fetchData={fetchOwnerTokens}
        hasMore={hasMore}
      />
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
