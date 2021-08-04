import Nav from 'components/common/Nav'
import ChapterInfo from 'components/Chapter/ChapterInfo'
import ChapterCollectibles from 'components/Chapter/ChapterCollectibles'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { COMIC_COLLECTIBLES_DATA, COMIC_OVERVIEW_DATA } from 'constants/dummy'

const LIMIT = 12

const collectibles = ({ chapterInfo, accountId }) => {
  const router = useRouter()

  const scrollCollectibles = `${router.query.id}::collectibles`

  const [tokens, setTokens] = useState([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isFetching, setIsFetching] = useState(false)

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
    <div className="min-h-screen">
      <Nav />
      <ChapterInfo data={chapterInfo} defaultIndex={1} />
      <ChapterCollectibles
        name={scrollCollectibles}
        tokens={tokens}
        fetchData={fetchOwnerTokens}
        hasMore={hasMore}
      />
    </div>
  )
}

export default collectibles

export async function getServerSideProps({ params }) {
  const chapterRes = COMIC_OVERVIEW_DATA
  const chapterInfo = chapterRes.data.results[0] || null
  return {
    props: { chapterInfo, accountId: params.id },
  }
}
