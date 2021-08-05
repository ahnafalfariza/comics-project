import ChapterList from 'components/Chapter/ChapterList'
import InfiniteScroll from 'react-infinite-scroll-component'
import ChapterListLoader from 'components/Chapter/ChapterListLoader'

const Overview = ({ chapters, hasMore, fetchData }) => {
  return (
    <div className="max-w-5xl mx-auto my-9">
      {chapters.length === 0 && !hasMore && (
        <div className="w-full">
          <div className="m-auto text-2xl text-gray-600 font-semibold py-32 text-center">
            <div className="w-40 m-auto">
              <img src="/cardstack.png" className="opacity-75" />
            </div>
            <p className="mt-4">No Chapter</p>
          </div>
        </div>
      )}
      <InfiniteScroll
        dataLength={chapters.length}
        next={fetchData}
        hasMore={hasMore}
        loader={<ChapterListLoader />}
      >
        {chapters.map((data, i) => {
          return <ChapterList key={i} data={data} />
        })}
      </InfiniteScroll>
    </div>
  )
}

export default Overview
