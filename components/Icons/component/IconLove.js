import React from 'react'
import { iconDefaultProps } from '../IconProps'

const IconLove = ({
  size,
  color,
  stroke = 'white',
  strokeWidth = 2,
  ...props
}) => (
  <svg
    width={size}
    height={size}
    className="w-6 h-6"
    fill={color}
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      stroke={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={strokeWidth}
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
)

IconLove.defaultProps = {
  ...iconDefaultProps,
}

export default IconLove
