import React from 'react'
import ContentLoader from 'react-content-loader'

const CardLoader = (props) => (
  <ContentLoader
    speed={2}
    width="100%"
    height="100%"
    viewBox="0 0 275 380"
    backgroundColor="#F4F4F5"
    foregroundColor="#E4E4E7"
    {...props}
  >
    <rect x="0" y="0" rx="20" ry="20" width="275" height="380" />
  </ContentLoader>
)

export default CardLoader
