import { useEffect, useRef, useState } from 'react'

import { IconArrow } from 'components/Icons'
import { useRouter } from 'next/router'
import axios from 'axios'
import Token from 'components/Token/Token'
import { parseImgUrl } from 'utils/common'
import comicsStyles from 'styles/Comics.module.css'
import Link from 'next/link'
import BuyChapterModal from 'components/Modal/BuyChapterModal'
import { sentryCaptureException } from 'lib/sentry'

const LIMIT = 8

const ChapterListProfile = ({
  comicId = 'paradigm',
  comicTitle = 'Paradigm',
  comicCover = 'https://d30womf5coomej.cloudfront.net/sa/62/7b09e240-fd2a-4e9c-ac85-d4b54ea39778_z.jpg',
}) => {
  const shelvesRef = useRef()
  const loader = useRef()
  const router = useRouter()

  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRigthArrow] = useState(false)
  const [intersecting, setIntersecting] = useState(false)

  const [tokens, setTokens] = useState([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isFetching, setIsFetching] = useState(false)

  const [activeTokenId, setActiveTokenId] = useState(null)
  const [activeChapter, setActiveChapter] = useState(null)
  const [isFetchingChapter, setIsFetchingChapter] = useState(false)

  useEffect(() => {
    var options = {
      root: null,
      rootMargin: '0px',
      threshold: 0,
    }
    const observer = new IntersectionObserver(handleObserver, options)
    if (loader.current) {
      observer.observe(loader.current)
    }
  }, [loader])

  useEffect(() => {
    if (intersecting && hasMore) {
      fetchOwnerTokens()
      setIntersecting(false)
    }
  }, [fetchOwnerTokens, intersecting, hasMore])

  // eslint-disable-next-line
  useEffect(async () => {
    if (router.query) {
      await fetchOwnerTokens()
    }
  }, [fetchOwnerTokens, router.query])

  // eslint-disable-next-line
  const fetchOwnerTokens = async () => {
    if (!hasMore || isFetching) {
      return
    }

    setIsFetching(true)
    const res = await axios(
      `${process.env.COMIC_API_URL}/tokens?comic_id=${comicId}&owner_id=${
        router.query.userId
      }&__skip=${page * LIMIT}&__limit=${LIMIT}`
    )
    const newData = await res.data.data

    const newTokens = [...(tokens || []), ...newData.results]
    setTokens(newTokens)
    setPage(page + 1)
    if (newData.results.length < LIMIT) {
      setHasMore(false)
    } else {
      setHasMore(true)
    }
    setIsFetching(false)
  }

  const handleObserver = (entities) => {
    const target = entities[0]
    if (target.isIntersecting) {
      setIntersecting(target.isIntersecting)
    }
  }

  useEffect(() => {
    const scroll = (e) => {
      const newScrollPosition = e.target.scrollLeft
      const shouldShowLeftArrow = newScrollPosition !== 0
      const shouldShowRightArrow =
        newScrollPosition + e.target.offsetWidth <= e.target.scrollWidth - 2

      setShowLeftArrow(shouldShowLeftArrow)
      setShowRigthArrow(shouldShowRightArrow)
    }

    if (shelvesRef.current) {
      shelvesRef.current.addEventListener('scroll', scroll)
    }
    // eslint-disable-next-line
    return () => shelvesRef.current?.removeEventListener('scroll', scroll)
  }, [shelvesRef])

  const scrollShelves = (direction) => {
    if (shelvesRef) {
      const currentScroll = shelvesRef.current.scrollLeft
      const scrollTo =
        direction === 'left' ? currentScroll - 200 : currentScroll + 200

      shelvesRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth',
      })
    }
  }

  const openChapterModal = async (tokenId, comicId, chapterId) => {
    setIsFetchingChapter(true)
    setActiveChapter(true)
    setActiveTokenId(tokenId)

    try {
      const response = await axios.get(
        `${process.env.COMIC_API_URL}/chapters`,
        {
          params: {
            comic_id: comicId,
            chapter_id: chapterId,
            __skip: 0,
            __limit: 1,
          },
        }
      )

      const results = response.data.data.results

      if (results.length > 0) {
        setActiveChapter(results[0])
        setIsFetchingChapter(false)
      }
    } catch (err) {
      sentryCaptureException(err)
    }
  }

  return (
    <div className="md:flex w-full items-end">
      <div className="hidden md:block md:w-44 md:h-60 w-64 h-96 flex-shrink-0">
        <Link href={`/comics/${comicId}/chapter`}>
          <a>
            <div
              className="w-full h-full rounded-md bg-no-repeat bg-center bg-cover shadow-md hover:opacity-75 hover:rotate-3 hover:-translate-y-3 transform transition-all duration-200"
              style={{
                backgroundImage: `url(${parseImgUrl(comicCover)})`,
              }}
            />
          </a>
        </Link>
      </div>
      <div className="md:w-96 flex-1 pl-0 md:pl-8">
        <div className="text-black text-xl md:text-3xl font-bold">
          <Link href={`/comics/${comicId}/chapter`}>
            <a className="hover:opacity-50 transition-all duration-200">
              {comicTitle}
            </a>
          </Link>
        </div>
        <div className="relative">
          <div
            ref={shelvesRef}
            className={`flex flex-shrink-0 flex-nowraps pt-6 w-full relative overflow-x-auto ${comicsStyles.chapterListProfile}`}
          >
            {tokens.map((token) => (
              <div
                key={token.token_id}
                className="relative w-2/5 md:w-1/4 lg:w-1/5 flex-shrink-0 -mr-10 inline-block transform transition-all origin-bottom-right duration-300 ease-in-out hover:rotate-3 hover:mr-0 hover:-translate-y-3"
                onClick={() =>
                  openChapterModal(
                    token.token_id,
                    token.metadata.comic_id,
                    token.metadata.chapter_id
                  )
                }
              >
                <div
                  className="w-full cursor-pointer"
                  style={{
                    filter:
                      'drop-shadow(-4px 0px 8px rgba(255, 255, 255, 0.25)) drop-shadow(-8px 0px 16px rgba(255, 255, 255, 0.25))',
                  }}
                >
                  <Token
                    imgUrl={parseImgUrl(token.metadata.media, null, {
                      width: `300`,
                    })}
                    imgBlur={token.metadata.blurhash}
                    token={{
                      name: token.metadata.name,
                      collection: token.metadata.collection,
                      description: token.metadata.description,
                      creatorId: token.creatorId,
                      supply: token.supply,
                      tokenId: token.tokenId,
                      createdAt: token.createdAt,
                    }}
                    hoverMouse={false}
                    initialRotate={{ x: 0, y: 0 }}
                    shadow="none"
                    borderRadius="8px"
                    disableFlip
                  />
                  <div
                    className="absolute inset-0 rounded-md flex flex-col justify-end p-3 text-white"
                    style={{
                      background: `linear-gradient(180.17deg, rgb(0 0 0 / 0%) 20%, rgb(0 0 0 / 60%) 80.88%, rgb(0 0 0 / 80%) 100%)`,
                    }}
                  >
                    <p className="text-lg md:text-xl">
                      Ch. {parseInt(token.metadata.chapter_id)}
                    </p>
                    <p className="text-xs">Edition {token.edition_id}</p>
                  </div>
                </div>
              </div>
            ))}
            {hasMore && (
              <div
                className="relative w-1/3 md:w-1/5 flex-shrink-0 -mr-10 inline-block opacity-0"
                ref={loader}
              >
                <Token
                  hoverMouse={false}
                  imgUrl=""
                  initialRotate={{ x: 0, y: 0 }}
                  shadow="none"
                  borderRadius="8px"
                  disableFlip
                />
              </div>
            )}
          </div>
          {showLeftArrow && (
            <div
              className="absolute left-0 bottom-0 top-0 flex items-center"
              onClick={() => scrollShelves('left')}
            >
              <div className="bg-white p-2 rounded-full">
                <IconArrow
                  size={16}
                  transform="scale(-1,1)"
                  color="black"
                  style={{ transform: 'rotate(180deg)' }}
                />
              </div>
            </div>
          )}
          {showRightArrow && (
            <div
              className="absolute right-0 bottom-0 top-0 flex items-center"
              onClick={() => scrollShelves('right')}
            >
              <div className="bg-white p-2 rounded-full">
                <IconArrow size={16} color="black" />
              </div>
            </div>
          )}
        </div>
      </div>
      <BuyChapterModal
        active={activeChapter !== null}
        data={activeChapter}
        onClose={() => setActiveChapter(null)}
        isLoading={isFetchingChapter}
        tokenId={activeTokenId}
      />
    </div>
  )
}

export default ChapterListProfile
