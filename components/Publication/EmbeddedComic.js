import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'

import { parseImgUrl } from 'utils/common'

const EmbeddedComic = ({ comicId }) => {
  const [comic, setComic] = useState(null)

  useEffect(() => {
    fetchComic()
  }, [])

  const fetchComic = async () => {
    const url = process.env.COMIC_API_URL
    const res = await axios({
      url: url + `/comics`,
      method: 'GET',
      params: {
        comic_id: comicId,
      },
    })

    const _token = (await res.data.data.results[0]) || null
    setComic(_token)
  }

  if (!comic) return null

  return (
    <div>
      <Link href={`/comics/${comic.comic_id}/chapter`} shallow={true}>
        <a className="cursor-pointer">
          <div className="flex flex-row flex-wrap ">
            <div className="w-full h-full rounded">
              <div
                className="mx-auto w-52 h-72 lg:w-56 lg:h-80 flex-none bg-no-repeat bg-center bg-cover shadow-xl"
                style={{
                  backgroundImage: `url(${parseImgUrl(comic?.media)})`,
                }}
              />
            </div>
          </div>
        </a>
      </Link>
      <div className="mt-2 w-52 lg:w-60 mx-auto">
        <Link href={`/comics/${comic.comic_id}/chapter`} shallow={true}>
          <a className="text-2xl hover:underline font-bold text-black">
            {comic?.title}
          </a>
        </Link>
      </div>
      <div className="flex flex-row flex-wrap text-sm text-black items-center w-52 lg:w-60 mx-auto">
        <span className="mr-1">comic by</span>
        <Link href={`/${comic.creator_id}`} shallow={true}>
          <a>
            <span className="font-bold cursor-pointer truncate text-primary hover:text-primary hover:underline">
              {comic?.author_ids[0]}
            </span>
          </a>
        </Link>
        {comic?.isCreator && (
          <span className="ml-1">
            <svg
              width="16"
              height="14"
              viewBox="0 0 18 17"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.8095 8.5L15.8343 6.24143L16.1095 3.25429L13.1871 2.59048L11.6571 0L8.90476 1.1819L6.15238 0L4.62238 2.58238L1.7 3.2381L1.97524 6.23333L0 8.5L1.97524 10.7586L1.7 13.7538L4.62238 14.4176L6.15238 17L8.90476 15.81L11.6571 16.9919L13.1871 14.4095L16.1095 13.7457L15.8343 10.7586L17.8095 8.5Z"
                fill="#00BBDB"
              />
              <path
                d="M7.3956 12.1429L5.66675 6.494H7.62684L8.74022 10.9039H9.06951L10.1855 5.66675H12.1429L10.4141 12.1429H7.3956Z"
                fill="#FFFFFF"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.1191 5.26196H14.4169L13.6074 6.88101H10.1191V5.26196Z"
                fill="#FFFFFF"
              />
            </svg>
          </span>
        )}
      </div>
    </div>
  )
}

export default EmbeddedComic
