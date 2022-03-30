import Head from 'components/Common/Head'
import Layout from 'components/Common/Layout'
import PublicationEditor from 'components/Publication/PublicationEditor'

const CreatePublication = () => {
  return (
    <div className="min-h-screen bg-white">
      <Layout>
        <Head title="Create Publication - Paras Comic" />
        <div className="relative">
          <PublicationEditor />
        </div>
      </Layout>
    </div>
  )
}

export default CreatePublication
