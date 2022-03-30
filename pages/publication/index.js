import axios from 'axios'
import Head from 'components/Common/Head'
import Layout from 'components/Common/Layout'
import PublicationListScroll from 'components/Publication/PublicationListScroll'
import useStore from 'lib/store'
import { useRouter } from 'next/router'

import { useEffect, useState } from 'react'

const LIMIT = 6

const Publication = () => {
  const router = useRouter()
  const [isFetching, setIsFetching] = useState(false)
  const {
    publicationList,
    setPublicationList,
    publicationListHasMore,
    setPublicationListHasMore,
    publicationListPage,
    setPublicationListPage,
  } = useStore()

  useEffect(() => {
    if (router.isReady) {
      if (publicationList?.length === 0) {
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
      publicationList,
      setPublicationList,
      publicationListHasMore,
      setPublicationListHasMore,
      publicationListPage,
      setPublicationListPage
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
    const _publicationList = initial ? [] : list
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
    const newDataPublicationList = [..._publicationList, ...newData.results]

    setList(newDataPublicationList)
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
      <Head title="Publication - Paras Comic" />
      <div className="max-w-6xl m-auto py-8 md:px-0 md:py-8">
        <p className="text-black font-bold text-4xl mb-10 ml-4">Publication</p>

        <div className="mt-8">
          <PublicationListScroll
            data={publicationList}
            hasMore={publicationListHasMore}
            fetchData={fetchData}
          />
        </div>
      </div>
    </Layout>
  )
}

export default Publication
