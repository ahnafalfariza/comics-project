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
            size={comics.length === 0 ? col * 2 : col}
            gap={gap}
            col={col}
          />
        }
      >
        <div
          className={`grid ${
            size === 'big'
              ? 'md:grid-cols-4 md:gap-8'
              : 'md:grid-cols-5 md:gap-4'
          } grid-cols-2 gap-4 overflow-hidden`}
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
