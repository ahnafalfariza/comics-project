import Head from 'components/Common/Head'
import Layout from 'components/Layout'
import { useRouter } from 'next/router'

const Comics = () => {
  const router = useRouter()

  const onClickComic = () => {
    router.push('/overview/paradigm')
  }

  return (
    <Layout>
      <Head />
      <div className="max-w-6xl m-auto p-4 py-8">
        <p className="text-white font-bold text-4xl mb-8">Comics</p>
        <div
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          onClick={onClickComic}
        >
          <img
            src="https://d30womf5coomej.cloudfront.net/sa/62/7b09e240-fd2a-4e9c-ac85-d4b54ea39778_z.jpg"
            className="rounded-md cursor-pointer"
          />
        </div>
      </div>
    </Layout>
  )
}

export default Comics
