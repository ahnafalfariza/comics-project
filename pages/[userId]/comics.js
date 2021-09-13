import Layout from 'components/Common/Layout'
import Head from 'components/Common/Head'
import Profile from 'components/Common/Profile'
import ChapterListProfile from 'components/Chapter/ChapterListProfile'
import { useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useRouter } from 'next/router'
import axios from 'axios'
import ProfileChapterListLoader from 'components/Chapter/ProfileChapterListLoader'

const LIMIT = 8

const Loader = () => (
  <div className="px-4">
    <ProfileChapterListLoader />
  </div>
)

const ProfilePageComics = ({ profile }) => {
  const router = useRouter()
  const [comics, setComics] = useState([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isFetching, setIsFetching] = useState(false)
  const [userData, setUserData] = useState(profile)

  useEffect(() => {
    if (router.query.userId) {
      fetchOwnerComics()
    }
    // eslint-disable-next-line
  }, [router.query.userId])

  const fetchOwnerComics = async () => {
    if (!hasMore || isFetching) {
      return
    }

    setIsFetching(true)

    setTimeout(async () => {
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
    }, 2500)
  }

  return (
    <Layout>
      <Head title={`${profile.accountId}`} />
      <Profile userData={userData} setUserData={setUserData} />
      <div className="max-w-5xl mx-auto pt-8 pb-16 -mt-8">
        {comics.length === 0 && !hasMore && (
          <div className="w-full">
            <div className="m-auto text-2xl text-gray-600 font-semibold py-32 text-center">
              <div className="w-40 m-auto">
                <img src="/cardstack.png" className="opacity-75" />
              </div>
              <p className="mt-4">No Comics</p>
            </div>
          </div>
        )}
        <InfiniteScroll
          dataLength={comics.length}
          next={fetchOwnerComics}
          hasMore={hasMore}
          loader={<Loader />}
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
