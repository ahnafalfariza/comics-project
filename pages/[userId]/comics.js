import Layout from 'components/Layout'
import Head from 'components/Common/Head'
import Profile from 'components/Profile'
import ChapterListProfile from 'components/Chapter/ChapterListProfile'
import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useRouter } from 'next/router'
import axios from 'axios'
import ChapterListLoader from 'components/Chapter/ChapterListLoader'

const LIMIT = 8

const ProfilePageComics = ({ profile }) => {
  const router = useRouter()
  const [comics, setComics] = useState([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isFetching, setIsFetching] = useState(false)
  const [userData, setUserData] = useState(profile)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (router.query.userId) {
      fetchOwnerComics()
    }
  }, [router.query.userId])

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
      <Head title={`${profile.accountId} - Comics by Paras`} />
      <Profile userData={userData} setUserData={setUserData} />
      <div className="max-w-5xl mx-auto pt-8 pb-16 -mt-8">
        <InfiniteScroll
          dataLength={comics.length}
          next={fetchOwnerComics}
          hasMore={hasMore}
          loader={<ChapterListLoader />}
        >
          {comics.map((comic) => {
            return (
              <div className="pt-8 px-4" key={comic.comic_id}>
                <ChapterListProfile
                  comicId={comic.comic_id}
                  comicCover={comic.media}
                  comicTitle={comic.title}
                />
              </div>
            )
          })}
        </InfiniteScroll>
      </div>
    </Layout>
  )
}

export async function getServerSideProps({ params }) {
  const response = await axios.get(
    `${process.env.PARAS_API_URL}/profiles?accountId=${params.userId}`
  )

  return {
    props: {
      profile: response.data.data.results[0] || {
        accountId: params.userId,
      },
    },
  }
}

export default ProfilePageComics
