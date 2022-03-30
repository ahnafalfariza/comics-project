import Link from 'next/link'
import axios from 'axios'
import Head from 'components/Common/Head'
import Layout from 'components/Common/Layout'
import PublicationListScroll from 'components/Publication/PublicationListScroll'
import useStore from 'lib/store'
import { useRouter } from 'next/router'

import { useEffect, useState } from 'react'
import { parseImgUrl } from 'utils/common'

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

  return (
    <Layout>
      <Head title="Publication - Paras Comic" />
      <div className="max-w-6xl m-auto py-8 md:px-0 md:py-8">
        <div className="flex items-end"></div>
        <div className="md:flex px-4 gap-6">
          <div className="md:w-1/2">
            <p className="w-1/2 text-black font-bold text-3xl mb-4 ">
              Featured
            </p>
            <PublicationFeatured data={Featured} />
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0">
            <p className="w-1/2 text-black font-bold text-2xl mb-4">
              Must Read
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 md:grid-row-2 gap-4">
              <PublicationMustRead data={Featured} />
              <PublicationMustRead data={Featured} />
              <PublicationMustRead data={Featured} />
              <PublicationMustRead data={Featured} />
            </div>
          </div>
        </div>
        <div className="mt-8">
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

const PublicationFeatured = ({ data }) => {
  return (
    <div className="publication-card rounded-md overflow-hidden shadow-xl drop-shadow-xl">
      <div className="relative z-10 bg-primary">
        <Link href={`/publication/${data.slug}-${data._id}`}>
          <a>
            <div className="aspect-[3/2] overflow-hidden m-auto cursor-pointer shadow-inner">
              <img
                className="aspect-[3/2] w-full object-cover"
                src={parseImgUrl(data.thumbnail, null, { width: `600` })}
              />
            </div>
          </a>
        </Link>
      </div>
      <div className="flex flex-col p-4 -mt-1 h-32">
        <Link href={`/publication/${data.slug}-${data._id}`}>
          <a>
            <div className="cursor-pointer">
              <div className="overflow-hidden" style={{ maxHeight: `3.75rem` }}>
                <h1 className="text-black text-2xl font-bold line-clamp-2 border-b-2 border-transparent">
                  {data.title}
                </h1>
              </div>
              <div className="overflow-hidden mt-2">
                <p className="text-black line-clamp-2">{data.description}</p>
              </div>
            </div>
          </a>
        </Link>
      </div>
    </div>
  )
}

const PublicationMustRead = ({ data }) => {
  return (
    <div className="publication-card rounded-md overflow-hidden shadow-xl drop-shadow-xl">
      <div className="relative z-10 bg-primary">
        <Link href={`/publication/${data.slug}-${data._id}`}>
          <a>
            <div className="aspect-[2/1] overflow-hidden m-auto cursor-pointer shadow-inner">
              <img
                className="aspect-[2/1] w-full object-cover"
                src={parseImgUrl(data.thumbnail, null, { width: `600` })}
              />
            </div>
          </a>
        </Link>
      </div>
      <div className="flex flex-col p-4 -mt-1">
        <Link href={`/publication/${data.slug}-${data._id}`}>
          <a>
            <div className="cursor-pointer">
              <div className="overflow-hidden" style={{ maxHeight: `3.75rem` }}>
                <p className="text-black text-lg font-bold truncate border-b-2 border-transparent ">
                  {data.title}
                </p>
              </div>
              <div className="overflow-hidden mt-2">
                <p className="text-black line-clamp-2 text-sm">
                  {data.description}
                </p>
              </div>
            </div>
          </a>
        </Link>
      </div>
    </div>
  )
}

const Featured = {
  _id: '6225fe498e43767711dfaa94',
  slug: 'catching-up-with-paras-54',
  title: 'Catching Up with Paras #54',
  thumbnail:
    'ipfs://bafybeifn3qopcheez5tglnu2pckt6wrfhwt2farfpiorw5inlxfyl3ebx4',
  description: 'Paras Weekly Recap for the 7th of March, 2022.',
  author_id: 'afiqshofy.near',
  contract_token_ids: [],
  collection_ids: [],
  type: 'editorial',
  issued_at: 1646657097579,
  updated_at: 1646657097579,
  view: 123,
}
