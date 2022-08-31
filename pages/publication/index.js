import axios from 'axios'
import Head from 'components/Common/Head'
import Layout from 'components/Common/Layout'
import PublicationListScroll from 'components/Publication/PublicationListScroll'
import useStore from 'lib/store'
import { useRouter } from 'next/router'

import { useEffect, useState } from 'react'
import PublicationFeatured from 'components/Publication/PublicationFeatured'
import PublicationMustRead from 'components/Publication/PublicationMustRead'

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
  const [editorial, setEditorial] = useState(null)

  useEffect(() => {
    if (router.isReady) {
      fetchData(true)
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
    if (initial) {
      const res = await axios(
        `${process.env.COMIC_API_URL}/publication-editorial`
      )
      const editorial = await res.data.result
      const featured = await axios.all(
        editorial.featured.map(fetchSinglePublication)
      )
      const mustRead = await axios.all(
        editorial.must_read.map(fetchSinglePublication)
      )

      setEditorial({ featured, mustRead })
    }

    const res = await axios(
      `${process.env.PARAS_API_URL}/publications?isComic=true`,
      {
        params: {
          __skip: _page * LIMIT,
          __limit: LIMIT,
          __view: 'simple',
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

  const fetchSinglePublication = ({ publication_id }) => {
    return axios
      .get(
        `${process.env.PARAS_API_URL}/publications?_id=${publication_id}&__view=simple`
      )
      .then((response) => response.data.data.results[0])
      .catch((error) => error)
  }

  return (
    <Layout>
      <Head title="Publication - Paras Comic" />
      <div className="max-w-6xl m-auto py-8 md:px-0 md:py-8">
        <div className="flex items-end"></div>
        <div className="md:flex px-4 gap-6">
          {editorial?.featured[0] && (
            <div className="md:w-1/2 mb-8">
              <p className="w-1/2 text-black font-bold text-3xl mb-4 ">
                Featured
              </p>
              <PublicationFeatured data={editorial?.featured[0]} />
            </div>
          )}
          {editorial && editorial.mustRead.length !== 0 && (
            <div className="md:w-1/2 mt-8 md:mt-0 mb-8">
              <p className="w-1/2 text-black font-bold text-3xl mb-4 ">
                Must Read
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 md:grid-row-2 gap-4">
                {editorial?.mustRead.map((publication) => (
                  <PublicationMustRead
                    key={publication._id}
                    data={publication}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        <div>
          <p className="text-black font-bold text-3xl mb-4 ml-4">
            Latest Publication
          </p>
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
