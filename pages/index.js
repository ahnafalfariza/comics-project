import Head from 'components/Common/Head'
import Layout from 'components/Common/Layout'
import Carousel from 'components/Common/Carousel'
import axios from 'axios'
import { useEffect, useState } from 'react'
import ComicItem from 'components/Comic/ComicItem'
import ComicMostLiked from 'components/Comic/ComicMostLiked'

export default function Home() {
  const [editorial, setEditorial] = useState([])

  useEffect(() => {
    fetchEditorial()
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
          <h2 className="text-2xl text-black font-bold mx-3 md:mb-4 md:text-3xl">
            Most Liked
          </h2>
          <div className="ml-3 w-16 h-2 mb-4 md:w-16 md:h-3 md:mb-10 bg-primary"></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 overflow-hidden mx-4">
            {editorial.map((data, i) => (
              <ComicMostLiked data={data} key={i} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}
