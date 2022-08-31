import axios from 'axios'
import { useEffect, useState } from 'react'
import Head from 'components/Common/Head'
import Layout from 'components/Common/Layout'

import { FETCH_COMICS_LIMIT } from 'constants/constant'
import ComicList from 'components/Comic/ComicList'

const ComicType = ({ comic_type }) => {
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
        type: comic_type,
        __sort: '_id::1',
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
      <Head
        title="Valentine's One-Shot Comics"
        image="https://paras-cdn.imgix.net/bafybeihyd2rbp7aupz5y6v72gdtrhso67a4okhp5z4hvvzemvxj54whg5a"
      />
      <div className="max-w-6xl m-auto p-4 pb-8">
        <div className=" -mx-4 md:mx-0">
          <img
            // temporary will update from comic-type backend
            src="https://paras-cdn.imgix.net/bafkreiaurdcsduhxukwnhocvbmrunnjqkpmpjriar4lfzvm34nykl3j6fi"
            className="hidden md:block w-full mb-8"
          />
          <img
            // temporary will update from comic-type backend
            src="https://paras-cdn.imgix.net/bafybeihyd2rbp7aupz5y6v72gdtrhso67a4okhp5z4hvvzemvxj54whg5a"
            className="w-full mb-8 md:hidden"
          />
        </div>
        {/* temporary will update form comic-type backend */}
        <p className="text-black font-bold text-4xl mb-3">
          Valentine's One-Shot Comics
        </p>
        <div className="w-16 h-3 mb-8 bg-primary"></div>
        <ComicList
          comics={comics}
          hasMore={hasMore}
          fetchComics={fetchComics}
        />
      </div>
    </Layout>
  )
}

export default ComicType

export async function getServerSideProps({ params }) {
  if (params.comic_type !== 'valentine-one-shot') {
    return {
      redirect: {
        destination: '/comics',
        permanent: false,
      },
    }
  }

  return {
    props: { comic_type: params.comic_type },
  }
}
