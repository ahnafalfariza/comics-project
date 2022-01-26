import Head from 'components/Common/Head'
import Layout from 'components/Common/Layout'
import Carousel from 'components/Common/Carousel'
import axios from 'axios'
import { useEffect, useState } from 'react'
import ComicItem from 'components/Comic/ComicItem'
import ComicMostLiked from 'components/Comic/ComicMostLiked'
import Button from 'components/Common/Button'
import { useRouter } from 'next/router'

export default function Home() {
  const [editorial, setEditorial] = useState([])
  const [mostLiked, setMostLiked] = useState([])
  const router = useRouter()

  useEffect(() => {
    fetchEditorial()
    fetchMostLiked()
  }, [])

  const fetchEditorial = async () => {
    const res = await axios.get(`${process.env.COMIC_API_URL}/comics`, {
      params: {
        __skip: 0,
        __limit: 4,
      },
    })
    const newRes = res.data.data.results
    setEditorial(newRes)
  }

  const fetchMostLiked = async () => {
    const res = await axios.get(`${process.env.COMIC_API_URL}/comics`, {
      params: {
        __skip: 0,
        __limit: 4,
        __sort: 'totalLikes::-1',
      },
    })
    const newRes = res.data.data.results
    setMostLiked(newRes)
  }

  return (
    <Layout>
      <Head />
      <div className="py-12 bg-white">
        <Carousel />
        {/* Editorial List */}
        <div className="w-full h-full mx-auto mt-6 md:max-w-6xl md:mt-16">
          <h2 className="text-2xl text-black font-bold mx-3 md:mb-4 md:text-3xl">
            Editorial
          </h2>
          <div className="ml-3 w-16 h-2 mb-4 md:w-16 md:h-3 md:mb-10 bg-primary"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 overflow-hidden mx-4">
            {editorial.map((data, i) => (
              <ComicItem data={data} key={i} />
            ))}
          </div>
        </div>

        {/* Most Liked List */}
        <div className="w-full h-full mx-auto mt-12 md:max-w-6xl md:mt-16">
          <h2 className="text-2xl text-black font-bold mx-3 md:mb-1 md:text-3xl">
            Most Liked
          </h2>
          <div className="ml-3 w-12 h-2 mb-4 md:mb-6 bg-primary"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 overflow-hidden mx-4">
            {mostLiked.map((data, i) => (
              <ComicMostLiked data={data} key={i} />
            ))}
          </div>
        </div>
        <div className="max-w-6xl m-auto py-16 px-4">
          <div className="text-5xl font-bold mb-4 text-black leading-normal text-center">
            Feature
          </div>
          <div className="md:flex">
            <div className="text-center flex-1 p-4 font-medium">
              <img src={`/yours.svg`} />
              <p className="text-xl text-black mb-3">Comic is 100% yours</p>
              <p className="text-gray-800">
                Read, lend, and sell your digital comic anytime you want
              </p>
            </div>
            <div className="text-center flex-1 p-4 font-medium">
              <img src={`/support.svg`} />
              <p className="text-xl text-black mb-3">
                Collecting is Supporting Creators
              </p>
              <p className="text-gray-800">
                Collect the collectibles NFTs by the authors to support them
                exppandig the universe they built
              </p>
            </div>
            <div className="text-center flex-1 p-4 font-medium">
              <img src={`/community.svg`} />
              <p className="text-xl text-black mb-3">
                Reading with The Community
              </p>
              <p className="text-gray-800">
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
          <div className="text-5xl font-bold mb-4 text-white leading-normal bg-primary inline-block">
            Create Now!
          </div>
          <div className="text-gray-800 mb-8 text-lg">
            Publishing your title with Paras Comic is quick and easy. Sell your
            digital collectibles of your IP and interact with your fans
            directly.
          </div>
          <div className="text-gray-800 mb-8">
            Build your community and share your work with comic buffs!
          </div>
          <Button onClick={() => router.push('/partner-with-us')} size="lg">
            Create with us
          </Button>
        </div>
      </div>
    </Layout>
  )
}
