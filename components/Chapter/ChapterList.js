import { useState, useEffect } from 'react'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import Link from 'next/link'
import * as React from 'react'
import { parseImgUrl } from 'utils/common'
import { parseDate } from 'utils/dateHelper'
import useStore from 'lib/store'
import axios from 'axios'
import LoginModal from 'components/Modal/LoginModal'
import { IconLove } from 'components/Icons'

const ChapterList = ({
  data = {
    token_type: 'naruto-8',
    comic_id: 'naruto',
    chapter_id: 8,
    metadata: {
      title: 'Naruto Ch.8 : Beginning of the End',
      description: 'welcome to the world of naruto!',
      media: 'bafybeiahl55gjwifng26oya77sw5nvtiqevc5jcxai3u7atupyiyyry2ji',
      media_hash: null,
      copies: null,
      issued_at: '2021-08-21T04:08:12.190Z',
      expires_at: null,
      starts_at: null,
      updated_at: null,
      extra: null,
      reference: 'bafybeidf5qebeqaahfsifxtbakxazyiqy5ejmrlcdjlmcisxwuqdlllloq',
      reference_hash: null,
      blurhash: 'U36t:x-50JOY~V-;E1NG4,N{sHs9J:9FV@%L',
      page_count: 1,
      collection: 'naruto',
      subtitle: 'Beginning of the End',
    },
    price: '1000000000000000000000000',
    status: null,
  },
  className = '',
  onClick = () => {},
  ...rest
}) => {
  const chapterImage = {
    backgroundImage: `url(${parseImgUrl(data.metadata.media)})`,
  }

  const listWrapperBaseStyle =
    'bg-gray-50 border-opacity-20 shadow-md relative rounded-lg w-full hover:bg-gray-100 hover:cursor-pointer transition ease-in-out duration-300'
  const listCoverBaseStyle =
    'bg-no-repeat bg-center bg-cover rounded-lg absolute'
  const listBadgeBaseStyle =
    'text-sm font-semibold bg-primary rounded-full uppercase tracking-wider leading-none px-5 py-2 text-white'

  const listWrapperResponsiveStyle = 'flex items-center sm:py-4 sm:pr-6 py-3'
  const listCoverResponsiveStyle =
    'w-20 h-32 sm:w-28 sm:h-36 bottom-3 sm:left-3 left-2'
  const listBadgeResponsiveStyle = 'mt-3 sm:mt-0'

  const listWrapperStyle = `${listWrapperBaseStyle} ${listWrapperResponsiveStyle}`
  const listCoverStyle = `${listCoverBaseStyle} ${listCoverResponsiveStyle}`
  const listBadgeStyle = `${listBadgeBaseStyle} ${listBadgeResponsiveStyle}`

  const textRight = () => {
    return data.status === 'read'
      ? 'Read'
      : data.price
      ? `${data.price === '0' ? 'Free' : `${formatNearAmount(data.price)} Ⓝ`}`
      : data.is_non_mintable
      ? 'Sold Out'
      : 'Coming Soon'
  }

  return (
    <div className={`sm:h-40 h-36 flex mb-4 items-end ${className}`} {...rest}>
      <div className={listWrapperStyle} onClick={onClick}>
        <Link
          href={`/comics/${data.metadata.comic_id}/chapter?chapterId=${data.metadata.chapter_id}`}
        >
          <a onClick={(e) => e.preventDefault()}>
            <div
              className={listCoverStyle}
              style={chapterImage}
              onClick={onClick}
            />
          </a>
        </Link>
        <div className="sm:ml-36 ml-24 pl-1 w-full flex flex-col sm:flex-row sm:items-center items-start justify-between">
          <div className="mr-4">
            <h5 className="sm:text-sm text-xs font-semibold text-gray-500 mb-1 uppercase">
              Chapter {parseInt(data.metadata.chapter_id)}
            </h5>
            <h3 className="text-black font-semibold text-sm sm:text-lg">
              {data.metadata.title}
            </h3>
            <h5 className="text-gray-800 sm:text-sm text-xs">
              {parseDate(data.metadata.issued_at)}
            </h5>
          </div>
          <div>
            <div className="flex items-center gap-6">
              <ButtonLikeChapterList
                comicId={data.metadata.comic_id}
                chapterId={data.metadata.chapter_id}
                likes={data?.likes}
              />
              <div className="absolute right-3 mb-2 md:mb-0 md:relative md:right-0">
                <div className="flex md:justify-end">
                  <h4 className={listBadgeStyle}>{textRight()}</h4>
                </div>
              </div>
            </div>
            {data.is_explicit && (
              <p className="text-xs text-red-500 mt-2 text-right">
                Explicit Content
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

ChapterList.displayName = 'ChapterList'

export default ChapterList

const ButtonLikeChapterList = ({
  comicId,
  chapterId,
  likes = {},
  isLoading,
}) => {
  const [isLiked, setIsLiked] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const [totalLikes, setTotalLikes] = useState()
  const { currentUser } = useStore()

  useEffect(() => {
    fetchLikesLength(likes)
  }, [])

  const fetchLikesLength = (likes) => {
    const totalLikes = Object.keys(likes).length
    setTotalLikes(totalLikes)
  }

  useEffect(() => {
    const fetchLiked = async () => {
      const response = await axios.get(
        `${process.env.COMIC_API_URL}/like-chapter`,
        {
          params: {
            comic_id: comicId,
            chapter_id: chapterId,
          },
        }
      )
      setIsLiked(response.data.result)
    }
    if (chapterId && comicId && !isLoading && currentUser?.accountId) {
      fetchLiked()
    }
  }, [chapterId, comicId, currentUser?.accountId, isLoading])

  const onClickLikes = async (e) => {
    if (!currentUser) {
      e.stopPropagation()
      setShowLogin(true)
      return
    }

    setTotalLikes(isLiked ? totalLikes - 1 : totalLikes + 1)
    setIsLiked(!isLiked)

    const body = new FormData()
    body.append('comic_id', comicId)
    body.append('chapter_id', chapterId)
    body.append('user_action', !isLiked)

    await axios.put(`${process.env.COMIC_API_URL}/like-chapter`, body, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }

  return (
    <>
      <div onClick={(e) => e.stopPropagation()}>
        <LoginModal show={showLogin} onClose={() => setShowLogin(false)} />
      </div>
      <div className="flex items-center gap-1">
        <div
          className="cursor-pointer"
          onClick={(e) => {
            e.stopPropagation()
            onClickLikes(e)
          }}
        >
          <IconLove
            size={10}
            color={isLiked ? 'red' : 'none'}
            stroke={isLiked ? 'red' : 'black'}
            strokeWidth={1.5}
          />
        </div>
        <p>{totalLikes}</p>
      </div>
    </>
  )
}
