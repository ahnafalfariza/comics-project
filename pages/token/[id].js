import axios from 'axios'

import Layout from 'components/Layout'
import TokenDetail from 'components/Token/TokenDetail'

const TokenPage = ({ errorCode, token }) => {
  return (
    <Layout>
      <div className="p-4">
        <TokenDetail token={token} className="shadow-2xl" />
      </div>
    </Layout>
  )
}

export async function getServerSideProps({ params }) {
  const res = await axios(`${process.env.API_URL}/tokens?tokenId=${params.id}`)
  const token = (await res.data.data.results[0]) || null

  const errorCode = token ? false : 404

  return { props: { errorCode, token } }
}

export default TokenPage
