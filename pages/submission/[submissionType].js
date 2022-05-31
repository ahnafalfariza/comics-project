import axios from 'axios'
import { InputText, InputTextarea } from 'components/Common/form'
import useStore from 'lib/store'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { FormProvider, useForm } from 'react-hook-form'
import { MoonLoader } from 'react-spinners'
import { getGenres, getSubGenres, postCoverComic } from 'services/submission'
import { parseImgUrl, readFileAsUrl } from 'utils/common'
import { InputDropdown } from '../../components/Common/form/components/InputDropdown'
import Layout from 'components/Common/Layout'
import Head from 'components/Common/Head'
import slug from 'slug'
import { encodeImageToBlurhash } from 'lib/blurhash'
import { sentryCaptureException } from 'lib/sentry'

const FormSubmission = ({ dataSubmission }) => {
  const [cover, setCover] = useState('')
  const [coverPreview, setCoverPreview] = useState('')
  const [logo, setLogo] = useState('')
  const [logoPreview, setLogoPreview] = useState('')
  const [items, setItems] = useState([])
  const [isOverDimensionsLogo, setIsOverDimensionsLogo] = useState(false)
  const [isOverDimensionsCover, setIsOverDimensionsCover] = useState(false)
  const [sizeComic, setSizeComic] = useState(0)
  const [isOverDimensionsPage, setIsOverDimensionsPage] = useState(false)
  const methods = useForm()
  const { register, handleSubmit, formState, setValue, reset, clearErrors } =
    methods
  const [genreList, setGenreList] = useState([])
  const [genreSelect, setGenreSelect] = useState('')
  const [subGenreList, setSubGenreList] = useState([])
  const [subGenreSelect, setSubGenreSelect] = useState('')
  const [errorMessageLogo, setErrorMessageLogo] = useState(false)
  const [errorMessageCover, setErrorMessageCover] = useState(false)
  const genreModalRef = useRef()
  const subGenreModalRef = useRef()
  const [loading, setLoading] = useState(false)
  const [isSubmit, setIsSubmit] = useState(false)

  const setToastConfig = useStore((state) => state.setToastConfig)

  const _showToast = (type, msg, duration = 2500) => {
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
      duration: duration,
    })
  }

  const getGenreList = useCallback(async () => {
    const data = await getGenres()
    setGenreList(data)
    setGenreSelect(data[0].genre)
  }, [])

  const getSubGenreList = useCallback(async () => {
    const data = await getSubGenres()
    setSubGenreList(data)
    setSubGenreSelect(data[0].subgenre)
  }, [])

  useEffect(() => {
    getGenreList()
    getSubGenreList()
  }, [getGenreList, getSubGenreList])

  useEffect(() => {
    if (cover === undefined) setCoverPreview(cover)
    if (logo === undefined) setLogoPreview(logo)
  }, [cover, logo])

  useEffect(() => {
    let size = 0

    items.forEach((item) => (size += item.file.size))
    setSizeComic(size)
  }, [sizeComic, items])

  const formatBytes = (bytes, decimals = 0) => {
    const sizeInMB = (bytes / (1024 * 1024)).toFixed(decimals)

    return (
      <span className={sizeInMB > 20.0 ? 'text-red-500' : 'text-primary'}>
        {sizeInMB}
      </span>
    )
  }

  const onSubmit = async (data) => {
    data.cover = cover
    data.pages = items
    data.logo = logo
    const checkSizeofFile = formatBytes(sizeComic).props.children > 20.0
    const checkNumberOfFile = items.length > 200

    const errorCheckNumberOfFile = 'The maximum number of files is 200.'
    const errorCheckSizeOfFile = 'The maximum number of sizes is 20 MB'
    const errorCheckDimensionsOfPage =
      'The dimensions of each comic page must be 800 x 1000'
    const errorCheckDimensionsLogo =
      'The dimensions of comic logo must be 1080 x 1080'
    const errorCheckDimensionsCover =
      'The dimensions of comic cover must be 2048 x 2848'

    let blurhash = ''

    if (
      checkNumberOfFile ||
      checkSizeofFile ||
      isOverDimensionsLogo ||
      isOverDimensionsCover ||
      isOverDimensionsPage
    ) {
      window.scrollTo(0, 0)
      if (checkNumberOfFile) {
        _showToast(
          'error',
          isOverDimensionsLogo ? errorCheckNumberOfFile : errorCheckSizeOfFile
        )
        return
      }
      if (isOverDimensionsLogo) {
        _showToast(
          'error',
          isOverDimensionsLogo ? errorCheckDimensionsLogo : errorCheckSizeOfFile
        )
        return
      }
      if (isOverDimensionsCover) {
        _showToast(
          'error',
          isOverDimensionsCover
            ? errorCheckDimensionsCover
            : errorCheckSizeOfFile
        )
        return
      }
      if (isOverDimensionsPage) {
        _showToast(
          'error',
          isOverDimensionsPage
            ? errorCheckDimensionsOfPage
            : errorCheckSizeOfFile
        )
        return
      }
    } else {
      setLoading(true)
      window.scrollTo(0, 0)

      const cover = new FormData()
      const logo = new FormData()
      if (dataSubmission.type_submission !== 'artist') {
        cover.append('files', data.cover)
        logo.append('files', data.logo)
        const coverLink = await readFileAsUrl(data.cover)
        blurhash = await encodeImageToBlurhash(coverLink)
      }
      const pages = new FormData()
      data.pages.forEach((page) => {
        pages.append('files', page.file)
      })

      if (dataSubmission.type_submission !== 'artist') {
        await axios
          .all([postCoverComic(cover), postCoverComic(logo)])
          .then((results) => {
            data.cover = results[0].data
            data.logo = results[1].data
            return results.data
          })
          .catch((error) => {
            sentryCaptureException(error)
            return error
          })
      }

      const resPage = await axios.all(
        data.pages.map((page) => {
          const formData = new FormData()
          formData.append('files', page.file)
          return postCoverComic(formData)
        })
      )

      data.pages = resPage.map((res) => res.data)

      const form = new FormData()
      form.append('type_submission', dataSubmission.type_submission)
      if (dataSubmission.type_submission !== 'artist') {
        form.append('cover', data.cover)
        form.append('blurhash', blurhash)
        form.append('logo', data.logo)
        form.append(
          'comic_id',
          slug(data.title) + '_' + Math.random().toString(16).slice(2)
        )
        form.append('name', data.name)
        form.append('chapter_id', '1')
        form.append('phone_number', data.phone_number)
        form.append('social_media[twitter]', data.twitter)
        form.append('social_media[instagram]', data.instagram)
        form.append('social_media[discord]', data.discord)
        form.append('lang', 'id')
        form.append('story_concept_file', data.story_concept_file)
      } else {
        form.append('portfolio_url', data.portfolio_url)
        form.append('story_concept_file', data.story_concept_file)
      }
      form.append(
        'subgenre',
        dataSubmission.type_submission !== 'artist' ? 'Fantasy' : subGenreSelect
      )
      form.append('title', data.title)
      form.append('genre', genreSelect.split('-')[0])
      form.append('synopsis', data.synopsis)
      form.append('email', data.email)
      data.pages.forEach((page) => {
        form.append('pages[]', page)
      })

      await axios
        .post(`${process.env.COMIC_API_URL}/submission`, form)
        .then((response) => {
          setCover('')
          setCoverPreview('')
          setLogo('')
          setLogoPreview('')
          setItems([])
          setIsSubmit(true)
          setGenreSelect(genreList[0].genre)
          setSubGenreSelect(subGenreList[0].subgenre)
          reset()
          clearErrors()
          setLoading(false)
          _showToast(
            'success',
            "Thank you for your interest, We'll be in touch!",
            null
          )
          return response.data
        })
        .catch((error) => {
          const msg =
            error.response?.data?.message ||
            `Something wrong happened, please try again!`
          sentryCaptureException(error)
          setLoading(false)
          _showToast('error', msg, null)
          return error
        })
    }
  }

  const addImages = async (e) => {
    let size = 0
    items.forEach((item) => (size += item.file.size))
    setSizeComic(size)

    if (e.target.files && e.target.files.length > 0) {
      const newItems = []
      let isOverDimensions = []
      for (const file of e.target.files) {
        //check dimensions
        if (dataSubmission.type_submission !== 'artist') {
          const reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = () => {
            const image = new Image()
            image.src = reader.result
            image.onload = () => {
              if (image.width === 800 && image.height === 1000) {
                isOverDimensions.push(false)
              } else {
                isOverDimensions.push(true)
              }
            }
          }
        }
        const imgUrl = await readFileAsUrl(file)
        newItems.push({
          id:
            Math.ceil(Math.random() * 1000).toString() +
            Math.ceil(Math.random() * 1000).toString(),
          content: imgUrl,
          file: file,
        })
      }
      if (isOverDimensions.every((data) => !data)) {
        setIsOverDimensionsPage(false)
      } else {
        setIsOverDimensionsPage(true)
      }
      if (isOverDimensions.every((data) => !data)) {
        const currentItems = [...items]
        setItems(currentItems.concat(newItems))
      }
    }
  }

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex, 0, removed)

    return result
  }

  const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: 'none',
    background: isDragging ? 'lightgreen' : '#b8b8b9',
    width: '100%',
    margin: `0 0 4px 0`,
    right: 340,
    left: 0,
    ...draggableStyle,
  })

  const getListStyle = (isDraggingOver) => ({
    background: isDraggingOver ? 'rgb (30, 41, 59)' : '#F4F4F5',
    border: '1px solid rgba(145, 145, 145, 0.7)',
    height: 400,
  })

  const onDragEnd = (result) => {
    if (!result.destination) {
      return
    }

    const newItemsOrder = reorder(
      items,
      result.source.index,
      result.destination.index
    )

    setItems(newItemsOrder)
  }

  const removeFile = (_item) => {
    const files = items.filter((item) => item.id !== _item.id)
    setItems(files)
    setValue('pages', files)
  }

  const inputFilecover = (event, type) => {
    const img = event.target.files[0]
    let checkDimensions = false
    type === 'logo' ? setLogo(img) : setCover(img)

    if (typeof img !== 'undefined') {
      let size = img.size / (1024 * 1024).toFixed(10)
      if (size < 10 || checkDimensions) {
        let binaryData = []
        binaryData.push(img)
        if (type === 'logo') {
          setLogoPreview(
            window.URL.createObjectURL(
              new Blob(binaryData, { type: 'image/*' })
            )
          )
          setErrorMessageLogo(false)
        } else {
          setCoverPreview(
            window.URL.createObjectURL(
              new Blob(binaryData, { type: 'image/*' })
            )
          )
          setErrorMessageCover(false)
        }
      } else {
        if (type === 'logo') {
          setErrorMessageLogo(true)
        } else {
          setErrorMessageCover(true)
        }
      }
    }

    const fileReader = new FileReader()
    fileReader.onload = () => {
      const img = new Image()

      img.onload = () => {
        if (dataSubmission.type_submission === 'artist') {
          if (img.width !== 640 || img.height !== 890) {
            setIsOverDimensionsLogo(true)
          }
        } else {
          if (type === 'logo') {
            if (img.width !== 1080 || img.height !== 1080) {
              setIsOverDimensionsLogo(true)
            } else {
              setIsOverDimensionsLogo(false)
            }
          } else if (type === 'cover') {
            if (img.width !== 2048 || img.height !== 2848) {
              setIsOverDimensionsCover(true)
            } else {
              setIsOverDimensionsCover(false)
            }
          }
        }
      }

      img.src = fileReader.result
    }
    if (typeof img !== 'undefined') fileReader.readAsDataURL(img)
  }

  return (
    <Layout>
      <Head
        title={dataSubmission.title}
        description={dataSubmission.description}
        image={parseImgUrl(dataSubmission.cover)}
      />
      <div className="max-w-4xl m-auto p-4 py-8">
        {loading && (
          <div className="h-full w-full fixed top-0 right-0 bg-black bg-opacity-70 z-50">
            <div className="flex flex-col justify-center items-center h-screen">
              <MoonLoader color={'#00BBDB'} loading={loading} size={50} />
              <h4 className="text-white">Please wait..</h4>
            </div>
          </div>
        )}
        {dataSubmission.type_submission !== 'artist' ? (
          <>
            <div className="hidden md:block">
              <img
                src={`https://paras-cdn.imgix.net/bafybeigii7iy77byzjcpbvkq2gi7qiahwkjyn5sxljb6bb6mazffacdmsm`}
                className="object-contain"
                alt=""
              />
            </div>
            <div className="block md:hidden">
              <img
                src={`https://paras-cdn.imgix.net/bafybeidcbu2aoell56amcz574idulbdeaveotdmmalaxngcgxk6zga2pie`}
                className="object-contain"
                alt=""
              />
            </div>
          </>
        ) : (
          <div>
            <h1 className="text-center font-bold text-3xl mb-2">
              {dataSubmission.title}
            </h1>
            <p className="text-primary text-sm text-center mb-9">
              {dataSubmission.description}
            </p>
          </div>
        )}

        {dataSubmission.type_submission !== 'artist' && (
          <div className="mt-4 border-2 border-dashed border-primary flex max-w-6xl items-center justify-between rounded-md py-4 px-8">
            <div className="mx-2">
              <h4 className="font-semibold">
                Read Submission Guideline{' '}
                <a
                  href={`https://ipfs.fleek.co/ipfs/${dataSubmission.guideline}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary border-b-2 border-transparent cursor-pointer active:border-primary hover:text-opacity-30 transition-all"
                >
                  here
                </a>
              </h4>
            </div>
            {dataSubmission.type_submission !== 'artist' && (
              <div className="mx-2">
                <h4 className="font-semibold">
                  Having difficulties?{` `}
                  <a
                    href={`https://bit.ly/ParasComicDiscord`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary cursor-pointer transition-all hover:text-opacity-30"
                  >
                    Ask Our Team
                  </a>
                </h4>
              </div>
            )}
          </div>
        )}
        <div
          className={`max-w-3xl ${
            dataSubmission.type_submission === 'artist' && `m-auto p-4`
          } py-8`}
        >
          {dataSubmission.type_submission === 'artist' && (
            <div className="mb-4">
              <h4>
                Read Submission Guideline{' '}
                <a
                  href={`https://ipfs.fleek.co/ipfs/${dataSubmission.guideline}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary border-b-2 border-transparent cursor-pointer active:border-primary hover:text-opacity-30 transition-all"
                >
                  here
                </a>
              </h4>
            </div>
          )}
          <FormProvider {...methods}>
            <form
              id="form-submission"
              onSubmit={handleSubmit(onSubmit)}
              method="post"
            >
              {dataSubmission.type_submission !== 'artist' && (
                <div className="md:flex justify-between">
                  <div>
                    <label className="font-bold text-md">Comic Logo</label>
                    <div
                      className={`relative cursor-pointer ${
                        !logo && !logoPreview ? 'w-28 h-28 ' : 'w-52 h-52'
                      } overflow-hidden rounded-md mt-2 hover:opacity-80`}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        {...register('logo', {
                          required: true,
                          onChange: (e) => inputFilecover(e, 'logo'),
                        })}
                        className="cursor-pointer w-full opacity-0 absolute inset-0 z-20"
                      />
                      <div
                        className={`${
                          !logo && !logoPreview ? 'w-28 h-28 ' : 'w-full h-full'
                        } overflow-hidden bg-comic-gray-secondary shadow-inner relative input-text`}
                      >
                        <img
                          src={logo === '' ? null : logoPreview}
                          className={'w-full h-full object-cover cover-comic'}
                          style={{ textIndent: '-10000px' }}
                        />
                        {!logo && !logoPreview && (
                          <svg
                            className="w-14 h-14 text-comic-gray-tertiary absolute inset-0 mx-auto my-auto"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            ></path>
                          </svg>
                        )}
                      </div>
                    </div>
                    {(formState.errors.logo ||
                      errorMessageLogo ||
                      isOverDimensionsLogo) && (
                      <span
                        className={`${
                          !logoPreview ||
                          errorMessageLogo ||
                          isOverDimensionsLogo
                            ? 'text-red-500'
                            : 'hidden'
                        }`}
                      >
                        {errorMessageLogo
                          ? 'Image must be less than 10mb'
                          : isOverDimensionsLogo
                          ? 'The dimensions of the comic cover must be 1080 x 1080'
                          : 'This field is required'}
                      </span>
                    )}
                    <div>
                      <p className="text-comic-gray-tertiary text-sm font-normal mt-4 mb-8">
                        Image size must be 1080 x 1080, <br /> Image must be
                        less than 10mb
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {dataSubmission.type_submission !== 'artist' && (
                <div className="md:flex justify-between">
                  <div>
                    <label className="font-bold text-md">Cover Comic</label>
                    <div
                      className={`relative cursor-pointer ${
                        !cover && !coverPreview ? 'w-40 h-40 ' : 'w-60 h-80'
                      } overflow-hidden rounded-md mt-2 hover:opacity-80`}
                    >
                      <input
                        type="file"
                        accept="image/*"
                        {...register('cover', {
                          required: true,
                          onChange: (e) => inputFilecover(e, 'cover'),
                        })}
                        className="cursor-pointer w-full opacity-0 absolute inset-0 z-20"
                      />
                      <div
                        className={`${
                          !cover && !coverPreview
                            ? 'w-40 h-40 '
                            : 'w-full h-full'
                        } overflow-hidden bg-comic-gray-secondary shadow-inner relative input-text`}
                      >
                        <img
                          src={cover === '' ? null : coverPreview}
                          className={'w-full h-full object-cover cover-comic'}
                          style={{ textIndent: '-10000px' }}
                        />
                        {!cover && !coverPreview && (
                          <svg
                            className="w-14 h-14 text-comic-gray-tertiary absolute inset-0 mx-auto my-auto"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            ></path>
                          </svg>
                        )}
                      </div>
                    </div>
                    {(formState.errors.cover ||
                      errorMessageCover ||
                      isOverDimensionsCover) && (
                      <span
                        className={`${
                          !coverPreview ||
                          errorMessageCover ||
                          isOverDimensionsCover
                            ? 'text-red-500'
                            : 'hidden'
                        }`}
                      >
                        {errorMessageCover
                          ? 'Image must be less than 10mb'
                          : isOverDimensionsCover
                          ? 'The dimensions of the comic cover must be 2048 x 2848'
                          : 'This field is required'}
                      </span>
                    )}
                    <div>
                      <p className="mt-4 text-comic-gray-tertiary text-sm font-normal">
                        Download our cover template{' '}
                        <a
                          href={`https://bit.ly/ParasChampionshipCover`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary border-b-2 border-transparent cursor-pointer active:border-primary"
                        >
                          here
                        </a>
                      </p>
                      <p className="text-comic-gray-tertiary text-sm font-normal mb-8">
                        Image size must be 2048 x 2848, <br /> Image must be
                        less than 10mb
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <div className="md:flex justify-between gap-8">
                <div className="mb-2">
                  <label className="font-bold text-md">Comic Title</label>
                  <InputText
                    label="title"
                    register={register}
                    required
                    type="text"
                    placeholder="Paradigm"
                    className="mt-3 mr-64"
                  />
                  {formState.errors.title && (
                    <span className="text-red-500">This field is required</span>
                  )}
                </div>
              </div>
              {dataSubmission.type_submission !== 'artist' && (
                <div className="md:flex justify-between gap-8 mt-8">
                  <div className="mb-2">
                    <label className="font-bold text-md">
                      Comic Author's Name
                    </label>
                    <InputText
                      label="name"
                      register={register}
                      required
                      type="text"
                      placeholder="Fullname"
                      className="mt-3 mr-64"
                    />
                    {formState.errors.name && (
                      <span className="text-red-500">
                        This field is required
                      </span>
                    )}
                  </div>
                </div>
              )}
              {dataSubmission.type_submission !== 'artist' && (
                <div className="mt-8 mb-2">
                  <label className="font-bold text-md">Email</label>
                  <InputText
                    label="email"
                    register={register}
                    required
                    className="mt-3 md:w-96"
                    placeholder="Please input your email"
                    type="email"
                    width="80"
                  />
                  {formState.errors.email && (
                    <span className="text-red-500">This field is required</span>
                  )}
                </div>
              )}
              {dataSubmission.type_submission !== 'artist' && (
                <div className="mt-8 mb-2">
                  <label className="font-bold text-md">
                    Mobile/Whatsapp Number
                  </label>
                  <p className="italic text-xs text-gray-400">628xxx</p>
                  <InputText
                    label="phone_number"
                    register={register}
                    className="mt-3 md:w-96"
                    placeholder="Please input your phone number"
                    type="phone_number"
                    width="80"
                  />
                  {formState.errors.phone_number && (
                    <span className="text-red-500">
                      Use appropriate format number
                    </span>
                  )}
                </div>
              )}
              {dataSubmission.type_submission !== 'artist' && (
                <div className="block md:flex w-full items-start">
                  <div className="mt-8 mb-2 w-full md:w-6/12 mr-2">
                    <label className="font-bold text-md">Instagram</label>
                    <p className="italic text-xs text-gray-400">
                      https://instagram.com/username
                    </p>
                    <InputText
                      label="instagram"
                      register={register}
                      className="mt-3 md:w-full"
                      placeholder="username"
                      type="instagram"
                    />
                    {formState.errors.instagram && (
                      <span className="text-red-500">
                        Use appropriate format link
                      </span>
                    )}
                  </div>
                  <div className="mt-8 mb-2 w-full md:w-6/12 mx-1">
                    <label className="font-bold text-md">Twitter</label>
                    <p className="italic text-xs text-gray-400">
                      https://twitter.com/username
                    </p>
                    <InputText
                      label="twitter"
                      register={register}
                      className="mt-3 md:w-full"
                      placeholder="username"
                      type="twitter"
                    />
                    {formState.errors.twitter && (
                      <span className="text-red-500">
                        Use appropriate format link
                      </span>
                    )}
                  </div>
                  <div className="mt-8 mb-2 w-full md:w-6/12 ml-2">
                    <label className="font-bold text-md">Discord</label>
                    <p className="italic text-xs text-gray-400">Username</p>
                    <InputText
                      label="discord"
                      register={register}
                      className="mt-3 md:w-full"
                      placeholder="username"
                      type="discord"
                    />
                  </div>
                </div>
              )}
              {dataSubmission.type_submission === 'artist' && (
                <div className="mt-8 mb-2">
                  <label className="font-bold text-md">Email</label>
                  <InputText
                    label="email"
                    register={register}
                    required
                    className="mt-3 md:w-96"
                    placeholder="Please input your email"
                    type="email"
                    width="80"
                  />
                  {formState.errors.email && (
                    <span className="text-red-500">This field is required</span>
                  )}
                </div>
              )}
              <div className="md:flex justify-start gap-2 md:gap-20">
                <InputDropdown
                  title="Genre"
                  ref={genreModalRef}
                  data={
                    dataSubmission.type_submission !== 'artist'
                      ? genreList
                          .filter(
                            (genre) =>
                              genre.genre_id === 'action' ||
                              genre.genre_id === 'romance'
                          )
                          .map((genre) => ({
                            ...genre,
                            genre: `${genre.genre}-Fantasy`,
                          }))
                      : genreList
                  }
                  register={register}
                  label="genre"
                  selectItem={setGenreSelect}
                  submit={isSubmit}
                />
                {dataSubmission.type_submission === 'artist' && (
                  <InputDropdown
                    title="Sub Genre"
                    ref={subGenreModalRef}
                    data={subGenreList}
                    register={register}
                    label="subgenre"
                    selectItem={setSubGenreSelect}
                    submit={isSubmit}
                  />
                )}
              </div>
              <div className="mt-8 mb-2">
                <label className="font-bold text-md">Synopsis</label>
                <p className="italic text-xs text-gray-400">
                  Please input your synopsis with max 250 characters
                </p>
                <InputTextarea
                  label="synopsis"
                  register={register}
                  required
                  className="resize-none h-40 mt-3"
                  type="text"
                  placeholder="Synopsis of your comic"
                  maxLength={250}
                />
                {formState.errors.synopsis && (
                  <span className="text-red-500">This field is required</span>
                )}
              </div>
              <div className="mt-8 mb-2">
                <label className="font-bold text-md">Story Concept</label>
                <p className="italic text-xs text-gray-400">
                  Please input your full storyline from beginning to the end
                  with no limited character
                </p>
                <InputTextarea
                  label="story_concept_file"
                  register={register}
                  className="resize-none h-40 mt-3"
                  type="text"
                  placeholder="Tell us your story concept"
                  required
                />
                {formState.errors.story_concept_file && (
                  <span className="text-red-500">This field is required</span>
                )}
              </div>
              {dataSubmission.type_submission === 'artist' && (
                <div className="mt-8 mb-2">
                  <label className="font-bold text-md">Link Portfolio</label>
                  <InputText
                    label="portfolio_url"
                    register={register}
                    required
                    type="text"
                    placeholder="Link to your comic portfolio"
                    className="mt-3 md:w-96"
                    width="80"
                  />
                  {formState.errors.portfolio_url && (
                    <span className="text-red-500">This field is required</span>
                  )}
                </div>
              )}
              <div className="relative">
                <div className="flex justify-between items-center">
                  <div className="flex gap-4 mt-8 mb-2">
                    <label className="font-bold text-md">
                      Upload File{' '}
                      {dataSubmission.type_submission === 'artist' && (
                        <span className="font-thin">
                          (for your comic examples)
                        </span>
                      )}
                    </label>
                  </div>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <h4>
                    {' '}
                    <span
                      className={
                        items.length > 200 ? 'text-red-500' : 'text-primary'
                      }
                    >
                      {items.length}
                    </span>{' '}
                    / 200
                  </h4>
                  <label>
                    <input
                      multiple
                      type="file"
                      accept="image/*"
                      {...register('pages', {
                        required: true,
                        onChange: addImages,
                      })}
                      style={{ display: 'none' }}
                    />
                    <p className="text-primary font-bold text-sm cursor-pointer">
                      + Add File
                    </p>
                  </label>
                </div>
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="droppable" className="h-80">
                    {(provided, snapshot) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        style={getListStyle(snapshot.isDraggingOver)}
                        className="rounded-md overflow-auto px-4 md:px-40"
                      >
                        {items.length === 0 && (
                          <div className="flex justify-center items-center mt-10 h-80 text-[#BBBBBB] absolute md:static px-7 text-center left-0">
                            You can add more than 1 file at a time
                          </div>
                        )}
                        {items.map((item, index) => (
                          <Draggable
                            key={item.id}
                            draggableId={item.id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                className="relative"
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={getItemStyle(
                                  snapshot.isDragging,
                                  provided.draggableProps.style
                                )}
                              >
                                <img src={item.content} />
                                <svg
                                  onClick={() => removeFile(item)}
                                  className="m-2 w-7 h-7 p-1 cursor-pointer text-red-500 bg-white bg-opacity-40 hover:bg-opacity-20 rounded-full absolute top-0 right-0 z-10"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                  ></path>
                                </svg>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
                <h4 className="absolute right-0 -bottom-7">
                  {formatBytes(sizeComic)} / 20 MB
                </h4>
              </div>
              {(formState.errors.pages || isOverDimensionsPage) && (
                <span
                  className={
                    dataSubmission.type_submission === 'artist'
                      ? items.length !== 0
                        ? 'hidden '
                        : 'text-red-500'
                      : `text-red-500`
                  }
                >
                  {isOverDimensionsPage
                    ? `The dimensions of each comic page must be 800 x 1000`
                    : `This field is required`}
                </span>
              )}
              {dataSubmission.type_submission === 'artist' && (
                <p className="text-sm text-gray-500 text-justify mt-16 md:w-3/4">
                  *Submission results will be sent by Paras Editor Team within
                  14 working days after the submission is received.
                </p>
              )}
              <input
                type="submit"
                value="Submit"
                className="flex py-3 px-12 md:px-14 mt-8 text-sm text-white bg-primary font-thin rounded-full hover:opacity-80 cursor-pointer"
              />
            </form>
          </FormProvider>
        </div>
      </div>
    </Layout>
  )
}

export default FormSubmission

export async function getServerSideProps({ params }) {
  const res = await axios.get(`${process.env.COMIC_API_URL}/submission-types`, {
    params: {
      type_submission: params.submissionType,
    },
  })
  const dataSubmission = res.data.result[0] || null
  if (!dataSubmission || !dataSubmission?.is_active) {
    return {
      redirect: {
        destination: '/submission/artist',
        permanent: false,
      },
    }
  }

  return {
    props: {
      dataSubmission,
    },
  }
}
