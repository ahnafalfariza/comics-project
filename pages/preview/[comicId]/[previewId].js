import { useEffect, useRef, useState } from 'react'

import Layout from 'components/Common/Layout'
import MenuTop from 'components/ViewerMenu/MenuTop'
import MenuBottom from 'components/ViewerMenu/MenuBottom'
import axios from 'axios'
import { useRouter } from 'next/router'
import Head from 'components/Common/Head'
import BuyChapterModal from 'components/Modal/BuyChapterModal'
import ChapterNotAvailableModal from 'components/Modal/ChapterNotAvailableModal'
import LoginModal from 'components/Modal/LoginModal'
import { BounceLoader } from 'react-spinners'
import { parseImgUrl } from 'utils/common'

const PreviewImagePage = ({ file, isLoading }) => {
  return !isLoading ? (
    <div className="max-w-3xl m-auto relative">
      <img src={`${parseImgUrl(file)}`} />
      <div className="absolute inset-0 bg-transparent z-0" />
    </div>
  ) : (
    <div className="h-96 flex justify-center items-center gray">
      <BounceLoader loading={true} color={'rgb(107, 114, 128)'} size={24} />
    </div>
  )
}

const ChapterPreview = ({ chapterInfo }) => {
  const menuTopRef = useRef()
  const menuBottomRef = useRef()
  const previewRef = useRef()
  const router = useRouter()

  const [showMenu, setShowMenu] = useState(true)
  const [chapterData, setChapterData] = useState(null)
  const [previewData, setPreviewData] = useState([])
  const [showLogin, setShowLogin] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isBuyChapterModal, setIsBuyChapterModal] = useState(false)

  const { comicId, previewId } = router.query

  useEffect(() => {
    const handleClickOutsideMenu = (event) => {
      if (
        !menuTopRef?.current?.contains(event.target) &&
        !menuBottomRef?.current?.contains(event.target)
      ) {
        setShowMenu(!showMenu)
      }
    }

    const handleScroll = () => {
      setShowMenu(false)
      let documentHeight = document.body.scrollHeight
      let currentScroll = window.scrollY + window.innerHeight
      let modifier = 1

      if (previewData?.length === 0) {
        modifier = -1
      }

      if (currentScroll + modifier > documentHeight) {
        setIsBuyChapterModal(true)
        setShowMenu(true)
      }
    }

    document.addEventListener('scroll', handleScroll)
    document.addEventListener('mousedown', handleClickOutsideMenu)

    return () => {
      document.removeEventListener('mousedown', handleClickOutsideMenu)
      document.removeEventListener('scroll', handleScroll)
    }
  }, [
    menuTopRef,
    menuBottomRef,
    previewRef,
    showMenu,
    chapterData?.status,
    previewData?.length,
  ])

  useEffect(() => {
    if (comicId && previewId) {
      fetchChapterData(comicId, previewId)
      fetchPreviewData(comicId, previewId)
    }
  }, [previewId, comicId])

  const onCloseBuyChapterModal = () => {
    setIsBuyChapterModal(!isBuyChapterModal)
  }

  const fetchChapterData = async (comicId, previewId) => {
    const response = await axios.get(`${process.env.COMIC_API_URL}/chapters`, {
      params: {
        comic_id: comicId,
        chapter_ids: [previewId, parseInt(previewId) + 1],
      },
    })

    const _chapterData = response.data.data.results[0]
    setChapterData(_chapterData || null)
  }

  const fetchPreviewData = async (comicId, previewId) => {
    setIsLoading(true)

    const response = await axios.get(
      `${process.env.COMIC_API_URL}/pages-preview/${comicId}/${previewId}`
    )

    const _previewData = response.data.data
    setPreviewData(_previewData)

    setIsLoading(false)
  }

  return (
    <Layout showNav={false} showFooter={false} className="bg-white">
      <Head
        title={`Preview ${chapterInfo.metadata.title}`}
        description={chapterInfo.metadata.description}
        image={parseImgUrl(chapterInfo.metadata.media)}
      />
      <ChapterNotAvailableModal
        show={previewData?.length === (0 || undefined)}
      />
      <BuyChapterModal
        active={isBuyChapterModal || false}
        data={chapterData}
        onClose={onCloseBuyChapterModal}
        hideCloseButton={false}
        isPreview
      />
      <MenuTop
        ref={menuTopRef}
        showMenu={showMenu}
        data={chapterData}
        isPreview
      />
      <MenuBottom
        ref={menuBottomRef}
        showMenu={showMenu}
        data={chapterData}
        isLoginModal={(event) => setShowLogin(event)}
        isPreview
      />
      <div ref={previewRef} className="min-h-screen h-screen">
        {previewData?.map((item, idx) => (
          <PreviewImagePage key={idx} file={item} isLoading={isLoading} />
        ))}
      </div>
      <LoginModal onClose={() => setShowLogin(false)} show={showLogin} />
    </Layout>
  )
}

export default ChapterPreview

export async function getServerSideProps({ params }) {
  const response = await axios.get(`${process.env.COMIC_API_URL}/chapters`, {
    params: {
      comic_id: params.comicId,
      chapter_id: params.previewId,
    },
  })
  const chapterInfo = response.data.data.results[0] || null

  return {
    props: { chapterInfo },
  }
}
