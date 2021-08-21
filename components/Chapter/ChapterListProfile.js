import { useEffect, useRef, useState } from 'react'

import { IconArrow } from 'components/Icons'
import { useRouter } from 'next/router'
import axios from 'axios'
import Token from 'components/Token/Token'
import { parseImgUrl } from 'utils/common'
import comicsStyles from 'styles/Comics.module.css'

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
  const [showRightArrow, setShowRigthArrow] = useState(true)
  const [intersecting, setIntersecting] = useState(false)

  const [tokens, setTokens] = useState([])
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [isFetching, setIsFetching] = useState(false)

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

  return (
    <div className="px-4 lg:p-0 md:flex items-center">
      <div className="hidden md:block md:w-1/5 flex-shrink-0 p-4 lg:p-0 lg:pr-4">
        <div
          className="w-full h-40 md:h-72 flex-none rounded-md bg-no-repeat bg-center bg-cover shadow-2xl"
          style={{
            backgroundImage: `url(${parseImgUrl(comicCover)})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      </div>
      <div className="md:w-4/5 relative px-4">
        <div className="text-white text-xl md:text-3xl">{comicTitle}</div>
        <div className="relative">
          <div
            ref={shelvesRef}
            className={`flex flex-shrink-0 flex-nowraps pt-6 pb-2 w-full relative overflow-x-auto ${comicsStyles.chapterListProfile}`}
          >
            {tokens.map((token) => (
              <div
                key={token.tokenId}
                className="relative w-2/5 md:w-1/4 lg:w-1/5 flex-shrink-0 -mr-10 inline-block transform transition-all origin-bottom-right duration-300 ease-in-out hover:rotate-3 hover:mr-0 hover:-translate-y-3"
              >
                <div
                  className="w-full"
                  style={{
                    filter:
                      'drop-shadow(-4px 0px 8px rgba(0, 0, 0, 0.25)) drop-shadow(-8px 0px 16px rgba(0, 0, 0, 0.25))',
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
                      background:
                        'linear-gradient(90deg, rgba(255, 255, 255, 0.2) 0%, rgba(0, 0, 0, 0) 100%), linear-gradient(180deg, rgba(0, 0, 0, 0) 31.93%, #18162B 100%), url(image.png)',
                    }}
                  >
                    <p className="text-xl">Ch. {token.chapter_id}</p>
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
    </div>
  )
}

export default ChapterListProfile
