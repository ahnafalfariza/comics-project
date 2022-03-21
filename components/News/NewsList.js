import LinkToProfile from 'components/Common/LinkToProfile'
import Link from 'next/link'

import { parseImgUrl } from 'utils/common'

const NewsList = ({ data }) => {
  return (
    <div className="news-card rounded-md overflow-hidden border-dashed border-2 border-primary">
      <div className="relative z-10 bg-primary">
        <Link href={`/news/${data.slug}-${data._id}`}>
          <a>
            <div className="h-64 overflow-hidden m-auto cursor-pointer shadow-inner">
              <img
                className="h-64 w-full object-cover"
                src={parseImgUrl(data.thumbnail, null, {
                  width: `600`,
                })}
              />
            </div>
          </a>
        </Link>
      </div>
      <div className="flex flex-col p-4 -mt-1 h-44">
        <Link href={`/news/${data.slug}-${data._id}`}>
          <a>
            <div className="cursor-pointer">
              <div
                className="overflow-hidden"
                style={{
                  maxHeight: `3.75rem`,
                }}
              >
                <h1 className="text-black text-xl font-bold line-clamp-2 border-b-2 border-transparent">
                  {data.title}
                </h1>
              </div>
              <div
                className="overflow-hidden mt-2"
                style={{
                  maxHeight: `3.2rem`,
                }}
              >
                <p className="text-black line-clamp-2">{data.description}</p>
              </div>
            </div>
          </a>
        </Link>
        <div className="flex mt-auto">
          <p className="text-black">
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

export default NewsList
