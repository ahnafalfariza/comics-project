import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

import Head from 'components/Common/Head'
import Layout from 'components/Common/Layout'
import axios from 'axios'
import ComicItem from 'components/Comic/ComicItem'

import { FETCH_COMICS_LIMIT } from 'constants/constant'
import { ComicListLoader } from 'components/Comic/ComicListLoader'
import ComicList from 'components/Comic/ComicList'
import Link from 'next/link'

const Comics = () => {
  const [comics, setComics] = useState([])
  const [comicsOneShot, setComicsOneShot] = useState([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isFetching, setIsFetching] = useState(false)

  useEffect(() => {
    fetchComics()
    fetchComicsOneshot()
  }, [])

  const fetchComicsOneshot = async () => {
    const response = await axios.get(`${process.env.COMIC_API_URL}/comics`, {
      params: {
        __skip: 0,
        __limit: 4,
        type: 'valentine-one-shot',
      },
    })
    setComicsOneShot(response.data.data.results)
  }

  const fetchComics = async () => {
    if (!hasMore || isFetching) {
      return
    }

    setIsFetching(true)
    const response = await axios.get(`${process.env.COMIC_API_URL}/comics`, {
      params: {
        type: 'editorial',
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
        <div>
          <p className="text-black font-bold text-4xl mb-3">Comics</p>
          <div className="w-16 h-3 mb-8 bg-primary"></div>
          <InfiniteScroll
            dataLength={comics.length}
            next={fetchComics}
            hasMore={hasMore}
            loader={<ComicListLoader />}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 overflow-hidden">
              {comics.map((data, i) => (
                <ComicItem data={data} key={i} />
              ))}
            </div>
          </InfiniteScroll>
        </div>

        {/* Valentine one-shot */}
        <div className="mt-16">
          <div className="flex justify-between items-end">
            <p className="text-black font-bold text-3xl mb-3">
              Valentine's One-Shot Comics
            </p>
            <Link href="/comics-type/valentine-one-shot">
              <a className="text-primary font-bold text-xl hover:text-opacity-70 cursor-pointer">
                See more
              </a>
            </Link>
          </div>
          <div className="w-16 h-3 mb-8 bg-primary"></div>
          <ComicList comics={comicsOneShot} />
        </div>
      </div>
    </Layout>
  )
}

export default Comics
