import axios from 'axios'

import Layout from 'components/Layout'
import TokenTypeDetail from 'components/Token/TokenTypeDetail'

const TokenPage = ({ errorCode, token }) => {
  console.log(token)

  return (
    <Layout>
      <div className="p-4">
        <TokenTypeDetail
          token={token}
          metadata={token.metadata}
          className="shadow-2xl"
        />
      </div>
    </Layout>
  )
}

export async function getServerSideProps({ params }) {
  const res = await axios(
    `${process.env.COMIC_API_URL}/token_types?token_types=${params.id}`
  )
  const token = (await res.data.data.results[0]) || null

  const errorCode = token ? false : 404

  return { props: { errorCode, token } }
}

export default TokenPage
