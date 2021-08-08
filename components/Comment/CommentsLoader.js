const { default: ContentLoader } = require('react-content-loader')

const CommentLoader = (props) => (
  <ContentLoader
    speed={2}
    width={488}
    height={184}
    viewBox="0 0 488 184"
    backgroundColor="#1D1D1D"
    foregroundColor="#282828"
    {...props}
  >
    <circle cx="18" cy="18" r="18" />
    <rect x="48" y="11" rx="5" ry="5" width="100" height="16" />
    <rect x="160" y="11" rx="5" ry="5" width="60" height="16" />
    <rect x="0" y="56" rx="3" ry="3" width="452" height="12" />
    <rect x="0" y="82" rx="3" ry="3" width="452" height="12" />
    <rect x="0" y="108" rx="3" ry="3" width="240" height="12" />
    <rect x="0" y="138" rx="5" ry="5" width="100" height="20" />
  </ContentLoader>
)

const CommentsLoader = () => {
  return (
    <div className="px-4 pt-4">
      <CommentLoader />
      <CommentLoader />
      <CommentLoader />
    </div>
  )
}

export default CommentsLoader
