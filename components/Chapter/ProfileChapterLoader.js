import React from 'react'
import ContentLoader from 'react-content-loader'

const ProfileChapterLoader = (props) => (
  <ContentLoader
    speed={2}
    width="100%"
    height="250px"
    backgroundColor="#1D1D1D"
    foregroundColor="#282828"
    {...props}
  >
    <rect x="0" y="0" rx="8" ry="8" width="100%" height="100%" />
  </ContentLoader>
)

export default ProfileChapterLoader
