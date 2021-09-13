import axios from 'axios'
import Head from 'components/Common/Head'

import Layout from 'components/Common/Layout'
import TokenTypeDetail from 'components/Token/TokenTypeDetail'
import { parseImgUrl } from 'utils/common'

const TokenPage = ({ errorCode, token }) => {
  return (
    <Layout>
      <Head
        title={token.metadata.title}
        image={parseImgUrl(token.metadata.media)}
      />
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
    `${process.env.COMIC_API_URL}/token_types?token_type=${params.tokenTypeId}`
  )
  const token = (await res.data.data.results[0]) || null

  const errorCode = token ? false : 404

  return { props: { errorCode, token } }
}

export default TokenPage
