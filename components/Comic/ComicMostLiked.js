import { parseImgUrl } from 'utils/common'
import { useRouter } from 'next/router'
import Token from 'components/Token/Token'

const ComicMostLiked = ({ data, key }) => {
  const router = useRouter()

  return (
    <div key={key} className="block md:flex md:flex-row md:w-full">
      <div
        className="w-full md:h-40 cursor-pointer hover:opacity-90 transition ease-in-out duration-300 md:w-1/2"
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
      <div className="ml-1 w-full md:w-1/2 md:flex md:flex-col md:justify-between">
        <div>
          <h4
            className="text-black font-bold text-xl md:text-2xl truncate cursor-pointer hover:text-opacity-80"
            onClick={() => router.push(`/comics/${data.comic_id}/chapter`)}
          >
            {data.title}
          </h4>
          <p className="text-comic-gray-primary font-bold text-xs mb-3 truncate">
            {data.author_ids}
          </p>
        </div>
        <div>
          <div className="flex flex-row">
            <p className="text-gray-800 text-sm font-bold md:text-xs">
              3.1 Likes
            </p>
          </div>
          <p
            className="text-primary font-bold text-sm cursor-pointer hover:opacity-80 w-1 whitespace-nowrap"
            onClick={() => router.push(`/comics/${data.comic_id}/chapter`)}
          >
            See Chapters
          </p>
        </div>
      </div>
    </div>
  )
}

export default ComicMostLiked
