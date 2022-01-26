import { FormSubmission } from 'components/Common/form/components/FormSubmission'
import Head from 'components/Common/Head'
import Layout from 'components/Common/Layout'

const ArtistSubmission = () => {
  const title = 'Artist Submission'

  return (
    <Layout>
      <Head title={title} />
      <FormSubmission title={title} />
    </Layout>
  )
}

export default ArtistSubmission
