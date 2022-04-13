import InfiniteScroll from 'react-infinite-scroll-component'
import ComicItem from 'components/Comic/ComicItem'
import { ComicListLoader } from './ComicListLoader'

const ComicList = ({ comics, fetchComics, hasMore, size = 'big' }) => {
  const col = size === 'big' ? 4 : 5
  const gap = size === 'big' ? 8 : 4

  return (
    <div className="max-w-6xl m-auto">
      <InfiniteScroll
        dataLength={comics.length}
        next={fetchComics}
        hasMore={hasMore}
        loader={
          <ComicListLoader
            size={comics.length === 0 ? 8 : 4}
            gap={gap}
            col={col}
          />
        }
      >
        <div
          className={`grid grid-cols-2 md:grid-cols-${col} gap-4 md:gap-${gap} overflow-hidden`}
        >
          {comics.map((data, i) => (
            <ComicItem data={data} key={i} />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  )
}

export default ComicList
