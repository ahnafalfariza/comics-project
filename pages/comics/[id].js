import { useRouter } from 'next/router'
import { useEffect } from 'react'

import Layout from 'components/Common/Layout'
import Head from 'components/Common/Head'

import axios from 'axios'
import { parseImgUrl } from 'utils/common'

const OverviewPage = ({ comicInfo }) => {
  const router = useRouter()

  useEffect(() => {
    if (router.query.id) {
      router.replace(`${router.query.id}/chapter`)
    }
  }, [router, router.query.id])

  return (
    <Layout>
      <Head
        title={comicInfo.title}
        description={comicInfo.description}
        image={parseImgUrl(comicInfo.media)}
      />
      <div className="h-screen" />
    </Layout>
  )
}

export async function getServerSideProps({ params }) {
  const response = await axios.get(
    `${process.env.COMIC_API_URL}/comics?comic_id=${params.id}`
  )
  const comicInfo = response.data.data.results[0] || null

  return {
    props: { comicInfo },
  }
}

export default OverviewPage
