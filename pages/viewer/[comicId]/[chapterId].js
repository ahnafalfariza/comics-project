import { useEffect, useRef, useState } from 'react'

import Layout from 'components/Common/Layout'
import MenuTop from 'components/ViewerMenu/MenuTop'
import MenuBottom from 'components/ViewerMenu/MenuBottom'
import useStore from 'lib/store'
import axios from 'axios'
import { useRouter } from 'next/router'
import Head from 'components/Common/Head'
import BuyChapterModal from 'components/Modal/BuyChapterModal'
import ChapterImagePage from 'components/ViewerMenu/ChapterImagePage'
import ChapterNotAvailableModal from 'components/Modal/ChapterNotAvailableModal'
import ShareComponent from 'components/Common/ShareComponent'
import ButtonLikes from 'components/ViewerMenu/ButtonLikes'
import { parseImgUrl } from 'utils/common'
import CommentListNew from 'components/Comment/CommentListNew'
import LoginModal from 'components/Modal/LoginModal'
import near from 'lib/near'
import { linkDiscordVote } from 'constants/discordvote'

const ChapterView = ({ isLoading, chapterInfo }) => {
  const menuTopRef = useRef()
  const menuBottomRef = useRef()
  const viewerRef = useRef()
  const router = useRouter()

  const [showMenu, setShowMenu] = useState(true)
  const [chapterData, setChapterData] = useState(null)
  const [chapterPageUrl, setChapterPageUrl] = useState([])
  const [hasNext, setHasNext] = useState(null)
  const [activeLang, setActiveLang] = useState('en')
  const [delayCommentListNew, setDelayCommentListNew] = useState(true)

  const showComment = useStore((state) => state.showComment)

  const { comicId, chapterId } = router.query

  useEffect(() => {
    const handleClickOutsideMenu = (event) => {
      if (
        !menuTopRef?.current?.contains(event.target) &&
        !menuBottomRef?.current?.contains(event.target) &&
        viewerRef?.current?.contains(event.target) &&
        !showComment &&
        chapterData?.status === 'read'
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
  }, [
    menuTopRef,
    menuBottomRef,
    viewerRef,
    showMenu,
    showComment,
    chapterData?.status,
  ])

  useEffect(() => {
    if (comicId && chapterId && !isLoading) {
      setChapterPageUrl([])
      fetchChapterData(comicId, chapterId)
    }
  }, [chapterId, comicId, isLoading])

  useEffect(() => {
    if (
      chapterData &&
      chapterData.status === 'read' &&
      chapterData.lang &&
      activeLang
    ) {
      const lang = chapterData.lang[activeLang] ? activeLang : 'id'
      fetchChapterPage(
        chapterData.lang[lang],
        comicId,
        chapterId,
        chapterData.is_locked && chapterData?.price !== '0'
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chapterData, activeLang])

  useEffect(() => {
    setTimeout(() => {
      setDelayCommentListNew(false)
    }, 500)
  })

  const fetchChapterData = async (comicId, chapterId) => {
    const response = await axios.get(`${process.env.COMIC_API_URL}/chapters`, {
      params: {
        comic_id: comicId,
        chapter_ids: [chapterId, parseInt(chapterId) + 1],
      },
    })
    setHasNext(response.data.data.results.length > 1)

    const _chapterData = response.data.data.results[0]
    setChapterData(_chapterData || null)
  }

  const fetchChapterPage = async (numPage, comicId, chapterId, locked) => {
    let url = []
    const lang = chapterData.lang[activeLang] ? activeLang : 'id'
    for (let i = 1; i <= numPage; i++) {
      url.push(
        `${process.env.COMIC_API_URL}/pages/${
          locked ? '' : 'unlocked/'
        }${comicId}/${chapterId}/${i}/${lang}`
      )
    }
    setChapterPageUrl(url)
  }

  return (
    <Layout showNav={false} showFooter={false} className="bg-white">
      <Head
        title={`Read ${chapterInfo.metadata.title}`}
        description={chapterInfo.metadata.description}
        image={parseImgUrl(chapterInfo.metadata.media)}
      />
      <ChapterNotAvailableModal
        show={
          chapterData &&
          chapterData.lang &&
          Object.keys(chapterData.lang).length === 0
        }
      />
      {chapterData && !near.currentUser ? (
        <LoginModal
          show={chapterData?.status !== 'read' || false}
          hideCloseButton={true}
        />
      ) : chapterData && chapterData?.status !== 'read' ? (
        <BuyChapterModal
          active={chapterData?.status !== 'read' || false}
          data={chapterData}
          hideCloseButton={true}
        />
      ) : null}
      <MenuTop
        ref={menuTopRef}
        showMenu={showMenu}
        data={chapterData}
        activeLang={activeLang}
        setActiveLang={setActiveLang}
      />
      <MenuBottom
        ref={menuBottomRef}
        showMenu={showMenu}
        data={chapterData}
        hasNext={hasNext}
      />
      <div ref={viewerRef} className="min-h-screen">
        {chapterPageUrl.map((url) => (
          <ChapterImagePage key={url} url={url} />
        ))}
      </div>
      <div className="mt-8 mx-4">
        <div className="flex items-center justify-center">
          <ButtonLikes
            chapterId={chapterId}
            comicId={comicId}
            isLoading={isLoading}
          />
          <div>
            <div>Share Now</div>
            <ShareComponent
              title="Read this comic"
              withText={false}
              shareUrl={
                typeof window !== 'undefined'
                  ? window?.location?.origin +
                    `/comics/${comicId}/chapter?chapterId=${chapterId}`
                  : ''
              }
            />
          </div>
        </div>
        {linkDiscordVote[comicId] && (
          <div className="flex items-center justify-center mt-4">
            {/* eslint-disable-next-line react/jsx-no-target-blank */}
            <a
              href={linkDiscordVote[comicId]}
              target="_blank"
              className="mt-4 font-semibold bg-primary rounded-full tracking-wider px-8 py-3 text-white inline-block"
            >
              Vote in Discord
            </a>
          </div>
        )}
      </div>
      {!delayCommentListNew && (
        <div className="mt-8 mb-20 mx-4">
          <CommentListNew />
        </div>
      )}
    </Layout>
  )
}

export default ChapterView

export async function getServerSideProps({ params }) {
  const response = await axios.get(`${process.env.COMIC_API_URL}/chapters`, {
    params: {
      comic_id: params.comicId,
      chapter_id: params.chapterId,
    },
  })
  const chapterInfo = response.data.data.results[0] || null

  return {
    props: { chapterInfo },
  }
}
