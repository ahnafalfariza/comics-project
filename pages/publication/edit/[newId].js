import axios from 'axios'

import PublicationEditor from 'components/Publication/PublicationEditor'
import Layout from 'components/Common/Layout'
import Head from 'components/Common/Head'

const Edit = ({ publicationDetail }) => {
  return (
    <Layout>
      <Head title="Edit Publication — Paras Comic" />
      <div className="relative">
        {typeof window !== 'undefined' && (
          <PublicationEditor
            isEdit={true}
            publicationDetail={publicationDetail}
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
  const publicationDetail = (await resp.data?.data?.results[0]) || null

  return { props: { publicationDetail } }
}

export default Edit
