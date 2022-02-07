import axios from 'axios'
import { InputText, InputTextarea } from 'components/Common/form'
import useStore from 'lib/store'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { FormProvider, useForm } from 'react-hook-form'
import { MoonLoader } from 'react-spinners'
import {
  getGenres,
  getSubGenres,
  postCoverComic,
  postPagesComic,
} from 'services/submission'
import { readFileAsUrl } from 'utils/common'
import { InputDropdown } from '../../components/Common/form/components/InputDropdown'
import Layout from 'components/Common/Layout'
import Head from 'components/Common/Head'

const FormSubmission = () => {
  const router = useRouter()
  const [cover, setCover] = useState('')
  const [coverPreview, setCoverPreview] = useState('')
  const [items, setItems] = useState([])
  const [isOverDimensions, setIsOverDimensions] = useState(false)
  const [sizeComic, setSizeComic] = useState(0)
  const methods = useForm()
  const { register, handleSubmit, formState, setValue, reset, clearErrors } =
    methods
  const [genreList, setGenreList] = useState([])
  const [genreSelect, setGenreSelect] = useState('')
  const [subGenreList, setSubGenreList] = useState([])
  const [subGenreSelect, setSubGenreSelect] = useState('')
  const [errorMessage, setErrorMessage] = useState(false)
  const genreModalRef = useRef()
  const subGenreModalRef = useRef()
  const [loading, setLoading] = useState(false)
  const [isSubmit, setIsSubmit] = useState(false)

  const setToastConfig = useStore((state) => state.setToastConfig)

  const dataSubmission = [
    {
      title: 'Artist Submission',
      description: 'Comic Submission for all artists',
      openLink:
        'https://ipfs.fleek.co/ipfs/bafybeiaam3zvrf6ar57peyn7n2z2yevfiddsaor5yiaphbfwbmvahw53nq',
    },
    {
      title: 'Comic Festival: Valentine #1 Submission',
      description:
        'Share your heartfelt love story and create your best One-shot comic with theme of: "Love is…?!"\nJoin this Comic Competition, and WIN a total prize of $2000!\nSubmission Period: Feb 7th - Feb 25th, 2022',
      openLink:
        'https://ipfs.fleek.co/ipfs/bafybeifsnzqdzce2ts3nczlfpopxdvkbsijuhnvyyyyxjoyxrscxddx5c4',
    },
  ]

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
  }, [cover])

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
    const checkSizeofFile = formatBytes(sizeComic).props.children > 20.0
    const checkNumberOfFile = items.length > 100

    const errorCheckNumberOfFile = 'The maximum number of files is 100.'
    const errorCheckSizeOfFile = 'The maximum number of sizes is 20 MB'

    if (checkNumberOfFile || checkSizeofFile || isOverDimensions) {
      window.scrollTo(0, 0)
      if (!isOverDimensions) {
        _showToast(
          'error',
          checkNumberOfFile ? errorCheckNumberOfFile : errorCheckSizeOfFile
        )
      }
    } else {
      setLoading(true)
      window.scrollTo(0, 0)

      const cover = new FormData()
      cover.append('files', data.cover)
      const pages = new FormData()
      data.pages.forEach((page) => {
        pages.append('files', page.file)
      })

      await axios
        .all([postCoverComic(cover), postPagesComic(pages)])
        .then((results) => {
          data.cover = results[0].data
          data.pages = results[1].data

          return results.data
        })
        .catch((error) => {
          return error
        })

      const form = new FormData()
      form.append('type_submission', router.query.submissionType)
      form.append('cover', data.cover)
      form.append('title', data.title)
      form.append('genre', genreSelect)
      form.append('subgenre', subGenreSelect)
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
          setItems([])
          setIsSubmit(true)
          setGenreSelect(genreList[0].genre)
          setSubGenreSelect(subGenreList[0].subgenre)
          reset()
          clearErrors()
          setLoading(false)
          _showToast(
            'success',
            "Thank you for your interest, We'll be in touch!"
          )
          return response.data
        })
        .catch((error) => {
          setLoading(false)
          _showToast('error', 'Something wrong happened, please try again!')
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
      for (const file of e.target.files) {
        const imgUrl = await readFileAsUrl(file)
        newItems.push({
          id:
            Math.ceil(Math.random() * 1000).toString() +
            Math.ceil(Math.random() * 1000).toString(),
          content: imgUrl,
          file: file,
        })
      }
      const currentItems = [...items]
      setItems(currentItems.concat(newItems))
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

  const inputFilecover = (event) => {
    const img = event.target.files[0]
    let checkDimensions = false
    setCover(img)

    if (typeof img !== 'undefined') {
      let size = img.size / (1024 * 1024).toFixed(10)
      if (size < 10 || checkDimensions) {
        let binaryData = []
        binaryData.push(img)
        setCoverPreview(
          window.URL.createObjectURL(new Blob(binaryData, { type: 'image/*' }))
        )
        setIsOverDimensions(false)
        setErrorMessage(false)
      } else {
        setIsOverDimensions(true)
        setErrorMessage(true)
      }
    }

    const fileReader = new FileReader()
    fileReader.onload = () => {
      const img = new Image()

      img.onload = () => {
        if (img.width !== 640 || img.height !== 890) {
          checkDimensions = true
          setIsOverDimensions(true)
        }
      }

      img.src = fileReader.result
    }
    if (typeof img !== 'undefined') fileReader.readAsDataURL(img)
  }

  return (
    <Layout>
      <Head title={router.query.title} />
      <div className="max-w-4xl m-auto p-4 py-8">
        {loading && (
          <div className="h-full w-full fixed top-0 right-0 bg-black bg-opacity-70 z-50">
            <div className="flex flex-col justify-center items-center h-screen">
              <MoonLoader color={'#00BBDB'} loading={loading} size={50} />
              <h4 className="text-white">Please wait..</h4>
            </div>
          </div>
        )}
        {router.query.submissionType === 'valentine' ? (
          <div className="border-4 border-dotted border-[#F5A1DB] mb-9 p-4 rounded-md md:mx-36 relative">
            <h1 className="text-center font-bold text-3xl mb-2">
              {router.query.submissionType === 'valentine'
                ? dataSubmission[1].title
                : dataSubmission[0].title}
            </h1>
            <p className="text-primary text-sm text-center whitespace-pre-line">
              {dataSubmission[1].description}
            </p>
          </div>
        ) : (
          <div>
            <h1 className="text-center font-bold text-3xl mb-2">
              {router.query.title}
            </h1>
            <p className="text-primary text-sm text-center mb-9">
              {dataSubmission[0].description}
            </p>
          </div>
        )}
        <div className="max-w-3xl m-auto p-4 py-8">
          <div className="mb-4">
            <h4>
              Read Submission Guideline{' '}
              <a
                href={
                  router.query.submissionType === 'valentine'
                    ? dataSubmission[1].openLink
                    : dataSubmission[0].openLink
                }
                target="_blank"
                rel="noreferrer"
                className="text-primary border-b-2 border-transparent active:border-primary"
              >
                here
              </a>
            </h4>
          </div>
          <FormProvider {...methods}>
            <form
              id="form-submission"
              onSubmit={handleSubmit(onSubmit)}
              method="post"
            >
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
                        onChange: inputFilecover,
                      })}
                      className="cursor-pointer w-full opacity-0 absolute inset-0 z-20"
                    />
                    <div
                      className={`${
                        !cover && !coverPreview ? 'w-40 h-40 ' : 'w-full h-full'
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
                    errorMessage ||
                    isOverDimensions) && (
                    <span
                      className={`${
                        !coverPreview || errorMessage || isOverDimensions
                          ? 'text-red-500'
                          : 'hidden'
                      }`}
                    >
                      {errorMessage
                        ? 'Image must be less than 10mb'
                        : isOverDimensions
                        ? 'The dimensions of the comic cover must be 640 x 890'
                        : 'This field is required'}
                    </span>
                  )}
                  <div>
                    <p className="text-comic-gray-tertiary text-sm font-normal mt-4 mb-8">
                      Image size must be 640 x 890, <br /> Image must be less
                      than 10mb
                    </p>
                  </div>
                </div>
              </div>
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
              <div className="md:flex justify-start gap-2 md:gap-20">
                <InputDropdown
                  title="Genre"
                  ref={genreModalRef}
                  data={genreList}
                  register={register}
                  label="genre"
                  selectItem={setGenreSelect}
                  submit={isSubmit}
                />
                <InputDropdown
                  title="Sub Genre"
                  ref={subGenreModalRef}
                  data={subGenreList}
                  register={register}
                  label="subgenre"
                  selectItem={setSubGenreSelect}
                  submit={isSubmit}
                />
              </div>
              <div className="mt-8 mb-2">
                <label className="font-bold text-md">Synopsis</label>
                <InputTextarea
                  label="synopsis"
                  register={register}
                  required
                  className="resize-none h-40 mt-3"
                  type="text"
                  placeholder="Synopsis of your comic"
                />
                {formState.errors.synopsis && (
                  <span className="text-red-500">This field is required</span>
                )}
              </div>
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
              <div className="relative">
                <div className="flex justify-between items-center mb-1">
                  <div className="flex gap-4 mt-8 mb-2">
                    <label className="font-bold text-md">Upload File</label>
                    <h4>
                      {' '}
                      <span
                        className={
                          items.length > 100 ? 'text-red-500' : 'text-primary'
                        }
                      >
                        {items.length}
                      </span>{' '}
                      / 100
                    </h4>
                  </div>
                  <div>
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
                      <p className="text-primary font-bold text-sm mt-8 mb-2 cursor-pointer">
                        + Add File
                      </p>
                    </label>
                  </div>
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
              {formState.errors.pages && (
                <span
                  className={items.length !== 0 ? 'hidden ' : 'text-red-500'}
                >
                  This field is required
                </span>
              )}
              <p className="text-sm text-gray-500 text-justify mt-16 mb-6 md:w-3/4">
                *Submission results will be sent by Paras Editor Team within 14
                working days after the submission is received.
              </p>
              <input
                type="submit"
                value="Submit"
                className="flex py-3 px-12 md:px-14 mt-4 text-sm text-white bg-primary font-thin rounded-full hover:opacity-80 cursor-pointer"
              />
            </form>
          </FormProvider>
        </div>
      </div>
    </Layout>
  )
}

export default FormSubmission
