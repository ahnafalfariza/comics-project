import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import InfiniteScroll from 'react-infinite-scroll-component'

import Head from 'components/Common/Head'
import Layout from 'components/Common/Layout'
import axios from 'axios'
import ComicItem from 'components/Comic/ComicItem'

import { FETCH_COMICS_LIMIT } from 'constants/constant'
import ContentLoader from 'react-content-loader'

const Comics = () => {
  const router = useRouter()

  const [comics, setComics] = useState([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isFetching, setIsFetching] = useState(false)

  useEffect(() => {
    fetchComics()
  }, [])

  const fetchComics = async () => {
    if (!hasMore || isFetching) {
      return
    }

    setIsFetching(true)
    const response = await axios.get(`${process.env.COMIC_API_URL}/comics`, {
      params: {
        comic_id: router.query.id,
        __skip: page * FETCH_COMICS_LIMIT,
        __limit: FETCH_COMICS_LIMIT,
      },
    })
    const newData = response.data.data
    const newChapters = [...comics, ...newData.results]
    setComics(newChapters)
    setPage(page + 1)

    if (newData.results.length < FETCH_COMICS_LIMIT) {
      setHasMore(false)
    } else {
      setHasMore(true)
    }
    setIsFetching(false)
  }

  return (
    <Layout>
      <Head title="Comics" />
      <div className="max-w-6xl m-auto p-4 py-8">
        <p className="text-black font-bold text-4xl mb-3">Comics</p>
        <div className="w-16 h-3 mb-14 bg-primary"></div>
        <InfiniteScroll
          dataLength={comics.length}
          next={fetchComics}
          hasMore={hasMore}
          loader={<ComicLoader />}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 overflow-hidden">
            {comics.map((data, i) => (
              <ComicItem data={data} key={i} />
            ))}
          </div>
        </InfiniteScroll>
      </div>
    </Layout>
  )
}

const ComicLoader = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-8">
    {Array(8)
      .fill('')
      .map((item, idx) => (
        <div key={idx}>
          <ContentLoader
            speed={2}
            width="100%"
            height="100%"
            viewBox="0 0 275 380"
            backgroundColor="#F4F4F5"
            foregroundColor="#E4E4E7"
          >
            <rect x="0" y="0" rx="0" ry="0" width="275" height="380" />
          </ContentLoader>
        </div>
      ))}
  </div>
)

export default Comics
