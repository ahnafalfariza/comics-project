import React from 'react'
import ContentLoader from 'react-content-loader'

const CardLoader = (props) => (
  <ContentLoader
    speed={2}
    width="100%"
    height="100%"
    viewBox="0 0 275 380"
    backgroundColor="#1D1D1D"
    foregroundColor="#282828"
    {...props}
  >
    <rect x="0" y="0" rx="20" ry="20" width="275" height="380" />
  </ContentLoader>
)

export default CardLoader
