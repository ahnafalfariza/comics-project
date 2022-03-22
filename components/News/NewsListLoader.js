import NewsLoader from './NewsLoader'

const NewsListLoader = () => (
  <div className="flex flex-wrap">
    {[1, 2, 3, 4, 5, 6].map((k) => {
      return (
        <div key={k} className="flex-shrink-0 w-full md:w-1/3 p-4">
          <NewsLoader uniqueKey={k} className="rounded-md" />
        </div>
      )
    })}
  </div>
)

export default NewsListLoader
