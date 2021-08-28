import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import InfiniteScroll from 'react-infinite-scroll-component'

import Head from 'components/Common/Head'
import Layout from 'components/Common/Layout'
import axios from 'axios'
import { parseImgUrl } from 'utils/common'
import Token from 'components/Token/Token'

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
        <p className="text-white font-bold text-4xl mb-8">Comics</p>
        <InfiniteScroll
          dataLength={comics.length}
          next={fetchComics}
          hasMore={hasMore}
          loader={<ComicLoader />}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {comics.map((data, i) => (
              <div
                className="cursor-pointer shadow-2xl "
                key={i}
                onClick={() => router.push(`/comics/${data.comic_id}`)}
              >
                <Token
                  imgUrl={parseImgUrl(data.media, null, {
                    width: `300`,
                  })}
                  imgBlur="U0Csjj-;fQ-;%MfQfQfQfQfQfQfQ%MfQfQfQ"
                  hoverMouse={false}
                  initialRotate={{ x: 0, y: 0 }}
                  shadow="none"
                  borderRadius="8px"
                  disableFlip
                />
              </div>
            ))}
          </div>
        </InfiniteScroll>
      </div>
    </Layout>
  )
}

const ComicLoader = () => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
    {Array(8)
      .fill('')
      .map((item, idx) => (
        <div key={idx}>
          <ContentLoader
            speed={2}
            width="100%"
            height="100%"
            viewBox="0 0 275 380"
            backgroundColor="#1D1D1D"
            foregroundColor="#282828"
          >
            <rect x="0" y="0" rx="20" ry="20" width="275" height="380" />
          </ContentLoader>
        </div>
      ))}
  </div>
)

export default Comics
