import CardLoader from './CardLoader'

const CardListLoader = ({ size = 12, className }) => (
  <div className="flex flex-wrap">
    {[...Array(size).keys()].map((k) => {
      return (
        <div
          key={k}
          className={`w-1/2 md:w-1/3 lg:w-1/4 flex-shrink-0 p-2 md:p-4 relative ${className}`}
        >
          <CardLoader uniqueKey={k} />
        </div>
      )
    })}
  </div>
)

export default CardListLoader
