import LinkToProfile from 'components/Common/LinkToProfile'
import Link from 'next/link'
import { useEffect } from 'react'
import { useRef, useState } from 'react'

import { parseImgUrl } from 'utils/common'

const PublicationList = ({ data }) => {
  const [height, setHeight] = useState(0)
  const ref = useRef()

  useEffect(() => {
    if (ref.current.clientWidth !== 0) {
      setHeight(ref.current.clientWidth / 2)
    }
  }, [ref])

  return (
    <div className="publication-card rounded-md overflow-hidden shadow-xl drop-shadow-xl">
      <div className="relative z-10 bg-primary">
        <Link href={`/publication/${data.slug}-${data._id}`}>
          <a>
            <div
              ref={ref}
              className="aspect-[2/1] overflow-hidden m-auto cursor-pointer shadow-inner w-full"
              height={{ height }}
            >
              <img
                className="w-full object-cover"
                src={parseImgUrl(data.thumbnail, null, {
                  width: `600`,
                })}
              />
            </div>
          </a>
        </Link>
      </div>
      <div className="flex flex-col p-4 -mt-1 h-44">
        <Link href={`/publication/${data.slug}-${data._id}`}>
          <a>
            <div className="cursor-pointer">
              <div
                className="overflow-hidden"
                style={{
                  maxHeight: `3.75rem`,
                }}
              >
                <h1 className="text-black text-lg font-bold line-clamp-2 border-b-2 border-transparent">
                  {data.title}
                </h1>
              </div>
              <div
                className="overflow-hidden mt-2"
                style={{
                  maxHeight: `3.2rem`,
                }}
              >
                <p className="text-black line-clamp-2 text-sm">
                  {data.description}
                </p>
              </div>
            </div>
          </a>
        </Link>
        <div className="flex mt-auto">
          <p className="text-black text-sm">
            <span className="capitalize">
              <a className="font-semibold">{data.type}</a>
            </span>
            <span className="px-2">|</span>
            <LinkToProfile
              accountId={data.author_id}
              className="font-semibold hover:border-primary text-primary"
            />
          </p>
        </div>
      </div>
    </div>
  )
}

export default PublicationList
