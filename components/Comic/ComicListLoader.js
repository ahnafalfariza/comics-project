import ContentLoader from 'react-content-loader'

export const ComicListLoader = ({ size = 8, col = 4, gap = 8 }) => (
  <div
    className={`grid grid-cols-2 md:grid-cols-${col} gap-4 md:gap-${gap} mt-8`}
  >
    {Array(size)
      .fill('')
      .map((item, idx) => (
        <div key={idx}>
          <ContentLoader
            speed={2}
            width="100%"
            height="100%"
            viewBox="0 0 275 380"
            backgroundColor="#F4F4F5"
            foregroundColor="#E4E4E7"
          >
            <rect x="0" y="0" rx="0" ry="0" width="275" height="380" />
          </ContentLoader>
        </div>
      ))}
  </div>
)
