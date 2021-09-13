import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import axios from 'axios'

import Layout from 'components/Common/Layout'
import Head from 'components/Common/Head'
import ComicInfo from 'components/Comic/ComicInfo'
import ChapterLists from 'components/Chapter/ChapterLists'
import { FETCH_CHAPTERS_LIMIT } from 'constants/constant'
import { parseImgUrl } from 'utils/common'
import near from 'lib/near'

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
  chapterInfo,
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
  }, [router.query.id, near.token])

  const fetchChapter = async (initial = false) => {
    const _hasMore = initial ? true : hasMore
    const _page = initial ? 0 : page
    const _chapters = initial ? [] : chapters

    if (!_hasMore || isFetching) {
      return
    }

    setIsFetching(true)
    const response = await axios.get(`${process.env.COMIC_API_URL}/chapters`, {
      params: {
        comic_id: router.query.id,
        __skip: _page * FETCH_CHAPTERS_LIMIT,
        __limit: FETCH_CHAPTERS_LIMIT,
      },
    })
    const newData = response.data.data
    const newChapters = [..._chapters, ...newData.results]
    setChapters(newChapters)
    setPage(_page + 1)

    if (newData.results.length < FETCH_CHAPTERS_LIMIT) {
      setHasMore(false)
    } else {
      setHasMore(true)
    }
    setIsFetching(false)
  }

  return (
    <Layout>
      <Head
        title={chapterInfo ? chapterInfo.metadata.title : comicInfo.title}
        description={
          chapterInfo ? chapterInfo.metadata.description : comicInfo.description
        }
        image={
          chapterInfo
            ? parseImgUrl(chapterInfo.metadata.media)
            : parseImgUrl(comicInfo.media)
        }
      />
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

export async function getServerSideProps({ params, query }) {
  const response = await axios.get(
    `${process.env.COMIC_API_URL}/comics?comic_id=${params.id}`
  )
  const comicInfo = response.data.data.results[0] || null

  let chapterInfo = null
  if (query.chapterId) {
    const response = await axios.get(`${process.env.COMIC_API_URL}/chapters`, {
      params: {
        comic_id: params.id,
        chapter_id: query.chapterId,
      },
    })
    chapterInfo = response.data.data.results[0] || null
  }

  return {
    props: { comicInfo, chapterInfo },
  }
}
