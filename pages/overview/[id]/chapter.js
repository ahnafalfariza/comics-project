import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

import Layout from 'components/Layout'
import Head from 'components/Common/Head'
import ChapterInfo from 'components/Chapter/ChapterInfo'
import ChapterLists from 'components/Chapter/ChapterLists'

import { COMIC_CHAPTER_DATA, COMIC_OVERVIEW_DATA } from 'constants/dummy'

const LIMIT = 12

const Collection = ({ chapterInfo, accountId }) => {
  const router = useRouter()

  const scrollChapter = `${router.query.id}::collection`

  const [chapters, setChapters] = useState([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isFetching, setIsFetching] = useState(false)

  // eslint-disable-next-line
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
    <Layout>
      <Head title={chapterInfo.title} description={chapterInfo.description} />
      <ChapterInfo data={chapterInfo} />
      <div className="mb-9 px-4">
        <ChapterLists
          name={scrollChapter}
          chapters={chapters}
          fetchData={fetchChapter}
          hasMore={hasMore}
        />
      </div>
    </Layout>
  )
}

export default Collection

export async function getServerSideProps({ params }) {
  const chapterRes = COMIC_OVERVIEW_DATA
  const chapterInfo = chapterRes.data.results[0] || null
  return {
    props: { chapterInfo, accountId: params.id },
  }
}
