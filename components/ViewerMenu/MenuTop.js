import { forwardRef } from 'react'

import { IconArrow, IconShare } from 'components/Icons'
import { useRouter } from 'next/router'

const MenuTop = forwardRef(({ showMenu }, ref) => {
  const router = useRouter()

  const onClickBack = () => {
    router.push(`/overview/${router.query.comicId}`)
  }

  return (
    <div
      ref={ref}
      className={`fixed inset-x-0 overflow-hidden transform transition-transform ease-in-out duration-300 ${
        showMenu ? 'translate-y-0' : '-translate-y-20'
      }`}
    >
      <div className="bg-background relative">
        <div className="flex max-w-xl m-auto p-4 items-center">
          <IconArrow
            size={20}
            transform="scale(-1,1)"
            color="#ffffff"
            className="cursor-pointer"
            onClick={onClickBack}
          />
          <p className="text-white ml-4 flex-1 md:text-base lg:text-lg">
            Paradigm - Chapter 1
          </p>
          <IconShare size={20} color="#ffffff" className="cursor-pointer" />
        </div>
      </div>
    </div>
  )
})
MenuTop.displayName = 'MenuTop'

export default MenuTop
