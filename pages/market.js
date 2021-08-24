import axios from 'axios'
import Head from 'components/Common/Head'
import { Tab, TabList, Tabs } from 'components/Common/Tabs'
import Layout from 'components/Layout'
import CardList from 'components/Token/CardList'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

const FETCH_TOKENS_LIMIT = 8

const Market = () => {
  const router = useRouter()

  const [tokens, setTokens] = useState([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isFetching, setIsFetching] = useState(false)

  const onTabsChange = (idx) => {
    if (idx === 0) {
      router.push(`/market`)
    } else if (idx === 1) {
      router.push(`/market?category=collectibles`)
    }
  }

  const defaultIndex = () => {
    if (router.asPath.includes('collectibles')) {
      return 1
    }
    return 0
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchTokens(true)
  }, [router])

  const fetchTokens = async (initial) => {
    const _tokens = initial ? [] : tokens
    const _page = initial ? 0 : page
    const _hasMore = initial ? true : hasMore

    if (!_hasMore || isFetching) {
      return
    }

    setIsFetching(true)

    const params = {
      category: defaultIndex() === 0 ? `chapter` : `collectible`,
      __skip: _page * FETCH_TOKENS_LIMIT,
      __limit: FETCH_TOKENS_LIMIT,
    }

    const resp = await axios.get(`${process.env.COMIC_API_URL}/token_types`, {
      params,
    })
    const newData = resp.data.data

    const newTokens = [..._tokens, ...newData.results]
    setTokens(newTokens)
    setPage(_page + 1)
    if (newData.results.length < FETCH_TOKENS_LIMIT) {
      setHasMore(false)
    } else {
      setHasMore(true)
    }
    setIsFetching(false)
  }

  return (
    <Layout>
      <Head title="Market - Comics by Paras" />
      <div className="max-w-6xl m-auto py-8 md:p-4 md:py-8">
        <p className="text-white font-bold text-4xl mb-4 ml-4 md:ml-16">
          Market
        </p>
        <Tabs
          className="md:mx-12"
          onTabsChange={onTabsChange}
          defaultIndex={defaultIndex()}
        >
          <TabList>
            <Tab>Chapter</Tab>
            <Tab>Collectibles</Tab>
          </TabList>
        </Tabs>
        <div className="mt-4">
          <CardList
            tokens={tokens}
            hasMore={hasMore}
            fetchTokens={fetchTokens}
          />
        </div>
      </div>
    </Layout>
  )
}

export default Market
