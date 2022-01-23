import Head from 'components/Common/Head'
import Layout from 'components/Common/Layout'
import Carousel from 'components/Common/Carousel'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { parseImgUrl } from 'utils/common'
import Link from 'next/link'
import { IconLove } from 'components/Icons'

export default function Home() {
  const [editorial, setEditorial] = useState([])

  useEffect(() => {
    fetchEditorial()
  }, [])

  const fetchEditorial = async () => {
    const res = await axios.get(`https://comic-api-mainnet.paras.id/comics`, {
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
        <div className="w-full h-full mx-auto mt-6 md:max-w-6xl md:mt-10">
          <h2 className="text-xl text-black font-bold my-4 mx-3 md:text-3xl">
            Editorial
          </h2>
          <div className="grid grid-cols-2 justify-items-stretch overflow-hidden md:flex md:flex-row md:justify-start md:items-start">
            {editorial.map((data, i) => (
              <div
                key={i}
                className="flex flex-col w-full mr-0 md:mr-6 md:w-52"
              >
                <div className="cursor-pointer relative h-52 w-auto md:h-72 md:w-52 md:px-0">
                  <Link href={`comics/${data.comic_id}`}>
                    <a>
                      <img
                        src={parseImgUrl(data.media)}
                        className="object-fill h-full w-full transform transition ease-in-out duration-50 hover:-translate-y-2"
                      />
                    </a>
                  </Link>
                </div>
                <div className="flex flex-col justify-between md:h-full md:mt-3">
                  <div>
                    <Link href={`comics/${data.comic_id}`}>
                      <a className="w-full">
                        <p className="truncate font-bold overflow-hidden text-sm px-2 md:text-lg md:px-0 hover:border-b-2">
                          {data.title}
                        </p>
                        <p className="truncate overflow-hidden text-gray-400 text-xxs px-2 md:text-xs md:font-bold md:grow-0 md:px-0 md:-mt-1">
                          {data.author_ids.join(', ')}
                        </p>
                      </a>
                    </Link>
                  </div>
                  <div>
                    <a>
                      <p className="text-primary text-xs font-bold justify-self-end h-auto mt-3 px-2 md:text-md md:mt-2 md:px-0">
                        See Chapters
                      </p>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Liked List */}
        <div className="w-full h-full mx-auto mt-12 md:max-w-6xl md:mt-10">
          <h2 className="text-xl text-black font-bold my-4 mx-3 md:text-3xl">
            Most Liked
          </h2>
          <div className="grid grid-cols-2 justify-items-stretch overflow-hidden md:grid-cols-4 md:w-full">
            {editorial.map((data, i) => (
              <div
                key={i}
                className="flex flex-col w-full my-2 md:grid md:grid-cols-2 md:my-0"
              >
                <div className="cursor-pointer relative h-52 w-auto md:h-40 md:w-auto md:mr-3">
                  <Link href={`comics/${data.comic_id}`}>
                    <a>
                      <img
                        src={parseImgUrl(data.media)}
                        className="object-fill h-full w-full"
                      />
                    </a>
                  </Link>
                </div>
                <div className="flex flex-col justify-between overflow-hidden ml-2 md:w-full md:ml-0">
                  <div>
                    <Link href={`comics/${data.comic_id}`}>
                      <a>
                        <p className="truncate font-semibold -mb-1 overflow-hidden hover:underline md:text-md md:mb-0 md:font-bold">
                          {data.title}
                        </p>
                      </a>
                    </Link>
                    <p className="text-gray-400 font-normal text-xs md:text-xs">
                      {data.author_ids.join(', ')}
                    </p>
                  </div>
                  <div className="flex flex-row items-center justify-self-end grow mt-2 md:flex-col md:items-start md:mt-0">
                    <div className="flex flex-row">
                      <IconLove size={18} color={'#00BBDB'} />
                      <p className="text-primary text-sm font-bold md:text-xs">
                        3.1 Likes
                      </p>
                    </div>
                    <Link href={`comics/${data.comic_id}`}>
                      <a className="hidden text-primary font-bold flex-1 hover:underline md:block">
                        See Chapter
                      </a>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  )
}
