import React from 'react'
import ContentLoader from 'react-content-loader'

const ChapterLoader = (props) => (
  <ContentLoader
    speed={2}
    width="100%"
    height="150px"
    backgroundColor="#1D1D1D"
    foregroundColor="#282828"
    {...props}
  >
    <rect x="0" y="0" rx="4" ry="4" width="100%" height="100%" />
  </ContentLoader>
)

export default ChapterLoader
