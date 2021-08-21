import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import axios from 'axios'

import Layout from 'components/Layout'
import Head from 'components/Common/Head'
import ComicInfo from 'components/Comic/ComicInfo'
import ChapterLists from 'components/Chapter/ChapterLists'

import { FETCH_CHAPTER_LIMIT } from 'constants'

const Collection = ({
  comicInfo = {
    comic_id: 'naruto',
    title: 'Naruto',
    description: 'Lorum ipsum dolor amet',
    author_ids: ['afiq.testnet'],
    issued_at: '',
    media: 'bafybeiahl55gjwifng26oya77sw5nvtiqevc5jcxai3u7atupyiyyry2ji',
    media_cover: 'bafybeiahl55gjwifng26oya77sw5nvtiqevc5jcxai3u7atupyiyyry2ji',
  },
}) => {
  const router = useRouter()
  const scrollChapter = `${router.query.id}::collection`

  const [chapters, setChapters] = useState([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isFetching, setIsFetching] = useState(false)

  useEffect(() => {
    if (router.query.id) {
      fetchChapter(true)
    }
  }, [router.query.id])

  const fetchChapter = async () => {
    if (!hasMore || isFetching) {
      return
    }

    setIsFetching(true)
    const response = await axios.get(`${process.env.COMIC_API_URL}/chapters`, {
      comic_id: router.query.id,
      __skip: page * FETCH_CHAPTER_LIMIT,
      __limit: FETCH_CHAPTER_LIMIT,
    })
    const newData = response.data.data
    const newChapters = [...chapters, ...newData.results]
    setChapters(newChapters)
    setPage(page + 1)

    if (newData.results.length < FETCH_CHAPTER_LIMIT) {
      setHasMore(false)
    } else {
      setHasMore(true)
    }
    setIsFetching(false)
  }

  console.log('chapter', chapters)
  return (
    <Layout>
      <Head title={comicInfo.title} description={comicInfo.description} />
      <ComicInfo data={comicInfo} />
      <ChapterLists
        name={scrollChapter}
        chapters={chapters}
        fetchData={fetchChapter}
        hasMore={hasMore}
      />
    </Layout>
  )
}

export default Collection

export async function getServerSideProps({ params }) {
  const response = await axios.get(`${process.env.COMIC_API_URL}/comics`, {
    comic_id: params.id,
  })
  const comicInfo = response.data.data.results[0] || null

  return {
    props: { comicInfo },
  }
}
