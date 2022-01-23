import { useRouter } from 'next/router'
import { parseImgUrl } from 'utils/common'
import Token from 'components/Token/Token'

const ComicItem = ({ data, key }) => {
  const router = useRouter()

  return (
    <div key={key}>
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
      <div className="ml-1">
        <h4
          className="text-black font-bold text-xl md:text-2xl truncate cursor-pointer hover:text-opacity-80"
          onClick={() => router.push(`/comics/${data.comic_id}/chapter`)}
        >
          {data.title}
        </h4>
        <p className="text-comic-gray-primary font-bold text-xs mb-3 truncate">
          {data.author_ids}
        </p>
        <p
          className="text-primary font-bold text-sm cursor-pointer hover:opacity-80 w-1 whitespace-nowrap"
          onClick={() => router.push(`/comics/${data.comic_id}/chapter`)}
        >
          See Chapters
        </p>
      </div>
    </div>
  )
}

export default ComicItem
