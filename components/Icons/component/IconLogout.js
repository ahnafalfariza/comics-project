import React from 'react'
import { iconDefaultProps } from '../IconProps'

const IconLogout = ({ size, color, ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M3.5 3h8v4.9h1V3a1 1 0 0 0-1-1h-8a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1h-9V3z"
      fill={color}
    />
    <path
      d="M14.08 8.64a.5.5 0 0 0-.705.705L15.065 11h-7.25a.5.5 0 0 0 0 1h7.25l-1.69 1.73a.5.5 0 1 0 .705.705l2.92-2.9-2.92-2.895z"
      fill={color}
    />
  </svg>
)

IconLogout.defaultProps = {
  ...iconDefaultProps,
}

export default IconLogout
