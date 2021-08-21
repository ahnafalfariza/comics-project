import Layout from 'components/Layout'
import Head from 'components/Common/Head'
import Profile from 'components/Profile'
import ChapterListProfile from 'components/Chapter/ChapterListProfile'
import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useRouter } from 'next/router'
import axios from 'axios'

const LIMIT = 8

const ProfilePageComics = () => {
  const router = useRouter()
  const [comics, setComics] = useState([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isFetching, setIsFetching] = useState(false)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(async () => {
    await fetchOwnerComics()
  }, [router.query.id])

  const fetchOwnerComics = async () => {
    if (!hasMore || isFetching) {
      return
    }

    setIsFetching(true)

    const res = await axios(
      `${process.env.COMIC_API_URL}/comics?owner_id=${
        router.query.userId
      }&__skip=${page * LIMIT}&__limit=${LIMIT}`
    )
    const newData = await res.data.data

    const newComics = [...(comics || []), ...newData.results]
    setComics(newComics)
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
      <Head />
      <Profile />
      <InfiniteScroll
        dataLength={comics.length}
        next={fetchOwnerComics}
        hasMore={hasMore}
        loader={<div>Loading</div>}
      >
        {comics.map((comic) => {
          return (
            <ChapterListProfile
              comicId={comic.comic_id}
              comicCover={comic.media}
              comicTitle={comic.title}
            />
          )
        })}
      </InfiniteScroll>
    </Layout>
  )
}

export default ProfilePageComics
