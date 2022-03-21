import Head from 'components/Common/Head'
import Layout from 'components/Common/Layout'
import NewsEditor from 'components/News/NewsEditor'

const CreatePublication = () => {
  return (
    <div className="min-h-screen bg-white">
      <Layout>
        <Head title="Create News - Paras Comic" />
        <div className="relative">
          <NewsEditor />
        </div>
      </Layout>
    </div>
  )
}

export default CreatePublication
