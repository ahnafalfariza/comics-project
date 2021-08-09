import { forwardRef } from 'react'

import { IconArrow, IconShare } from 'components/Icons'

const MenuTop = forwardRef(({ showMenu }, ref) => {
  return (
    <div
      ref={ref}
      className={`fixed inset-x-0 overflow-hidden transform transition-transform ease-in-out duration-300 ${
        showMenu ? 'translate-y-0' : '-translate-y-20'
      }`}
    >
      <div className="bg-background relative">
        <div className="flex max-w-xl m-auto p-4 items-center">
          <IconArrow size={20} transform="scale(-1,1)" color="#ffffff" />
          <p className="text-white ml-4 flex-1 text-sm md:text-base lg:text-lg">
            Paradigm - Chapter 1
          </p>
          <IconShare size={20} color="#ffffff" />
        </div>
      </div>
    </div>
  )
})
MenuTop.displayName = 'MenuTop'

export default MenuTop
