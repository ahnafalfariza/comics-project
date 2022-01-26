import * as React from 'react'
import { useTabs } from '../contex'

const Tab = ({ children, index = 0, className, style }) => {
  const { currentPage, setPage } = useTabs()

  const buttonBaseStyle =
    'inline-flex relative items-center px-4 gap-3 outline-none font-medium text-lg md:text-2xl font-body z-10'
  const buttonTransition = 'transition duration-300 ease-in-out'

  let buttonActiveStyle = 'text-gray-400 hover:text-gray-600'
  if (currentPage === index) {
    buttonActiveStyle = 'text-black font-bold tab-border'
  }

  const buttonStyle = `${buttonBaseStyle} ${className}`
  const buttonTextStyle = `${buttonActiveStyle} ${buttonTransition} py-3 relative`

  return (
    <button
      className={buttonStyle}
      onClick={() => setPage(index)}
      style={style}
    >
      <div className={buttonTextStyle}>{children}</div>
    </button>
  )
}

Tab.defaultProps = {
  className: '',
}

export default Tab
