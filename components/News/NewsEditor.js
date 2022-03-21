import { Fragment, useEffect, useState } from 'react'
import axios from 'axios'
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js'
import { useRouter } from 'next/router'

import {
  compressImg,
  dataURLtoFile,
  parseGetComicIdfromUrl,
  parseGetTokenIdfromUrl,
  parseImgUrl,
  readFileAsUrl,
} from 'utils/common'
import TextEditor from './TextEditor'
import Modal from '../Modal'
import useStore from 'lib/store'
import usePreventRouteChangeIf from 'hooks/usePreventRouteChange'
import { sentryCaptureException } from 'lib/sentry'
import { v4 as uuidv4 } from 'uuid'
import DraftNews from 'components/Draft/DraftNews'
import near from 'lib/near'

let redirectUrl = null

const NewsEditor = ({
  isEdit = false,
  newsDetail = null,
  draftDetail = [],
}) => {
  const router = useRouter()
  const [preventLeaving, setPreventLeaving] = useState(true)
  const [showLeavingConfirmation, setShowLeavingConfirmation] = useState(false)
  const [isNewsDetail, setIsNewsDetail] = useState(false)

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

  usePreventRouteChangeIf(preventLeaving, (url) => {
    redirectUrl = url
    setShowLeavingConfirmation(true)
  })

  const [title, setTitle] = useState(
    convertTextToEditorState(newsDetail?.title || draftDetail[0]?.title)
  )
  const [subTitle, setSubTitle] = useState(
    newsDetail?.description || draftDetail[0]?.description || ''
  )
  const [thumbnail, setThumbnail] = useState(
    newsDetail?.thumbnail || draftDetail[0]?.thumbnail
  )
  const [content, setContent] = useState(
    generateEditorState(newsDetail?.content || draftDetail[0]?.content)
  )
  const [showAlertErr, setShowAlertErr] = useState(false)
  const [embeddedChapter, setEmbeddedChapter] = useState([])
  const [embeddedComic, setEmbeddedComic] = useState([])

  const [showModal, setShowModal] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDraftIn, setIsDraftIn] = useState(false)
  const [searchToken, setSearchToken] = useState('')
  const [searchComic, setSearchComic] = useState('')
  const [currentDraftStorage, setCurrentDraftStorage] = useState()
  const currentUser = useStore((state) => state.currentUser)
  const uid = uuidv4()

  useEffect(() => {
    if (newsDetail !== null) setIsNewsDetail(true)
  }, [])

  useEffect(() => {
    const draftStorage = JSON.parse(localStorage.getItem('draft-publication'))
    const currentUserDraft = draftStorage?.filter(
      (item) => item.author_id === currentUser?.accountId
    )
    setCurrentDraftStorage(currentUserDraft)
  }, [])

  useEffect(() => {
    if (isEdit) {
      fetchToken()
      fetchComic()
    }
  }, [])

  const fetchToken = async () => {
    let token = []
    newsDetail?.contract_token_ids?.map(async (tokenId) => {
      const [contractTokenId, token_id] = tokenId.split('/')
      const [contractId, tokenSeriesId] = contractTokenId.split('::')

      const url = `${process.env.COMIC_API_URL}`
      const res = await axios({
        url: url + (token_id ? `/tokens` : `/token-series`),
        method: 'GET',
        params: token_id
          ? {
              token_id: token_id,
            }
          : {
              contract_id: contractId,
              token_series_id: tokenSeriesId,
            },
      })

      const _token = (await res.data.data.results[0]) || null
      token = [...token, _token]
      setEmbeddedChapter(token)
    })
  }

  const fetchComic = async () => {
    let comic = []
    newsDetail?.collection_ids?.map(async (comicId) => {
      const url = `${process.env.COMIC_API_URL}`
      const res = await axios({
        url: url + `/comics`,
        method: 'GET',
        params: {
          comic_id: comicId,
        },
      })
      const _comic = (await res.data.data.results[0]) || null
      comic = [...comic, _comic]
      setEmbeddedComic(comic)
    })
  }

  const getDataFromTokenId = async () => {
    const { token_id, token_series_id } = parseGetTokenIdfromUrl(searchToken)

    if (token_id) {
      const res = await axios.get(`${process.env.COMIC_API_URL}/tokens`, {
        params: {
          token_id: token_id,
          contract_id: token_series_id.split('::')[0],
        },
      })

      const token = (await res.data.data.results[0]) || null

      if (token) {
        setEmbeddedChapter([...embeddedChapter, token])
        setShowModal(null)
        setSearchToken('')
      } else {
        showToast('Please enter correct url')
      }
      return
    }

    if (token_series_id.split('::')[1]) {
      const res = await axios.get(`${process.env.V2_API_URL}/token-series`, {
        params: {
          token_series_id: token_series_id.split('::')[1],
          contract_id: token_series_id.split('::')[0],
        },
      })

      const token = (await res.data.data.results[0]) || null

      if (token) {
        setEmbeddedChapter([...embeddedChapter, token])
        setShowModal(null)
        setSearchToken('')
      } else {
        showToast('Please enter correct url')
      }
      return
    }

    showToast('Please enter correct url')
  }

  const getDataFromComicId = async () => {
    const { comic_id } = parseGetComicIdfromUrl(searchComic)

    if (embeddedComic.some((com) => com.comic_id === comic_id)) {
      showToast('You have added this comic')
      return
    }

    const res = await axios.get(`${process.env.COMIC_API_URL}/comics`, {
      params: {
        comic_id: comic_id,
      },
    })

    const comic = (await res.data.data.results[0]) || null

    if (comic) {
      setEmbeddedComic([...embeddedComic, comic])
      setShowModal(null)
      setSearchComic('')
    } else {
      showToast('Please enter correct url')
    }
    return
  }

  const getTokenIds = () => {
    return embeddedChapter.map((token) => {
      let tokenId = `${token.contract_id}::${token.token_series_id}`
      if (token.token_id) {
        tokenId += `/${token.token_id}`
      }
      return tokenId
    })
  }

  const getComicIds = () => {
    return embeddedComic.map((com) => com.comic_id)
  }

  const showToast = (msg, type = 'error') => {
    _showToast(type, msg)
  }

  const showChapterModal = () => {
    embeddedChapter.length === 6
      ? showToast('Maximum 6 chapters')
      : setShowModal('chapter')
  }

  const showComicModal = () => {
    embeddedComic.length === 6
      ? showToast('Maximum 6 comic')
      : setShowModal('comic')
  }

  const postNews = async () => {
    if (!thumbnail || !subTitle) {
      let error = []
      if (!thumbnail) error.push('Thumbnail')
      if (!subTitle) error.push('Description')

      _showToast('error', `${error.join(' and ')} is required`)
      return
    }

    setIsSubmitting(true)
    setPreventLeaving(false)

    const entityMap = await uploadImage()
    const _thumbnail = await uploadThumbnail()

    const data = {
      title: title.getCurrentContent().getPlainText(),
      thumbnail: _thumbnail,
      description: subTitle,
      content: {
        blocks: convertToRaw(content.getCurrentContent()).blocks,
        entityMap: entityMap,
      },
      contract_token_ids: getTokenIds(),
      collection_ids: getComicIds(),
      isComic: 'true',
    }

    try {
      const url = `${process.env.PARAS_API_URL}/publications`
      axios.defaults.headers.common['Authorization'] = await near.authToken()
      const res = await axios(
        !isNewsDetail && draftDetail.length > 0
          ? {
              url: url,
              method: 'post',
              data: data,
            }
          : {
              url: isEdit ? url + `/${newsDetail._id}` : url,
              method: isEdit ? 'put' : 'post',
              data: data,
            }
      )
      if (!isNewsDetail && draftDetail.length > 0)
        deleteDraft(draftDetail[0]._id)
      const routerUrl = `/news`
      setTimeout(() => {
        router.push(routerUrl)
      }, 1000)
    } catch (err) {
      sentryCaptureException(err)
      const msg =
        err.response?.data?.message || `Something went wrong, try again later`
      showToast(msg)
      setIsSubmitting(false)
      setPreventLeaving(true)
    }
  }

  const saveDraft = async () => {
    let checkTotalDraft = false
    if (!window.location.href.includes('edit'))
      checkTotalDraft = currentDraftStorage?.length >= 10
    if (checkTotalDraft) {
      _showToast(
        'error',
        `${checkTotalDraft && 'The maximum number of drafts is 10 drafts'}`
      )
      return
    }

    setIsDraftIn(true)
    setPreventLeaving(false)

    const entityMap = await uploadImage()
    const _thumbnail = await uploadThumbnail()

    const data = {
      _id: uid,
      author_id: currentUser.accountId,
      title: title.getCurrentContent().getPlainText(),
      draft: true,
      thumbnail: _thumbnail,
      description: subTitle,
      content: {
        blocks: convertToRaw(content.getCurrentContent()).blocks,
        entityMap: entityMap,
      },
      contract_token_ids: getTokenIds(),
      comic_id: getComicIds(),
      isComic: 'true',
    }

    let draftStorage =
      JSON.parse(localStorage.getItem('draft-publication')) || []
    const draftCurrentEdit = JSON.parse(localStorage.getItem('edit-draft'))
    let checkDraft = []
    if (draftCurrentEdit !== null) {
      checkDraft = draftStorage.find(
        (item) => item._id === draftCurrentEdit[0]._id
      )
    }

    if (checkDraft && window.location.href.includes('edit')) {
      checkDraft.title = data.title
      checkDraft.thumbnail = data.thumbnail
      checkDraft.description = data.subTitle
      checkDraft.content = data.content
      checkDraft.contract_token_ids = data.contract_token_ids
      checkDraft.comic_id = data.comic_id
      checkDraft.isComic = data.isComic
      draftStorage.push(checkDraft)
      draftStorage.pop()
      localStorage.setItem('draft-publication', JSON.stringify(draftStorage))
    } else {
      draftStorage.push(data)
      localStorage.setItem('draft-publication', JSON.stringify(draftStorage))
    }

    const routerUrl = `/news`
    router.push(routerUrl)
  }

  const deleteDraft = (_id) => {
    const dataDraftPublication = JSON.parse(
      localStorage.getItem('draft-publication')
    )
    const deleteItem = dataDraftPublication.filter((item) => item._id !== _id)
    localStorage.setItem('draft-publication', JSON.stringify(deleteItem))
    if (dataDraftPublication.length === 1)
      localStorage.removeItem('draft-publication')
  }

  const uploadImage = async () => {
    let { entityMap } = convertToRaw(content.getCurrentContent())

    const formData = new FormData()
    for (let key in entityMap) {
      if (
        entityMap[key].type === 'IMAGE' &&
        !entityMap[key].data.src?.includes('ipfs://')
      ) {
        const file = dataURLtoFile(entityMap[key].data.src, key)
        formData.append('files', file, key)
      }
    }

    const resp = await axios.post(
      `${process.env.PARAS_API_URL}/uploads`,
      formData
    )

    let idx = 0
    for (let key in entityMap) {
      if (
        entityMap[key].type === 'IMAGE' &&
        !entityMap[key].data.src?.includes('ipfs://')
      ) {
        entityMap[key].data.src = resp.data.data[idx]
        idx++
      }
    }

    return entityMap
  }

  const uploadThumbnail = async () => {
    if (thumbnail !== undefined) {
      // eslint-disable-next-line no-unused-vars
      const [protocol, path] = thumbnail.split('://')
      if (protocol === 'ipfs') {
        return thumbnail
      }

      const formData = new FormData()
      formData.append('files', dataURLtoFile(thumbnail), 'thumbnail')

      const resp = await axios.post(
        `${process.env.PARAS_API_URL}/uploads`,
        formData
      )
      return resp.data.data[0]
    }
  }

  const updateThumbnail = async (e) => {
    if (e.target.files[0]) {
      if (e.target.files[0].size > 3 * 1024 * 1024) {
        _showToast('error', 'Maximum size is 30MB')
        return
      }
      const compressedImg =
        e.target.files[0].type === 'image/gif'
          ? e.target.files[0]
          : await compressImg(e.target.files[0])
      setThumbnail(await readFileAsUrl(compressedImg))
    }
  }

  const onPressContinue = () => {
    const { entityMap } = convertToRaw(content.getCurrentContent())
    if (!thumbnail) {
      for (let key in entityMap) {
        if (entityMap[key].type === 'IMAGE') {
          setThumbnail(entityMap[key].data.src || thumbnail)
          break
        }
      }
    }
    setShowModal('final')
  }

  return (
    <div className="py-16 min-h-screen">
      {showModal === 'chapter' && (
        <Modal
          close={() => setShowModal(null)}
          closeOnBgClick={true}
          closeOnEscape={true}
        >
          <div className="w-full max-w-md p-4 m-auto bg-white rounded-md overflow-hidden">
            <div className="m-auto">
              <label className="mb-4 block text-black text-2xl font-bold">
                Add chapter to your comic
              </label>
              <input
                type="text"
                name="Token"
                onChange={(e) => setSearchToken(e.target.value)}
                value={searchToken}
                className={`resize-none h-auto px-2 py-3 w-full rounded-md bg-gray-300 focus:border-gray-100 mb-4`}
                placeholder="Url of the Token"
              />
              <p className="text-gray-500 text-sm italic">
                Please input the link of your token
              </p>
              <p className="text-gray-500 text-sm italic">
                https://comic.paras.id/token/6/6:8
              </p>
              <button
                className={`font-semibold mt-4 py-3 w-full rounded-md bg-primary text-white ${
                  !searchToken
                    ? 'bg-gray-200 cursor-default'
                    : 'bg-primary text-white'
                }`}
                disabled={!searchToken}
                onClick={getDataFromTokenId}
              >
                Add Chapter
              </button>
            </div>
          </div>
        </Modal>
      )}
      {showModal === 'comic' && (
        <Modal
          close={() => {
            setShowModal(null)
          }}
          closeOnBgClick={true}
          closeOnEscape={true}
        >
          <div className="w-full max-w-md p-4 m-auto bg-white rounded-md overflow-hidden">
            <div className="m-auto">
              <label className="mb-4 block text-black text-2xl font-bold">
                Add comic to your news
              </label>
              <input
                type="text"
                name="video"
                onChange={(e) => setSearchComic(e.target.value)}
                value={searchComic}
                className={`resize-none h-auto px-2 py-3 w-full rounded-md bg-gray-300 focus:border-gray-100 mb-4 text-black`}
                placeholder="Url of the Comic"
              />
              <p className="text-gray-500 text-sm italic">
                Please input the link of your comic
              </p>
              <p className="text-gray-500 text-sm italic">
                https://comic.paras.id/comics/paradigm/chapter
              </p>
              <button
                className={`font-semibold mt-4 py-3 w-full rounded-md ${
                  !searchComic
                    ? 'bg-gray-200 text-white cursor-default'
                    : 'bg-primary text-white'
                }`}
                disabled={!searchComic}
                onClick={getDataFromComicId}
              >
                Add Comic
              </button>
            </div>
          </div>
        </Modal>
      )}
      {showModal === 'final' && (
        <Modal
          close={() => setShowModal(null)}
          closeOnBgClick={false}
          closeOnEscape={false}
        >
          <div className="w-full max-h-screen max-w-3xl p-4 m-auto bg-white rounded-md overflow-hidden overflow-y-auto">
            <div className="flex justify-between">
              <h1 className="mb-4 block text-black text-2xl font-bold">
                {isEdit ? 'Edit News' : 'Preview News'}
              </h1>
              <div onClick={() => setShowModal(null)}>
                <svg
                  className="cursor-pointer"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M8.00008 9.41423L3.70718 13.7071L2.29297 12.2929L6.58586 8.00001L2.29297 3.70712L3.70718 2.29291L8.00008 6.5858L12.293 2.29291L13.7072 3.70712L9.41429 8.00001L13.7072 12.2929L12.293 13.7071L8.00008 9.41423Z"
                    fill="black"
                  />
                </svg>
              </div>
            </div>
            <div className="flex flex-col md:flex-row -mx-2">
              <div className="w-full md:w-1/2 px-2">
                <h1 className="mb-2 block text-black text-md font-medium">
                  Thumbnail
                </h1>
                <div className="bg-primary h-64 mb-4 overflow-hidden relative rounded-md">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-opacity-75 bg-black p-2 rounded-md">
                      <div className="flex items-center">
                        <svg
                          className="m-auto"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M4 2H20C21.1046 2 22 2.89543 22 4V20C22 21.1046 21.1046 22 20 22H4C2.89543 22 2 21.1046 2 20V4C2 2.89543 2.89543 2 4 2ZM4 4V15.5858L8 11.5858L11.5 15.0858L18 8.58579L20 10.5858V4H4ZM4 20V18.4142L8 14.4142L13.5858 20H4ZM20 20H16.4142L12.9142 16.5L18 11.4142L20 13.4142V20ZM14 8C14 6.34315 12.6569 5 11 5C9.34315 5 8 6.34315 8 8C8 9.65685 9.34315 11 11 11C12.6569 11 14 9.65685 14 8ZM10 8C10 7.44772 10.4477 7 11 7C11.5523 7 12 7.44772 12 8C12 8.55228 11.5523 9 11 9C10.4477 9 10 8.55228 10 8Z"
                            fill="rgba(255,255,255,1)"
                          />
                        </svg>
                        <p className="text-white font-semibold ml-2 text-sm">
                          Update Thumbnail (Max. 3MB)
                        </p>
                      </div>
                    </div>
                  </div>
                  <input
                    className="cursor-pointer w-full opacity-0 absolute inset-0"
                    type="file"
                    accept="image/*"
                    onChange={updateThumbnail}
                  />
                  {thumbnail && (
                    <img
                      className="w-full h-full object-cover m-auto"
                      src={parseImgUrl(thumbnail, null, {
                        width: `600`,
                      })}
                    />
                  )}
                </div>
              </div>
              <div className="w-full md:w-1/2 px-2">
                <h1 className="mb-2 block text-black text-md font-medium">
                  Title
                </h1>
                <input
                  type="text"
                  name="Title"
                  disabled={true}
                  value={title.getCurrentContent().getPlainText()}
                  className={`resize-none h-auto px-2 py-3 w-full rounded-md bg-gray-300 focus:border-gray-100`}
                  placeholder="Preview Title"
                />
                <h1 className="mt-3 mb-2 block text-black text-md font-medium">
                  Description
                </h1>
                <textarea
                  type="text"
                  name="SubTitle"
                  onChange={(e) => setSubTitle(e.target.value)}
                  value={subTitle}
                  className={`resize-none px-2 py-3 w-full rounded-md bg-gray-300 focus:border-gray-100 h-24`}
                  placeholder="Preview Description"
                />
                <div className="flex gap-4">
                  <button
                    className="font-semibold mt-3 py-3 w-40 rounded-md bg-primary text-white"
                    disabled={isSubmitting}
                    onClick={postNews}
                  >
                    {isSubmitting ? 'Publishing...' : 'Publish'}
                  </button>
                  {!isNewsDetail && (
                    <button
                      className="font-semibold mt-3 py-3 w-40 rounded-md border-2 border-black text-black"
                      disabled={isDraftIn}
                      onClick={saveDraft}
                    >
                      {isDraftIn ? 'Draft in...' : 'Draft'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}
      {showLeavingConfirmation && (
        <Modal
          close={() => setShowLeavingConfirmation(false)}
          closeOnBgClick
          closeOnEscape
        >
          <div className="w-full max-w-xs p-4 m-auto bg-gray-100 rounded-md overflow-y-auto max-h-screen">
            Are you sure to leave this page? You will lose any unpublished
            changes
            <div className="flex space-x-4">
              <button
                className="w-full outline-none h-12 mt-4 rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-2 border-primary text-white"
                style={{ backgroundColor: '#00BBDB' }}
                onClick={() => {
                  setPreventLeaving(false)
                  setTimeout(() => {
                    setShowLeavingConfirmation(false)
                    router.push(redirectUrl)
                  }, 100)
                }}
              >
                OK
              </button>
              <button
                className="w-full outline-none h-12 mt-4 rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-2 border-primary bg-white text-primary"
                onClick={() => setShowLeavingConfirmation(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}
      {showAlertErr && (
        <Modal close={() => setShowAlertErr(false)}>
          <div className="w-full max-w-xs p-4 m-auto bg-gray-100 rounded-md overflow-y-auto max-h-screen">
            <div className="w-full">
              You are about to delete {newsDetail?.title}
            </div>
            <button
              className="w-full outline-none h-12 mt-4 rounded-md bg-transparent text-sm font-semibold border-2 px-4 py-2 border-primary bg-primary text-gray-100"
              onClick={() => setShowAlertErr(false)}
              style={{ backgroundColor: '#00BBDB' }}
            >
              OK
            </button>
          </div>
        </Modal>
      )}
      <div className="mx-auto max-w-3xl px-4">
        <TextEditor
          content={content}
          setContent={setContent}
          title={title}
          setTitle={setTitle}
          onPressAddCard={getDataFromTokenId}
          showChapterModal={showChapterModal}
          showComicModal={showComicModal}
        />
      </div>
      {embeddedComic.length !== 0 && (
        <div className="max-w-4xl mx-auto px-4 pt-16">
          <div className="rounded-md p-4 md:p-8">
            <h4 className="text-black font-semibold text-3xl mb-4 text-center">
              Comic
            </h4>
            <div
              className={`md:flex md:flex-wrap ${
                embeddedComic.length <= 3 && 'justify-center'
              }`}
            >
              {embeddedComic.map((com, key) => (
                <div
                  key={key}
                  className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 p-4"
                >
                  <ComicNews
                    localComic={com}
                    onDelete={() => {
                      const temp = embeddedComic.filter(
                        (x) => x.comic_id != com.comic_id
                      )
                      setEmbeddedComic(temp)
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {embeddedChapter.length !== 0 && (
        <div className="max-w-4xl mx-auto px-4 pt-16">
          <div className=" border-2 border-dashed border-gray-800 rounded-md p-4 md:p-8">
            <h4 className="text-black font-semibold text-3xl mb-4 text-center">
              Chapter
            </h4>
            <div
              className={`md:flex md:flex-wrap ${
                embeddedChapter.length <= 3 && 'justify-center'
              }`}
            >
              {embeddedChapter.map((chapter) => (
                <div
                  key={chapter?._id}
                  className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 p-8"
                >
                  <ChapterNews
                    localToken={chapter}
                    deleteChapter={() => {
                      const temp = embeddedChapter.filter(
                        (x) => x.token_series_id != chapter.token_series_id
                      )
                      setEmbeddedChapter(temp)
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <div className="flex items-center max-w-3xl mx-auto px-4 pt-8">
        <button
          className={`font-semibold py-3 w-32 rounded-md ${
            title === '' || !content.getCurrentContent().hasText()
              ? 'bg-gray-200 cursor-default'
              : 'bg-primary '
          } text-white hover:bg-opacity-90`}
          onClick={onPressContinue}
          disabled={title === '' || !content.getCurrentContent().hasText()}
        >
          Continue
        </button>
        <DraftNews onCreatePublication />
      </div>
    </div>
  )
}

const generateEditorState = (content = null) => {
  if (!content) {
    content = {
      entityMap: {},
      blocks: [
        {
          text: '',
          key: 'foo',
          type: 'unstyled',
          entityRanges: [],
        },
      ],
    }
  }
  return EditorState.createWithContent(convertFromRaw(content))
}

const convertTextToEditorState = (text = '') =>
  EditorState.createWithContent(
    convertFromRaw({
      entityMap: {},
      blocks: [
        {
          text: text,
          key: 'title',
          type: 'unstyled',
          entityRanges: [],
        },
      ],
    })
  )

const ChapterNews = ({ localToken, deleteChapter }) => {
  return (
    <Fragment>
      <div className="w-full m-auto">
        <div
          className="mx-auto w-48 h-64 lg:w-48 lg:h-64 flex-none rounded-2xl bg-no-repeat bg-center bg-cover shadow-xl"
          style={{
            backgroundImage: `url(${parseImgUrl(
              localToken?.metadata.media,
              null,
              { width: `600` }
            )})`,
          }}
        />
      </div>
      <div className="text-black pt-2 mx-auto w-full">
        <div className=" overflow-hidden">
          <p
            title={localToken?.metadata?.title}
            className="text-base font-bold border-b-2 border-transparent truncate"
          >
            {localToken?.metadata?.title}
          </p>
        </div>
        <p className="opacity-75 truncate">
          {localToken?.metadata?.collection}
        </p>
      </div>
      <div
        className="text-red-600 text-sm cursor-pointer"
        onClick={deleteChapter}
      >
        Delete
      </div>
    </Fragment>
  )
}

const ComicNews = ({ localComic, onDelete }) => {
  return (
    <div className="flex flex-col">
      <div className="w-full h-full rounded">
        <div
          className="mx-auto w-52 h-72 lg:w-56 lg:h-80 flex-none bg-no-repeat bg-center bg-cover shadow-xl"
          style={{
            backgroundImage: `url(${parseImgUrl(
              localComic?.media
            )}?w=800&auto=format,compress)`,
          }}
        />
      </div>
      <a
        href={`/comics/${localComic?.comic_id}/chapter`}
        className="cursor-pointer"
        target={`_blank`}
      >
        <p
          title={localComic?.title}
          className="text-2xl font-bold truncate hover:underline text-black mt-4"
        >
          {localComic?.title}
        </p>
      </a>
      <div className="flex flex-row flex-wrap text-sm text-black items-center w-full">
        <span className="mr-1">comic by</span>
        <span className="truncate font-semibold text-primary">
          {localComic?.author_ids[0]}
        </span>
      </div>
      <div
        className="text-red-600 text-sm cursor-pointer mt-2"
        onClick={onDelete}
      >
        Delete
      </div>
    </div>
  )
}

export default NewsEditor
