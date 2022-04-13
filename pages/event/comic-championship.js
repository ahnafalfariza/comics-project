import axios from 'axios'
import ComicList from 'components/Comic/ComicList'
import Head from 'components/Common/Head'
import Layout from 'components/Common/Layout'
import { useEffect, useState } from 'react'

const FETCH_COMICS_LIMIT = 10

const ComicChampionship = () => {
  const [comics, setComics] = useState([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isFetching, setIsFetching] = useState(false)

  const [activeTab, setActiveTab] = useState('all')

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
      <Head title="Paras Comic Championship" />
      <div className="max-w-6xl m-auto px-4 my-8">
        <p className="text-black font-bold text-4xl text-center mb-8">
          Comic Championship
        </p>

        <div className="h-screen bg-slate-500 w-full flex items-center justify-center mb-12">
          <p>Ini Bannernya</p>
        </div>

        <div className="flex justify-center gap-4 mb-6 text-center">
          <div>
            <p
              className={`cursor-pointer ${
                activeTab === 'all' ? 'font-bold' : ''
              }`}
              onClick={() => setActiveTab('all')}
            >
              All
            </p>
            {activeTab === 'all' && (
              <div className="flex justify-center">
                <div className="w-6 h-1 bg-primary" />
              </div>
            )}
          </div>
          <div>
            <p
              className={`cursor-pointer ${
                activeTab === 'action-fantasy' ? 'font-bold' : ''
              }`}
              onClick={() => setActiveTab('action-fantasy')}
            >
              Action-Fantasy
            </p>
            {activeTab === 'action-fantasy' && (
              <div className="flex justify-center">
                <div className="w-6 h-1 bg-primary" />
              </div>
            )}
          </div>
          <div>
            <p
              className={`cursor-pointer ${
                activeTab === 'romance-fantasy' ? 'font-bold' : ''
              }`}
              onClick={() => setActiveTab('romance-fantasy')}
            >
              Romance-Fantasy
            </p>
            {activeTab === 'romance-fantasy' && (
              <div className="flex justify-center">
                <div className="w-6 h-1 bg-primary" />
              </div>
            )}
          </div>
        </div>

        <ComicList
          comics={comics}
          hasMore={hasMore}
          fetchComics={fetchComics}
          size="small"
        />
      </div>
    </Layout>
  )
}

export default ComicChampionship
