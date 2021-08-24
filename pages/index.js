import Button from 'components/Common/Button'
import Head from 'components/Common/Head'
import Layout from 'components/Layout'
import { useRouter } from 'next/router'

import HomeStyles from 'styles/Home.module.css'

export default function Home() {
  const router = useRouter()

  return (
    <Layout>
      <Head />
      <div className="py-12 md:px-8">
        <div className="max-w-6xl m-auto px-4 md:flex md:flex-row-reverse items-center">
          <div
            className="w-full md:w-2/5"
            // style={{
            //   backgroundImage: 'url("/hero.png")',
            //   backgroundPositionX: 'right',
            //   backgroundSize: 'contain',
            //   backgroundRepeat: 'no-repeat',
            // }}
          >
            <img className="max-w-full" src="/hero.svg" />
          </div>
          <div className="w-full md:w-3/5 pr-0 md:pr-4 pt-8 md:pt-0">
            <div className="text-5xl font-bold mb-4 text-white md:w-96 leading-normal">
              Digital Comic and Beyond
            </div>
            <div className="text-xl mb-12 text-gray-200">
              Read and truly own your digital comics. Interact, engage, and
              support the creators through collectibles NFTs. Tipping is now
              interactive!
            </div>
            <div className="flex flex-wrap">
              <Button
                className="w-64"
                size="lg"
                onClick={() => router.push('/comics')}
              >
                Read Comics
              </Button>
              <div className="mt-4 lg:mt-0 pl-0 lg:pl-4">
                <Button
                  className="w-64"
                  variant="ghost"
                  size="lg"
                  onClick={() => router.push('/faq')}
                >
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="px-4 text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-white leading-normal md:text-center pt-16">
          Latest Comic
        </div>
        <div className={`pb-16 md:py-36 ${HomeStyles.latestComic}`}>
          <div className="max-w-6xl m-auto px-4">
            <img
              className="md:hidden h-72 mx-auto rounded-lg"
              src="https://ipfs.fleek.co/ipfs/bafybeidf6pg3g65nx2kzirjy37rlwh7sfjmsc4lqlhoiiggng3g3j4ouj4"
            />
            <div className="text-5xl font-medium mt-4 md:mt-0 mb-4 text-white">
              Paradigm
            </div>
            <div className="text-gray-200 md:w-1/2 mb-8">
              “In desolate and sequestered lands, Abee wakes up remembering
              nothing but the hackathon he just participated in. Alongside three
              new companies, Abee will take part in an adventure, discover new
              knowledge, and commit risky endeavors.”
            </div>
            <Button size="lg">Read Now</Button>
          </div>
        </div>

        <div className="max-w-6xl m-auto py-16 px-4">
          <div className="text-5xl font-bold mb-4 text-white leading-normal text-center">
            Feature
          </div>
          <div className="md:flex">
            <div className="text-center flex-1 p-4 font-medium">
              <img src={`/yours.svg`} />
              <p className="text-xl text-white mb-3">Comic is 100% yours</p>
              <p className="text-gray-200">
                Read, lend, and sell your digital comic anytime you want
              </p>
            </div>
            <div className="text-center flex-1 p-4 font-medium">
              <img src={`/support.svg`} />
              <p className="text-xl text-white mb-3">
                Collecting is Supporting Creators
              </p>
              <p className="text-gray-200">
                Collect the collectibles NFTs by the authors to support them
                exppandig the universe they built
              </p>
            </div>
            <div className="text-center flex-1 p-4 font-medium">
              <img src={`/community.svg`} />
              <p className="text-xl text-white mb-3">
                Reading with The Community
              </p>
              <p className="text-gray-200">
                Enter the exclusive community of the title and embark on a
                journey with fellow comic buffs to the author's world through
                Q&A and discussions
              </p>
            </div>
          </div>
        </div>

        <div
          className="max-w-6xl m-auto py-16 h-96 w-full"
          style={{
            backgroundImage: `url(/draft.png)`,
            backgroundPosition: `center`,
            backgroundSize: `cover`,
          }}
        ></div>
        <div className="max-w-3xl -mt-12 px-4 mx-auto">
          <div className="text-5xl font-bold mb-4 text-white leading-normal">
            Create Now!
          </div>
          <div className="text-gray-200 mb-8 text-lg">
            Publishing your title with Paras Comic is quick and easy. Sell your
            digital collectibles of your IP and interact with your fans
            directly.
          </div>
          <div className="text-gray-200 mb-8">
            Build your community and share your work with comic buffs!
          </div>
          <Button size="lg">Create with us</Button>
        </div>
      </div>
    </Layout>
  )
}
