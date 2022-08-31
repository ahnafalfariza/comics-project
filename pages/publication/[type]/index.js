import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import Head from 'components/Common/Head'
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
import TextEditor from 'components/Publication/TextEditor'
import LinkToProfile from 'components/Common/LinkToProfile'
import { parseDate, parseImgUrl } from 'utils/common'
import Modal from 'components/Common/Modal'
import useStore from 'lib/store'
import { sentryCaptureException } from 'lib/sentry'
import Layout from 'components/Common/Layout'
import EmbeddedComic from 'components/Publication/EmbeddedComic'
import EmbeddedChapter from 'components/Publication/EmbeddedChapter'

const ComicDetailPage = ({ errorCode, publicationDetail, userProfile }) => {
  const store = useStore()
  const router = useRouter()
  const textAreaRef = useRef(null)
  const [content, setContent] = useState(
    publicationDetail?.content
      ? EditorState.createWithContent(convertFromRaw(publicationDetail.content))
      : null
  )
  const [showModal, setShowModal] = useState('')
  const [isCopied, setIsCopied] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isComponentMounted, setIsComponentMounted] = useState(false)
  const setToastConfig = useStore((state) => state.setToastConfig)

  const _showToast = (type, msg) => {
    setToastConfig({
      text: (
        <div
          className={`text-sm font-semibold text-gray-900 ${
            type === 'error' && 'bg-red-300 border-red-500'
          } text-center`}
        >
          <p>{msg}</p>
        </div>
      ),
      type: type,
      duration: 2500,
    })
  }

  useEffect(() => {
    setIsComponentMounted(true)
  }, [])

  useEffect(() => {
    if (errorCode) {
      router.push('/publication')
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

  const _deletePublication = async () => {
    setIsDeleting(true)
    try {
      await axios.delete(
        `${process.env.PARAS_API_URL}/publications/${publicationDetail._id}`
      )
      setTimeout(() => {
        router.push('/publication')
      }, 1000)
    } catch (err) {
      sentryCaptureException(err)
      const msg =
        err.response?.data?.message || `Something went wrong, try again later`
      _showToast('error', msg)
      setIsDeleting(false)
    }
  }

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        <Head
          title={publicationDetail.title}
          description={publicationDetail.description}
          image={parseImgUrl(publicationDetail.thumbnail)}
        />
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
            <div className="max-w-sm w-full px-4 py-2 bg-gray-100 m-auto rounded-md">
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
              {store.currentUser.accountId === publicationDetail.author_id && (
                <Link href={`/publication/edit/${publicationDetail._id}`}>
                  <div
                    className="py-2 cursor-pointer"
                    onClick={() => setShowModal('confirmTransfer')}
                  >
                    Update Publication
                  </div>
                </Link>
              )}
              {store.currentUser.accountId === publicationDetail.author_id && (
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
            <div className="max-w-sm w-full p-4 bg-gray-100 m-auto rounded-md">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                Confirm Delete
              </h1>
              <p className="text-gray-900 mt-2">
                You are about to delete <b>{publicationDetail.title}</b>
              </p>
              <button
                className="w-full outline-none h-12 mt-4 rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-2 border-primary text-white"
                style={{ backgroundColor: '#00BBDB' }}
                type="submit"
                disabled={isDeleting}
                onClick={_deletePublication}
              >
                {isDeleting ? 'Deleting...' : 'Delete my publication'}
              </button>
            </div>
          </Modal>
        )}
        {showModal === 'shareTo' && (
          <Modal close={() => setShowModal('')}>
            <div className="max-w-sm w-full px-4 py-2 bg-gray-100 m-auto rounded-md">
              <div className="py-2 cursor-pointer">
                <TwitterShareButton
                  title={`Read ${publicationDetail.title} only at @ParasHQ\n\n#paras #cryptoart #digitalart #comic #tradingnft`}
                  url={window.location.href}
                  className="flex items-center w-full"
                >
                  <TwitterIcon
                    size={24}
                    className="rounded-md"
                    bgStyle={{
                      fill: '#00BBDB',
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
                      fill: '#00BBDB',
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
            <Link passHref href={`/publication`}>
              <span className="cursor-pointer">Publication</span>
            </Link>
            {' > '}
            <span className="font-semibold text-primary">
              {publicationDetail.title}
            </span>
          </p>
          <h1 className="titlePublication text-4xl font-bold pb-0 text-center px-4 md:px-0">
            {publicationDetail.title}
          </h1>
          <div className="m-auto max-w-3xl px-4 pt-8">
            <div className="flex justify-between mb-4">
              <div className="flex space-x-4">
                <Link href={`/${publicationDetail.author_id}`}>
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
                    accountId={publicationDetail.author_id}
                    className="font-bold hover:border-primary text-xl"
                  />
                  <p className="text-primary m-auto text-sm">
                    {parseDate(publicationDetail.updated_at)}
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
                    fill="#00BBDB"
                  />
                  <rect
                    width="6.78723"
                    height="6.78723"
                    rx="2"
                    transform="matrix(1 0 0 -1 11.1064 6.78711)"
                    fill="#00BBDB"
                  />
                  <rect
                    width="6.78723"
                    height="6.78723"
                    rx="2"
                    transform="matrix(1 0 0 -1 22.2126 6.78711)"
                    fill="#00BBDB"
                  />
                </svg>
              </div>
            </div>
            {content && (
              <TextEditor
                title={createEditorStateWithText(publicationDetail.title)}
                hideTitle={true}
                content={content}
                setContent={setContent}
                readOnly={true}
              />
            )}
          </div>
          {publicationDetail.collection_ids &&
            publicationDetail.collection_ids.length !== 0 && (
              <div className="max-w-4xl mx-auto px-4 pt-16">
                <div className="rounded-md p-2 md:p-4">
                  <h4 className="font-semibold text-3xl md:mb-4 text-center">
                    Comics
                  </h4>
                  <div
                    className={`flex flex-wrap ${
                      publicationDetail.contract_token_ids.length <= 3 &&
                      'justify-center'
                    }`}
                  >
                    {publicationDetail.collection_ids?.map((comicId, index) => (
                      <div
                        key={index}
                        className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 p-4"
                      >
                        <EmbeddedComic comicId={comicId} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          {publicationDetail.contract_token_ids &&
            publicationDetail.contract_token_ids.length !== 0 && (
              <div className="max-w-4xl mx-auto px-4 pt-16">
                <div className=" border-2 border-dashed border-gray-800 rounded-md p-4 md:p-8">
                  <h4 className="font-semibold text-3xl md:mb-4 text-center">
                    Chapters
                  </h4>
                  <div
                    className={`flex flex-wrap ${
                      publicationDetail.contract_token_ids.length <= 3 &&
                      'justify-center'
                    }`}
                  >
                    {publicationDetail.contract_token_ids?.map(
                      (tokenId, index) => (
                        <div
                          key={index}
                          className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 p-8"
                        >
                          <EmbeddedChapter tokenId={tokenId} />
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
    </Layout>
  )
}

export async function getServerSideProps({ params }) {
  const { type } = params
  const id = type.split('-')
  const slugName = id.slice(0, id.length - 1).join('-')

  const resp = await axios(
    `${process.env.PARAS_API_URL}/publications?_id=${id[id.length - 1]}`
  )

  const publicationDetail = (await resp.data?.data?.results[0]) || null

  const errorCode = publicationDetail ? false : 404

  const profileRes = await axios(
    `${process.env.PARAS_API_URL}/profiles?accountId=${publicationDetail?.author_id}`
  )
  const userProfile = (await profileRes.data.data.results[0]) || null

  return { props: { publicationDetail, errorCode, userProfile, slugName } }
}

export default ComicDetailPage
