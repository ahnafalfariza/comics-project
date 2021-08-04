import ChapterLoader from 'components/Chapter/ChapterLoader'

const ChapterListLoader = () => (
  <div>
    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((k) => {
      return (
        <div key={k} className="w-full mb-4">
          <ChapterLoader uniqueKey={k} />
        </div>
      )
    })}
  </div>
)

export default ChapterListLoader
