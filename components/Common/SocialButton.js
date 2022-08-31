import React from 'react'
import PropTypes from 'prop-types'
import { IconFacebook, IconGoogle, IconTwitter } from 'components/Icons'

const SocialButton = ({
  isDisabled,
  isFullWidth,
  account,
  className,
  style,
  onClick,
}) => {
  const buttonBaseStyle =
    'inline-block text-center relative whitespace-nowrap rounded-full font-medium text-body'
  const buttonTransition = 'transition duration-150 ease-in-out'

  let buttonVariantStyle
  let signInLabel
  let socialIcon
  const buttonSizeStyle = 'py-2 px-8 text-sm'
  switch (account) {
    case 'google':
      buttonVariantStyle = `bg-white text-gray shadow-md ${
        !isDisabled && 'hover:bg-opacity-70'
      }`
      signInLabel = 'SIGN IN WITH GOOGLE'
      socialIcon = <IconGoogle size={36} className="float-left"></IconGoogle>
      break
    case 'facebook':
      buttonVariantStyle = `bg-[#1a77f2] text-white ${
        !isDisabled && 'hover:bg-opacity-70'
      }`
      signInLabel = 'SIGN IN WITH FACEBOOK'
      socialIcon = (
        <IconFacebook size={36} className="float-left"></IconFacebook>
      )
      break
    case 'twitter':
      buttonVariantStyle = `bg-[#009df7] text-white ${
        !isDisabled && 'hover:bg-opacity-70'
      }`
      signInLabel = 'SIGN IN WITH TWITTER'
      socialIcon = <IconTwitter size={36} className="float-left"></IconTwitter>
      break
    default:
      break
  }

  let buttonStyle = `${className} ${buttonBaseStyle} ${buttonTransition} ${buttonVariantStyle} ${buttonSizeStyle}`

  if (isDisabled) {
    const buttonDisabledStyle = 'cursor-default opacity-60 saturate-50'
    buttonStyle = `${buttonStyle} ${buttonDisabledStyle}`
  }

  if (isFullWidth) {
    const buttonFullWidth = 'w-full block'
    buttonStyle = `${buttonStyle} ${buttonFullWidth}`
  }

  return (
    <button
      disabled={isDisabled}
      className={buttonStyle}
      style={style}
      onClick={onClick}
    >
      <div className="flex items-center">
        {socialIcon} <p className="w-full">{signInLabel}</p>
      </div>
    </button>
  )
}

SocialButton.defaultProps = {
  isDisabled: false,
  isFullWidth: false,
  account: 'google',
  className: '',
}

SocialButton.propTypes = {
  isDisabled: PropTypes.bool,
  isFullWidth: PropTypes.bool,
  account: PropTypes.oneOf(['google', 'twitter', 'facebook']),
  onClick: PropTypes.func,
}

export default SocialButton
