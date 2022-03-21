import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { EditorState, convertFromRaw } from 'draft-js'
import { createEditorStateWithText } from '@draft-js-plugins/editor'
import {
  FacebookIcon,
  FacebookShareButton,
  TwitterIcon,
  TwitterShareButton,
} from 'react-share'
import { useRouter } from 'next/router'

import Error from '../../404'
import TextEditor from 'components/News/TextEditor'
import LinkToProfile from 'components/Common/LinkToProfile'
import { parseDate, parseImgUrl } from 'utils/common'
import Modal from 'components/Modal'
import useStore from 'lib/store'
import near from 'lib/near'
import EmbeddedChapter from 'components/News/EmbeddedChapter'
import { useToast } from 'hooks/useToast'
import { sentryCaptureException } from 'lib/sentry'

const NewsDetailPage = ({ errorCode, newsDetail, userProfile }) => {
  const store = useStore()
  const router = useRouter()
  const toast = useToast()
  const textAreaRef = useRef(null)
  const [content, setContent] = useState(
    newsDetail?.content
      ? EditorState.createWithContent(convertFromRaw(newsDetail.content))
      : null
  )
  const [showModal, setShowModal] = useState('')
  const [isCopied, setIsCopied] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isComponentMounted, setIsComponentMounted] = useState(false)

  useEffect(() => {
    setIsComponentMounted(true)
  }, [])

  useEffect(() => {
    if (errorCode) {
      router.push('/news')
    }
  }, [errorCode])

  if (errorCode) {
    return <Error />
  }

  const _copyLink = () => {
    textAreaRef.current.select()
    document.execCommand('copy')

    setIsCopied(true)

    setTimeout(() => {
      setShowModal(false)
      setIsCopied(false)
    }, 1500)
  }

  const _deleteNews = async () => {
    setIsDeleting(true)
    try {
      await axios.delete(
        `${process.env.PARAS_API_URL}/publications/${newsDetail._id}`,
        {
          headers: {
            authorization: await near.authToken(),
          },
        }
      )
      setTimeout(() => {
        router.push('/news')
      }, 1000)
    } catch (err) {
      sentryCaptureException(err)
      const msg =
        err.response?.data?.message || 'Something went wrong, try again later.'
      toast.show({
        text: <div className="font-semibold text-center text-sm">{msg}</div>,
        type: 'error',
        duration: 2500,
      })
      setIsDeleting(false)
    }
  }

  return (
    <div>
      <div className="min-h-screen bg-black">
        <div
          className="fixed inset-0 opacity-75"
          style={{
            zIndex: 0,
            backgroundImage: `url('/bg.jpg')`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: 'cover',
          }}
        ></div>
        <Head title="asdf" />
        {isComponentMounted && (
          <div
            className="absolute z-0 opacity-0"
            style={{
              top: `-1000`,
            }}
          >
            <input
              ref={textAreaRef}
              readOnly
              type="text"
              value={window.location.href}
            />
          </div>
        )}
        {showModal === 'options' && (
          <Modal close={() => setShowModal('')}>
            <div className="max-w-sm w-full px-4 py-2 bg-black m-auto rounded-md">
              <div className="py-2 cursor-pointer" onClick={() => _copyLink()}>
                {isCopied ? `Copied` : `Copy Link`}
              </div>
              <div
                className="py-2 cursor-pointer"
                onClick={() => {
                  setShowModal('shareTo')
                }}
              >
                Share to...
              </div>
              {store.currentUser === newsDetail.author_id && (
                <Link href={`/news/edit/${newsDetail._id}`}>
                  <div
                    className="py-2 cursor-pointer"
                    onClick={() => setShowModal('confirmTransfer')}
                  >
                    Update News
                  </div>
                </Link>
              )}
              {store.currentUser === newsDetail.author_id && (
                <div
                  className="py-2 cursor-pointer"
                  onClick={() => setShowModal('confirmDelete')}
                >
                  Delete
                </div>
              )}
            </div>
          </Modal>
        )}
        {showModal === 'confirmDelete' && (
          <Modal
            close={() => setShowModal('')}
            closeOnBgClick={true}
            closeOnEscape={true}
          >
            <div className="max-w-sm w-full p-4 bg-black m-auto rounded-md">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Confirm Delete
              </h1>
              <p className="text-gray-900 mt-2">
                You are about to delete <b>{newsDetail.title}</b>
              </p>
              <button
                className="w-full outline-none h-12 mt-4 rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-2 border-primary bg-primary text-gray-100"
                type="submit"
                disabled={isDeleting}
                onClick={_deleteNews}
              >
                {isDeleting ? 'Deleting...' : 'Delete my news'}
              </button>
            </div>
          </Modal>
        )}
        {showModal === 'shareTo' && (
          <Modal close={() => setShowModal('')}>
            <div className="max-w-sm w-full px-4 py-2 bg-black m-auto rounded-md">
              <div className="py-2 cursor-pointer">
                <TwitterShareButton
                  title={`Read ${newsDetail.title} only at @ParasHQ\n\n#paras #cryptoart #digitalart #comic #tradingnft`}
                  url={window.location.href}
                  className="flex items-center w-full"
                >
                  <TwitterIcon
                    size={24}
                    className="rounded-md"
                    bgStyle={{
                      fill: '#11111F',
                    }}
                  />
                  <p className="pl-2">Twitter</p>
                </TwitterShareButton>
              </div>
              <div className="py-2 cursor-pointer">
                <FacebookShareButton
                  url={window.location.href}
                  className="flex items-center w-full"
                >
                  <FacebookIcon
                    size={24}
                    className="rounded-md"
                    bgStyle={{
                      fill: '#11111F',
                    }}
                  />
                  <p className="pl-2">Facebook</p>
                </FacebookShareButton>
              </div>
            </div>
          </Modal>
        )}
        <div className="max-w-5xl relative m-auto pb-12 pt-4">
          <p className="mb-8 px-4 max-w-3xl m-auto text-gray-400">
            <Link href={`/news`}>
              <span className="cursor-pointer">News</span>
            </Link>
            {' > '}
            <span className="font-semibold text-black">{newsDetail.title}</span>
          </p>
          <h1 className="titleNews text-4xl font-bold pb-0 text-center px-4 md:px-0">
            {newsDetail.title}
          </h1>
          <div className="m-auto max-w-3xl px-4 pt-8">
            <div className="flex justify-between">
              <div className="flex space-x-4">
                <Link href={`/${newsDetail.author_id}`}>
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-primary cursor-pointer">
                    <img
                      src={parseImgUrl(userProfile?.imgUrl, null, {
                        width: `800`,
                      })}
                      className="object-cover"
                    />
                  </div>
                </Link>
                <div className="m-auto">
                  <LinkToProfile
                    accountId={newsDetail.author_id}
                    className="text-white font-bold hover:border-white text-xl"
                  />
                  <p className="text-white m-auto text-sm">
                    {parseDate(newsDetail.updated_at)}
                  </p>
                </div>
              </div>
              <div>
                <svg
                  className="cursor-pointer m-auto"
                  onClick={() => setShowModal('options')}
                  width="24"
                  height="24"
                  viewBox="0 0 29 7"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect
                    width="6.78723"
                    height="6.78723"
                    rx="2"
                    transform="matrix(1 0 0 -1 0 6.78711)"
                    fill="white"
                  />
                  <rect
                    width="6.78723"
                    height="6.78723"
                    rx="2"
                    transform="matrix(1 0 0 -1 11.1064 6.78711)"
                    fill="white"
                  />
                  <rect
                    width="6.78723"
                    height="6.78723"
                    rx="2"
                    transform="matrix(1 0 0 -1 22.2126 6.78711)"
                    fill="white"
                  />
                </svg>
              </div>
            </div>
            {content && (
              <TextEditor
                title={createEditorStateWithText(newsDetail.title)}
                hideTitle={true}
                content={content}
                setContent={setContent}
                readOnly={true}
              />
            )}
          </div>
          {newsDetail.contract_token_ids &&
            newsDetail.contract_token_ids.length !== 0 && (
              <div className="max-w-4xl mx-auto px-4 pt-16">
                <div className=" border-2 border-dashed border-gray-800 rounded-md p-4 md:p-8">
                  <h4 className="text-white font-semibold text-3xl md:mb-4 text-center">
                    Chapter
                  </h4>
                  <div
                    className={`flex flex-wrap ${
                      newsDetail.contract_token_ids.length <= 3 &&
                      'justify-center'
                    }`}
                  >
                    {newsDetail.contract_token_ids?.map((tokenId, index) => (
                      <div
                        key={index}
                        className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 p-8"
                      >
                        <EmbeddedChapter tokenId={tokenId} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  )
}

export async function getServerSideProps({ params }) {
  const { type, slug } = params
  const id = slug.split('-')
  const slugName = id.slice(0, id.length - 1).join('-')

  const resp = await axios(
    `${process.env.PARAS_API_URL}/publications?_id=${id[id.length - 1]}`
  )

  const newsDetail = (await resp.data?.data?.results[0]) || null

  const errorCode = newsDetail ? false : 404

  const profileRes = await axios(
    `${process.env.PARAS_API_URL}/profiles?accountId=${newsDetail?.author_id}`
  )
  const userProfile = (await profileRes.data.data.results[0]) || null

  return { props: { newsDetail, errorCode, userProfile, slugName } }
}

export default NewsDetailPage
