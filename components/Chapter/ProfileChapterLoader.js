import React from 'react'
import ContentLoader from 'react-content-loader'

const ProfileChapterLoader = (props) => (
  <ContentLoader
    speed={2}
    width="100%"
    height="250px"
    backgroundColor="#F4F4F5"
    foregroundColor="#E4E4E7"
    {...props}
  >
    <rect x="0" y="0" rx="8" ry="8" width="100%" height="100%" />
  </ContentLoader>
)

export default ProfileChapterLoader
