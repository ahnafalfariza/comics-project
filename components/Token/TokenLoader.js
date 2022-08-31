import React from 'react'
import ContentLoader from 'react-content-loader'

const TokenLoader = (props) => (
  <ContentLoader
    speed={2}
    width="100%"
    height="100%"
    viewBox="0 0 275 570"
    backgroundColor="#F4F4F5"
    foregroundColor="#E4E4E7"
    {...props}
  >
    <rect x="0" y="0" rx="20" ry="20" width="275" height="380" />
    <rect x="78" y="435" rx="4" ry="4" width="120" height="20" />
    <rect x="58" y="470" rx="4" ry="4" width="160" height="60" />
    <rect x="68" y="550" rx="4" ry="4" width="140" height="20" />
  </ContentLoader>
)

export default TokenLoader
