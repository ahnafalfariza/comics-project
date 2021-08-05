import Nav from 'components/Common/Nav'
import ChapterInfo from 'components/Chapter/ChapterInfo'
import ChapterLists from 'components/Chapter/ChapterLists'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { COMIC_CHAPTER_DATA, COMIC_OVERVIEW_DATA } from 'constants/dummy'

const LIMIT = 12

const collection = ({ chapterInfo, accountId }) => {
  const router = useRouter()

  const scrollChapter = `${router.query.id}::collection`

  const [chapters, setChapters] = useState([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isFetching, setIsFetching] = useState(false)

  useEffect(async () => {
    await fetchChapter(true)
  }, [router.query.id])

  const fetchChapter = async () => {
    if (!hasMore || isFetching) {
      return
    }

    setIsFetching(true)
    const waitFor = (delay) =>
      new Promise((resolve) => setTimeout(resolve, delay))
    await waitFor(2000)

    const newData = COMIC_CHAPTER_DATA

    const newChapters = [...(chapters || []), ...newData.results]
    setChapters(newChapters)
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
      <ChapterInfo data={chapterInfo} />
      <div className="mb-9 px-4">
        <ChapterLists
          name={scrollChapter}
          chapters={chapters}
          fetchData={fetchChapter}
          hasMore={hasMore}
        />
      </div>
    </div>
  )
}

export default collection

export async function getServerSideProps({ params }) {
  const chapterRes = COMIC_OVERVIEW_DATA
  const chapterInfo = chapterRes.data.results[0] || null
  return {
    props: { chapterInfo, accountId: params.id },
  }
}
