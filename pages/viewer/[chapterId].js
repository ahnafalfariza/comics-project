import { useEffect, useRef, useState } from 'react'

import Layout from 'components/Layout'
import MenuTop from 'components/ViewerMenu/MenuTop'
import MenuBottom from 'components/ViewerMenu/MenuBottom'
import CommentListModal from 'components/Comment/CommentListModal'
import useStore from 'lib/store'

const ChapterView = () => {
  const menuTopRef = useRef()
  const menuBottomRef = useRef()
  const [showMenu, setShowMenu] = useState(true)

  const showComment = useStore((state) => state.showComment)

  useEffect(() => {
    const handleClickOutsideMenu = (event) => {
      if (
        menuTopRef.current &&
        menuBottomRef.current &&
        !menuTopRef.current.contains(event.target) &&
        !menuBottomRef.current.contains(event.target) &&
        !showComment
      ) {
        setShowMenu(!showMenu)
      }
    }

    const handleScroll = () => {
      if (!showComment) {
        setShowMenu(false)
      }
    }

    document.addEventListener('scroll', handleScroll)
    document.addEventListener('mousedown', handleClickOutsideMenu)

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideMenu)
      document.removeEventListener('scroll', handleScroll)
    }
  }, [menuTopRef, menuBottomRef, showMenu, showComment])

  return (
    <Layout showNav={false} className="bg-black">
      <MenuTop ref={menuTopRef} showMenu={showMenu} />
      <MenuBottom ref={menuBottomRef} showMenu={showMenu} />
      <div className="bg-red-200 h-screen" />
      <div className="bg-red-300 h-screen" />
      <CommentListModal />
    </Layout>
  )
}

export default ChapterView
