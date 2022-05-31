import axios from 'axios'
import ComicList from 'components/Comic/ComicList'
import Head from 'components/Common/Head'
import Layout from 'components/Common/Layout'
import OverviewEvent from 'components/Event/OverviewEvent'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const FETCH_COMICS_LIMIT = 10

const banner = {
  mobile: 'bafybeihzazhdnyqjjm6uuddkl6ai6chvk73m6bmu4ws5gau2z77j7dwsbm',
  desktop: 'bafybeichntn366brrvvj7wh3xdnhn5xdg67acwjhgy7g6rrmsbymssxbju',
}

const ComicChampionship = () => {
  const [comics, setComics] = useState([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isFetching, setIsFetching] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  const isEmpty = false

  useEffect(() => {
    if (
      activeTab === 'all' ||
      activeTab === 'Action' ||
      activeTab === 'Romance' ||
      activeTab === 'finalist'
    ) {
      fetchComics(true, activeTab)
    }
  }, [activeTab])

  useEffect(() => {
    fetchComics(true, '')
  }, [])

  const fetchComics = async (fromStart = false, genre) => {
    const _hasMore = fromStart ? true : hasMore
    const _page = fromStart ? 0 : page
    const _comics = fromStart ? [] : comics
    const _isFetching = fromStart ? false : isFetching
    const _genre = genre === 'all' ? '' : genre

    if (!_hasMore || _isFetching) {
      return
    }

    const params = {
      __sort: '_id::1',
      __skip: _page * FETCH_COMICS_LIMIT,
      __limit: FETCH_COMICS_LIMIT,
      type: 'championship',
      genre: _genre,
    }

    if (genre === 'finalist') {
      delete params.genre
      params.is_final_round = true
    }

    setIsFetching(true)
    const response = await axios.get(`${process.env.COMIC_API_URL}/comics`, {
      params,
    })
    const newData = response.data.data
    const newChapters = [..._comics, ...newData.results]
    setComics(newChapters)
    setPage(_page + 1)

    if (newData.results.length < FETCH_COMICS_LIMIT) {
      setHasMore(false)
    } else {
      setHasMore(true)
    }
    setIsFetching(false)
  }

  const onChangeTab = (value) => {
    if (isEmpty) {
      return
    }

    setActiveTab(value)
  }

  return (
    <Layout>
      <Head
        title="Paras Comic Championship"
        image="https://paras-cdn.imgix.net/bafybeihzazhdnyqjjm6uuddkl6ai6chvk73m6bmu4ws5gau2z77j7dwsbm"
      />
      <div className="max-w-6xl m-auto px-4 mb-8">
        <div className="mb-12 hidden md:block">
          <Link href="/submission/championship">
            <a>
              <img src={`https://paras-cdn.imgix.net/${banner.desktop}`} />
            </a>
          </Link>
        </div>
        <div className="mb-12 md:hidden -mx-4">
          <Link href="/submission/championship">
            <a>
              <img src={`https://paras-cdn.imgix.net/${banner.mobile}`} />
            </a>
          </Link>
        </div>

        <div className="justify-center gap-4 mb-6 text-center hidden md:flex">
          <div>
            <p
              className={`cursor-pointer ${
                activeTab === 'overview' ? 'font-bold' : ''
              }`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </p>
            {activeTab === 'overview' && (
              <div className="flex justify-center">
                <div className="w-6 h-1 bg-primary" />
              </div>
            )}
          </div>
          <div>
            <p
              className={`cursor-pointer ${
                activeTab === 'all' ? 'font-bold' : ''
              } ${isEmpty && 'cursor-not-allowed opacity-50'}`}
              onClick={() => onChangeTab('all')}
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
                activeTab === 'Action' ? 'font-bold' : ''
              } ${isEmpty && 'cursor-not-allowed opacity-50'}`}
              onClick={() => onChangeTab('Action')}
            >
              Action-Fantasy
            </p>
            {activeTab === 'Action' && (
              <div className="flex justify-center">
                <div className="w-6 h-1 bg-primary" />
              </div>
            )}
          </div>
          <div>
            <p
              className={`cursor-pointer ${
                activeTab === 'Romance' ? 'font-bold' : ''
              } ${isEmpty && 'cursor-not-allowed opacity-50'}`}
              onClick={() => onChangeTab('Romance')}
            >
              Romance-Fantasy
            </p>
            {activeTab === 'Romance' && (
              <div className="flex justify-center">
                <div className="w-6 h-1 bg-primary" />
              </div>
            )}
          </div>
          <div>
            <p
              className={`cursor-pointer ${
                activeTab === 'finalist' ? 'font-bold' : ''
              }`}
              onClick={() => onChangeTab('finalist')}
            >
              Finalist
            </p>
            {activeTab === 'finalist' && (
              <div className="flex justify-center">
                <div className="w-6 h-1 bg-primary" />
              </div>
            )}
          </div>
        </div>
        <div className="hidden md:block">
          {activeTab === 'overview' ? (
            <OverviewEvent />
          ) : (
            <ComicList
              comics={comics}
              hasMore={hasMore}
              fetchComics={fetchComics}
              size="small"
            />
          )}
        </div>

        {/* Mobile View */}
        <div className="md:hidden">
          <OverviewEvent />
          <div className="flex justify-center gap-2 mb-6 text-center text-sm">
            <div>
              <p
                className={`cursor-pointer ${
                  activeTab === 'all' || activeTab === 'overview'
                    ? 'font-bold'
                    : ''
                } ${isEmpty && 'cursor-not-allowed opacity-50'}`}
                onClick={() => onChangeTab('all')}
              >
                All
              </p>
              {(activeTab === 'all' || activeTab === 'overview') && (
                <div className="flex justify-center">
                  <div className="w-6 h-1 bg-primary" />
                </div>
              )}
            </div>
            <div>
              <p
                className={`cursor-pointer ${
                  activeTab === 'Action' ? 'font-bold' : ''
                } ${isEmpty && 'cursor-not-allowed opacity-50'}`}
                onClick={() => onChangeTab('Action')}
              >
                Action-Fantasy
              </p>
              {activeTab === 'Action' && (
                <div className="flex justify-center">
                  <div className="w-6 h-1 bg-primary" />
                </div>
              )}
            </div>
            <div>
              <p
                className={`cursor-pointer ${
                  activeTab === 'Romance' ? 'font-bold' : ''
                } ${isEmpty && 'cursor-not-allowed opacity-50'}`}
                onClick={() => onChangeTab('Romance')}
              >
                Romance-Fantasy
              </p>
              {activeTab === 'Romance' && (
                <div className="flex justify-center">
                  <div className="w-6 h-1 bg-primary" />
                </div>
              )}
            </div>
            <div>
              <p
                className={`cursor-not-allowed opacity-50 ${
                  activeTab === 'finalist' ? 'font-bold' : ''
                }`}
                onClick={() => null}
              >
                Finalist
              </p>
              {activeTab === 'finalist' && (
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
      </div>
    </Layout>
  )
}

export default ComicChampionship
