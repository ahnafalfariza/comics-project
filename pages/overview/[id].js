import { useRouter } from 'next/router'
import { useEffect } from 'react'

import Layout from 'components/Layout'
import Head from 'components/Common/Head'

import { COMIC_OVERVIEW_DATA } from 'constants/dummy'

const OverviewPage = ({ userProfile, accountId }) => {
  const router = useRouter()

  useEffect(() => {
    router.replace(`${accountId}/chapter`)
  }, [router.query.id])

  return (
    <Layout>
      <Head />
      <div className="h-screen" />
    </Layout>
  )
}

export async function getServerSideProps({ params }) {
  const chapterRes = COMIC_OVERVIEW_DATA
  const chapterInfo = chapterRes.data.results[0] || null
  return {
    props: { chapterInfo, accountId: params.id },
  }
}

export default OverviewPage
