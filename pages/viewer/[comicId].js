import { useEffect, useRef, useState } from 'react'

import Layout from 'components/Layout'
import MenuTop from 'components/ViewerMenu/MenuTop'
import MenuBottom from 'components/ViewerMenu/MenuBottom'
import CommentListModal from 'components/Comment/CommentListModal'
import useStore from 'lib/store'
import axios from 'axios'
import { useRouter } from 'next/router'
import Head from 'components/Common/Head'
import { BounceLoader } from 'react-spinners'

const ChapterView = () => {
  const menuTopRef = useRef()
  const menuBottomRef = useRef()
  const router = useRouter()
  const [showMenu, setShowMenu] = useState(true)
  const [chapterData, setChapterData] = useState(null)
  const [chapterPageUrl, setChapterPageUrl] = useState([])

  const showComment = useStore((state) => state.showComment)

  const { comicId, chapterId } = router.query

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

  useEffect(() => {
    if (comicId && chapterId) {
      fetchChapterData(comicId, chapterId)
    }
  }, [chapterId, comicId])

  const fetchChapterData = async (comicId, chapterId) => {
    const response = await axios.get(`${process.env.COMIC_API_URL}/chapters`, {
      params: {
        comic_id: comicId,
        chapter_id: chapterId,
      },
    })
    const _chapterData = response.data.data.results[0]
    setChapterData(_chapterData || null)
    fetchChapterPage(_chapterData.metadata.page_count, comicId, chapterId)
  }

  const fetchChapterPage = async (numPage, comicId, chapterId) => {
    console.log(numPage)
    let url = []
    for (let i = 1; i <= numPage; i++) {
      url.push(
        `${process.env.COMIC_API_URL}/pages/${comicId}/${chapterId}/${i}`
      )
    }
    setChapterPageUrl(url)
  }

  return (
    <Layout showNav={false} showFooter={false} className="bg-black">
      <Head />
      <MenuTop ref={menuTopRef} showMenu={showMenu} />
      <MenuBottom ref={menuBottomRef} showMenu={showMenu} />
      <div className="max-w-xl m-auto md:p-4">
        {chapterPageUrl.map((url, i) => (
          <ChapterImagePage key={i} url={url} />
        ))}
      </div>
      <CommentListModal />
    </Layout>
  )
}

export default ChapterView

const ChapterImagePage = ({ url }) => {
  const [imageCh, setImageCh] = useState('')

  useEffect(() => {
    const fetchImage = async () => {
      const response = await axios.get(url, {
        responseType: 'blob',
      })
      const objectUrl = URL.createObjectURL(response.data)
      setImageCh([objectUrl])
    }
    fetchImage()
  }, [url])

  return (
    <div>
      {imageCh !== '' ? (
        <img src={imageCh} />
      ) : (
        <div className="h-96 flex justify-center items-center gray">
          <BounceLoader loading={true} color={'rgb(107, 114, 128)'} size={24} />
        </div>
      )}
    </div>
  )
}
