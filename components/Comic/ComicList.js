import InfiniteScroll from 'react-infinite-scroll-component'
import ComicItem from 'components/Comic/ComicItem'
import { ComicListLoader } from './ComicListLoader'

const ComicList = ({ comics, fetchComics, hasMore }) => {
  return (
    <div className="max-w-6xl m-auto">
      <InfiniteScroll
        dataLength={comics.length}
        next={fetchComics}
        hasMore={hasMore}
        loader={<ComicListLoader />}
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 overflow-hidden">
          {comics.map((data, i) => (
            <ComicItem data={data} key={i} />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  )
}

export default ComicList
