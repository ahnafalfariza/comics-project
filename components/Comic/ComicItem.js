import { useRouter } from 'next/router'
import { parseImgUrl } from 'utils/common'
import Token from 'components/Token/Token'
import Link from 'next/link'

const ComicItem = ({ data, key, showLike = false }) => {
  const router = useRouter()

  return (
    <div key={key}>
      <a
        onClick={(e) => e.preventDefault()}
        href={`/comics/${data.comic_id}/chapter`}
      >
        <div
          className="mb-2 cursor-pointer hover:opacity-90 transition ease-in-out duration-300"
          onClick={() => router.push(`/comics/${data.comic_id}/chapter`)}
        >
          <Token
            imgUrl={parseImgUrl(data.media, null, {
              width: `300`,
            })}
            imgBlur="U0Csjj-;fQ-;%MfQfQfQfQfQfQfQ%MfQfQfQ"
            hoverMouse={false}
            initialRotate={{ x: 0, y: 0 }}
            shadow="none"
            borderRadius="0px"
            disableFlip
          />
        </div>
      </a>
      <div className="ml-1">
        <Link href={`/comics/${data.comic_id}/chapter`}>
          <a className="text-black font-bold text-xl md:text-2xl truncate cursor-pointer hover:text-opacity-80">
            {data.title}
          </a>
        </Link>
        <p className="text-comic-gray-primary font-bold text-xs mb-3 truncate">
          {data.author_ids}
        </p>
        {showLike && (
          <div className="flex flex-row">
            <p className="text-gray-800 text-sm font-bold md:text-xs">
              3.1 Likes
            </p>
          </div>
        )}
        <Link href={`/comics/${data.comic_id}/chapter`}>
          <a className="text-primary font-bold text-sm cursor-pointer hover:opacity-80 whitespace-nowrap">
            See Chapters
          </a>
        </Link>
      </div>
    </div>
  )
}

export default ComicItem
