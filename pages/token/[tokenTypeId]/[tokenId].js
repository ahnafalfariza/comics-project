import axios from 'axios'

import Layout from 'components/Layout'
import TokenDetail from 'components/Token/TokenDetail'

const TokenPage = ({ errorCode, token }) => {
  console.log(token)

  return (
    <Layout>
      <div className="p-4">
        <TokenDetail
          token={token}
          metadata={token.metadata}
          className="shadow-2xl"
        />
      </div>
    </Layout>
  )
}

export async function getServerSideProps({ params }) {
  const res = await axios(`${process.env.COMIC_API_URL}/tokens`, {
    params: {
      token_id: params.tokenId,
    },
  })
  const token = (await res.data.data.results[0]) || null

  const errorCode = token ? false : 404

  return { props: { errorCode, token } }
}

export default TokenPage
