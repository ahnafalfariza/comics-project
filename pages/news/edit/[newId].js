import axios from 'axios'

import NewsEditor from 'components/News/NewsEditor'
import Layout from 'components/Common/Layout'
import Head from 'components/Common/Head'

const Edit = ({ newsDetail }) => {
  return (
    <Layout>
      <Head title="Edit News — Paras Comic" />
      <div className="relative">
        {typeof window !== 'undefined' && (
          <NewsEditor
            isEdit={true}
            newsDetail={newsDetail}
            draftDetail={JSON.parse(localStorage.getItem('edit-draft'))}
          />
        )}
      </div>
    </Layout>
  )
}

export async function getServerSideProps({ params }) {
  const { newId } = params
  const resp = await axios(
    `${process.env.PARAS_API_URL}/publications?_id=${newId}`
  )
  const newsDetail = (await resp.data?.data?.results[0]) || null

  return { props: { newsDetail } }
}

export default Edit
