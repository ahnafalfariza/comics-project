import TokenLoader from './TokenLoader'

const CardListLoader = () => (
  <div className="flex flex-wrap">
    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((k) => {
      return (
        <div
          key={k}
          className="w-1/2 md:w-1/3 lg:w-1/4 flex-shrink-0 p-8 relative "
        >
          <TokenLoader uniqueKey={k} />
        </div>
      )
    })}
  </div>
)

export default CardListLoader
