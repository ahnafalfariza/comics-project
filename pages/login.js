import Button from 'components/Common/Button'
import Head from 'components/Common/Head'
import Layout from 'components/Layout'
import near from 'lib/near'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()

  return (
    <Layout>
      <Head />
      <div className="py-12 md:px-8">
        <div className="max-w-2xl m-auto px-4 items-center py-32">
          <img className="w-96 mx-auto" src="/login.svg" />
          <p className="text-4xl mt-8 text-white font-bold">
            Login to Paras Comic
          </p>
          <p className="text-xl text-gray-300 pt-4">
            Read and truly own your digital comics. Interact, engage, and
            support the creators through collectibles NFTs. Tipping is now
            interactive!
          </p>
          <div className="pt-16 text-center">
            <Button
              isFullWidth={true}
              size="lg"
              className="mx-auto"
              onClick={() => near.signIn()}
            >
              Login with NEAR
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
