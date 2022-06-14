import axios from 'axios'
import Button from 'components/Common/Button'
import { InputTextarea } from 'components/Common/form'
import Head from 'components/Common/Head'
import Layout from 'components/Common/Layout'
import { encodeImageToBlurhash } from 'lib/blurhash'
import { sentryCaptureException } from 'lib/sentry'
import useStore from 'lib/store'
import router from 'next/router'
import { useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { useForm } from 'react-hook-form'
import { MoonLoader } from 'react-spinners'
import { postCoverComic } from 'services/submission'
import { readFileAsUrl } from 'utils/common'

const SubmissionChampionshipFinal = () => {
  const [coverFile, setCoverFile] = useState('')
  const [coverPreview, setCoverPreview] = useState('')
  const [pages, setPages] = useState([])
  const [isOverDimensionsPage, setIsOverDimensionsPage] = useState(false)
  const [totalPageSize, setTotalPageSize] = useState(0)
  const [errorMessageCover, setErrorMessageCover] = useState(null)
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    clearErrors,
    setError,
  } = useForm()
  const [loading, setLoading] = useState(false)
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
      duration,
    })
  }

  const inputFilecover = (event) => {
    const img = event.target.files[0]
    setCoverFile(img)
    if (typeof img !== 'undefined') {
      let size = img.size / (1024 * 1024).toFixed(10)
      if (size < 10) {
        setCoverPreview(window.URL.createObjectURL(img))
      } else {
        setError('cover', {
          type: 'size',
          message: 'Image must be less than 10mb',
        })
        setErrorMessageCover('size')
        return
      }
    }

    const fileReader = new FileReader()
    fileReader.readAsDataURL(img)
    fileReader.onload = () => {
      const img = new Image()
      img.onload = () => {
        if (img.width !== 2048 || img.height !== 2848) {
          setError('cover', {
            type: 'dimension',
            message: 'The dimensions of the comic cover must be 2048 x 2848',
          })
          setErrorMessageCover('dimension')
          return
        }
      }
      img.src = fileReader.result
    }

    clearErrors()
    setErrorMessageCover(null)
    setValue('cover', img)
  }

  const onSubmit = async (data) => {
    const checkSizeOfFile = formatBytes(totalPageSize).props.children > 20.0
    const checkNumberOfFile = data.pages.length > 200
    const errorCheckNumberOfFile = 'The maximum number of files is 200.'
    const errorCheckSizeOfFile = 'The maximum number of sizes is 20 MB'
    const errorCheckDimensionsOfPage =
      'The dimensions of each comic page must be 800 x 1000'

    if (errorMessageCover) {
      setError('cover', {
        type: errorMessageCover,
        message:
          errorMessageCover === 'dimension'
            ? 'The dimensions of the comic cover must be 2048 x 2848'
            : 'Image must be less than 10mb',
      })
      return
    }
    if (checkNumberOfFile) {
      _showToast('error', errorCheckNumberOfFile)
      return
    }
    if (checkSizeOfFile) {
      _showToast('error', errorCheckSizeOfFile)
      return
    }
    if (isOverDimensionsPage) {
      _showToast('error', errorCheckDimensionsOfPage)
      return
    }

    setLoading(true)
    window.scrollTo(0, 0)
    const cover = new FormData()

    cover.append('files', coverFile)
    const coverLink = await readFileAsUrl(coverFile)
    const blurhash = await encodeImageToBlurhash(coverLink)

    try {
      const resCover = await postCoverComic(cover)
      const resPage = await axios.all(
        data.pages.map((page) => {
          const formData = new FormData()
          formData.append('files', page.file)
          return postCoverComic(formData)
        })
      )

      data.cover = resCover.data
      data.pages = resPage.map((res) => res.data)
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        'Something wrong happened, please try again!'
      _showToast('error', msg, null)
      sentryCaptureException(error)
    }

    const form = new FormData()
    form.append('cover', data.cover)
    form.append('blurhash', blurhash)
    form.append('synopsis', data.synopsis)
    form.append('comic_id', router.query.comic_id)
    form.append('key', router.query.key)
    data.pages.forEach((page) => {
      form.append('pages[]', page)
    })

    await axios
      .post(
        `${process.env.COMIC_API_URL}/submission-championship-final-round`,
        form
      )
      .then((response) => {
        setCoverPreview('')
        setPages([])
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
        setLoading(false)
        const msg =
          error.response?.data?.message ||
          'Something wrong happened, please try again!'
        _showToast('error', msg, null)
        sentryCaptureException(error)
        return error
      })
  }

  const addImages = async (e) => {
    let size = 0
    pages.forEach((item) => (size += item.file.size))
    setTotalPageSize(size)

    if (e.target.files && e.target.files.length > 0) {
      const newItems = []
      let isOverDimensions = []
      for (const file of e.target.files) {
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
        const currentItems = [...pages]
        setPages(currentItems.concat(newItems))
        setValue('pages', currentItems.concat(newItems))
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
      pages,
      result.source.index,
      result.destination.index
    )
    setPages(newItemsOrder)
    setValue('pages', newItemsOrder)
  }

  const removeFile = (_item) => {
    const files = pages.filter((item) => item.id !== _item.id)
    setPages(files)
    setValue('pages', files)
  }

  const formatBytes = (bytes, decimals = 0) => {
    const sizeInMB = (bytes / (1024 * 1024)).toFixed(decimals)

    return (
      <span className={sizeInMB > 20.0 ? 'text-red-500' : 'text-primary'}>
        {sizeInMB}
      </span>
    )
  }

  return (
    <Layout>
      <Head title="Final Round Submission Paras Comic Championship" />
      <div className="max-w-4xl m-auto p-4 py-8">
        {loading && (
          <div className="h-full w-full fixed top-0 right-0 bg-black bg-opacity-70 z-50">
            <div className="flex flex-col justify-center items-center h-screen">
              <MoonLoader color={'#00BBDB'} loading={loading} size={50} />
              <h4 className="text-white">Please wait..</h4>
            </div>
          </div>
        )}
        <div className="hidden md:block">
          <img
            src={`https://paras-cdn.imgix.net/bafybeigc6gbmqungrtanm3hy24klehoutyub3njwcvkhpcpyjxsjh65l34`}
            className="object-contain"
            alt=""
          />
        </div>
        <div className="block md:hidden">
          <img
            src={`https://paras-cdn.imgix.net/bafybeif3ip5wrrsygxf63ifcown5owharclzjxtm2g3kjujfpmbvvcesaq`}
            className="object-contain"
            alt=""
          />
        </div>
        <form
          id="form-submission"
          className="mt-8"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <label className="font-bold text-md">Cover chapter 2</label>
            <div
              className={`relative cursor-pointer ${
                !coverPreview ? 'w-40 h-40 ' : 'w-60 h-80'
              } overflow-hidden rounded-md mt-2 hover:opacity-80`}
            >
              <input
                type="file"
                accept="image/*"
                {...register('cover', {
                  required: true,
                  onChange: (e) => inputFilecover(e),
                })}
                className="cursor-pointer w-full opacity-0 absolute inset-0 z-20"
              />
              <div
                className={`${
                  !coverPreview ? 'w-40 h-40 ' : 'w-full h-full'
                } overflow-hidden bg-comic-gray-secondary shadow-inner relative input-text`}
              >
                {coverPreview && (
                  <img
                    src={coverPreview || null}
                    className="w-full h-full object-cover cover-comic"
                  />
                )}
                {!coverPreview && (
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
                    />
                  </svg>
                )}
              </div>
            </div>
            {errors.cover && (
              <span
                className={`${
                  !coverPreview || errors.cover ? 'text-red-500' : 'hidden'
                }`}
              >
                {errors.cover.message || 'This field is required'}
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
                Image size must be 2048 x 2848, <br /> Image must be less than
                10mb
              </p>
            </div>
          </div>
          <div className="mt-8 mb-2">
            <label className="font-bold text-md">Synopsis chapter 2</label>
            <p className="italic text-xs text-gray-400">
              Please input your synopsis with max 250 characters
            </p>
            <InputTextarea
              label="synopsis"
              register={register}
              required
              className="resize-none h-40 mt-3"
              type="text"
              placeholder="Synopsis of your chapter two"
              maxLength={250}
            />
            {errors.synopsis && (
              <span className="text-red-500">This field is required</span>
            )}
          </div>
          <div className="relative">
            <div className="flex justify-between items-center">
              <div className="flex gap-4 mt-8 mb-2">
                <label className="font-bold text-md">Upload File</label>
              </div>
            </div>
            <div className="flex justify-between items-center mb-3">
              <h4>
                <span
                  className={
                    pages.length > 200 ? 'text-red-500' : 'text-primary'
                  }
                >
                  {`${pages.length} `}
                </span>
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
                    {pages.length === 0 && (
                      <div className="flex justify-center items-center mt-10 h-80 text-[#BBBBBB] absolute md:static px-7 text-center left-0">
                        You can add more than 1 file at a time
                      </div>
                    )}
                    {pages.map((item, index) => (
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
            {(errors.pages || isOverDimensionsPage) && (
              <span className="text-red-500">
                {isOverDimensionsPage
                  ? `The dimensions of each comic page must be 800 x 1000`
                  : `This field is required`}
              </span>
            )}
            <h4 className="absolute right-0 -bottom-7">
              {formatBytes(totalPageSize)} / 20 MB
            </h4>
          </div>
          <Button type="submit" size="md" className="mt-8 px-16">
            Submit
          </Button>
        </form>
      </div>
    </Layout>
  )
}

export default SubmissionChampionshipFinal
