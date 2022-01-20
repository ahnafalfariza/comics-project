import { FormSubmission } from 'components/Common/form/components/FormSubmission'
import Head from 'components/Common/Head'
import Layout from 'components/Common/Layout'

const ValentineCompetitionSubmission = () => {
  const title = 'Valentine Competition Submission'
  return (
    <Layout>
      <Head title={title} />
      <FormSubmission title={title} />
    </Layout>
  )
}

export default ValentineCompetitionSubmission
