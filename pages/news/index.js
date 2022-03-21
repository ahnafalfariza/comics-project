import axios from 'axios'
import Head from 'components/Common/Head'
import Layout from 'components/Common/Layout'
import NewsListScroll from 'components/News/NewsListScroll'
import useStore from 'lib/store'
import { useRouter } from 'next/router'

import { useEffect, useState } from 'react'

const LIMIT = 6

const News = () => {
  const router = useRouter()
  const [isFetching, setIsFetching] = useState(false)
  const {
    newsList,
    setNewsList,
    newsListHasMore,
    setNewsListHasMore,
    newsListPage,
    setNewsListPage,
  } = useStore()

  useEffect(() => {
    if (router.isReady) {
      if (newsList?.length === 0) {
        fetchData(true)
      }
    }
  }, [router.isReady])

  useEffect(() => {
    const handleRouteChange = () => {
      window.scrollTo(0, 0)
    }

    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [])

  const fetchData = async (initial = false) => {
    _fetchData(
      initial,
      newsList,
      setNewsList,
      newsListHasMore,
      setNewsListHasMore,
      newsListPage,
      setNewsListPage
    )
  }

  const _fetchData = async (
    initial = false,
    list,
    setList,
    hasMore,
    setHasMore,
    page,
    setPage
  ) => {
    const _newsList = initial ? [] : list
    const _hasMore = initial ? true : hasMore
    const _page = initial ? 0 : page

    if (!_hasMore || isFetching) {
      return
    }

    setIsFetching(true)
    const res = await axios(
      `${process.env.PARAS_API_URL}/publications?type=editorial&isComic=true`,
      {
        params: {
          __skip: _page * LIMIT,
          __limit: LIMIT,
        },
      }
    )
    const newData = await res.data.data
    const newDataNewsList = [..._newsList, ...newData.results]

    setList(newDataNewsList)
    setPage(_page + 1)

    if (newData.results.length < LIMIT) {
      setHasMore(false)
    } else {
      setHasMore(true)
    }
    setIsFetching(false)
  }

  return (
    <Layout>
      <Head title="News - Paras Comic" />
      <div className="max-w-6xl m-auto py-8 md:px-0 md:py-8">
        <p className="text-black font-bold text-4xl mb-10 ml-4">News</p>
        <div className="mt-8">
          <NewsListScroll
            data={newsList}
            hasMore={newsListHasMore}
            fetchData={fetchData}
          />
        </div>
      </div>
    </Layout>
  )
}

export default News
