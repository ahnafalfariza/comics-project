import { forwardRef } from 'react'

import { IconGift, IconMessageCircle } from 'components/Icons'

const MenuBottom = forwardRef(({ showMenu }, ref) => {
  return (
    <div
      ref={ref}
      className={`fixed inset-x-0 bottom-0 overflow-hidden transform transition-transform ease-in-out duration-300 ${
        showMenu ? 'translate-y-0' : 'translate-y-20'
      }`}
    >
      <div className="bg-background relative">
        <div className="flex max-w-xl m-auto p-4 items-center justify-between">
          <div className="flex items-center">
            <IconGift size={20} color="#ffffff" />
            <p className="text-white ml-2 text-sm">Support</p>
            <IconMessageCircle size={20} color="#ffffff" className="ml-4" />
            <p className="text-white ml-2 text-sm">Comment</p>
          </div>
          <div>
            <p className="text-white">Ch 4</p>
          </div>
        </div>
      </div>
    </div>
  )
})
MenuBottom.displayName = 'MenuBottom'

export default MenuBottom
