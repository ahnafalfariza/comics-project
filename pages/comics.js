import Link from 'next/link'

import Head from 'components/Common/Head'
import Layout from 'components/Layout'

const Comics = () => {
  return (
    <Layout>
      <Head />
      <div className="max-w-5xl m-auto my-12">
        <div className="bg-white p-4 cursor-pointer">
          <Link href="/overview/paradigm">
            <a>Read Paradigm</a>
          </Link>
        </div>
      </div>
    </Layout>
  )
}

export default Comics
