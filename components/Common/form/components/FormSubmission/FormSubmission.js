import axios from 'axios'
import { InputText, InputTextarea } from 'components/Common/form'
import useStore from 'lib/store'
import React, { useCallback, useEffect, useRef, useState } from 'react'
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

const ArtistSubmission = ({ title }) => {
  const [cover, setCover] = useState('')
  const [coverPreview, setCoverPreview] = useState('')
  const [items, setItems] = useState([])
  const [isOverDimensions, setIsOverDimensions] = useState(false)
  const [sizeComic, setSizeComic] = useState(0)
  const [modalGenre, setModalGenre] = useState(false)
  const methods = useForm()
  const { register, handleSubmit, formState, setValue, reset, clearErrors } =
    methods
  const [genreList, setGenreList] = useState([])
  const [subGenreList, setSubGenreList] = useState([])
  const [errorMessage, setErrorMessage] = useState(false)
  const genreModalRef = useRef()
  const [loading, setLoading] = useState(false)
  const setToastConfig = useStore((state) => state.setToastConfig)

  const _showToast = (type, msg) => {
    setToastConfig({
      text: (
        <div className="text-sm font-semibold text-gray-900 text-center">
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
  }, [])

  const getSubGenreList = useCallback(async () => {
    const data = await getSubGenres()
    setSubGenreList(data)
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

  useEffect(() => {
    const onClickEv = (e) => {
      if (genreModalRef && !genreModalRef?.current?.contains(e.target))
        setModalGenre(false)
      else setModalGenre(false)
    }
    if (modalGenre) document.body.addEventListener('click', onClickEv)

    return () => document.body.removeEventListener('click', onClickEv)
  }, [modalGenre])

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
    const errorDimensions = 'The maximum dimensions of cover comic is 640 x 890'

    if (checkNumberOfFile || checkSizeofFile || isOverDimensions) {
      window.scrollTo(0, 0)
      _showToast(
        'error',
        checkNumberOfFile
          ? errorCheckNumberOfFile
          : checkSizeofFile
          ? errorCheckSizeOfFile
          : errorDimensions
      )
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
      form.append('submission', title)
      form.append('cover', data.cover)
      form.append('title', data.title)
      form.append('genre', data.genre)
      form.append('subgenre', data.subgenre)
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

  const grid = 8

  const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: 'none',
    background: isDragging ? 'lightgreen' : 'grey',
    width: window.innerWidth > 768 ? 400 : 290,
    right: 340,
    left: 0,
    ...draggableStyle,
  })

  const getListStyle = (isDraggingOver) => ({
    background: isDraggingOver ? 'rgb (30, 41, 59)' : '#F4F4F5',
    border: '1px solid rgba(145, 145, 145, 0.7)',
    padding: grid,
    width: '100%',
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
    let img = event.target.files[0]
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
        setErrorMessage(false)
      } else {
        setErrorMessage(true)
      }
    }

    const fileReader = new FileReader()
    fileReader.onload = () => {
      const img = new Image()

      img.onload = () => {
        if (img.width > 640 || img.height > 890) {
          checkDimensions = true
          setIsOverDimensions(checkDimensions)
        } else {
          checkDimensions = false
          setIsOverDimensions(checkDimensions)
        }
      }

      img.src = fileReader.result
    }
    if (typeof img !== 'undefined') fileReader.readAsDataURL(img)
  }

  return (
    <div className="max-w-4xl m-auto p-4 py-8">
      {loading && (
        <div className="h-full w-full fixed top-0 right-0 bg-black bg-opacity-70 z-50">
          <div className="flex flex-col justify-center items-center h-screen">
            <MoonLoader color={'#00BBDB'} loading={loading} size={50} />
            <h4 className="text-white">Please wait..</h4>
          </div>
        </div>
      )}
      <h1 className="text-center font-bold text-3xl mb-9">{title}</h1>
      <div className="max-w-3xl m-auto p-4 py-8">
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
                {(formState.errors.cover || errorMessage) && (
                  <span
                    className={`${
                      !coverPreview || errorMessage ? 'text-red-500' : 'hidden'
                    }`}
                  >
                    {errorMessage
                      ? 'Image must be less than 10mb'
                      : 'This field is required'}
                  </span>
                )}
                <div>
                  <p className="text-comic-gray-tertiary text-sm font-normal mt-4 mb-8">
                    Image size must be 640 x 890, <br /> Image must be less than
                    10mb
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
            <div className="flex justify-start gap-2 md:gap-20">
              <div className="mt-8 mb-2">
                <label className="font-bold text-md">Genre</label>
                <div>
                  <select
                    className="flex justify-between items-center w-32 relative md:w-64 mt-3 px-2 py-2 rounded-lg bg-comic-gray-secondary cursor-pointer input-text"
                    {...register('genre')}
                  >
                    {genreList.map((item, index) => {
                      return (
                        <option
                          key={index}
                          className="bg-blue-600"
                          value={item.genre}
                        >
                          {item.genre}
                        </option>
                      )
                    })}
                  </select>
                </div>
              </div>
              <div className="mt-8 mb-2">
                <label className="font-bold text-md">Sub-Genre</label>
                <div>
                  <select
                    className="flex justify-between items-center relative w-full md:w-64 mt-3 px-2 py-2 rounded-lg bg-comic-gray-secondary cursor-pointer input-text"
                    {...register('subgenre')}
                  >
                    {subGenreList.map((item, index) => {
                      return (
                        <option
                          key={index}
                          className="bg-blue-600"
                          value={item.subgenre}
                        >
                          {item.subgenre}
                        </option>
                      )
                    })}
                  </select>
                </div>
              </div>
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
                className="mt-3"
                type="email"
                placeholder="paradigm@paras.id"
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
                      className="rounded-md overflow-auto"
                    >
                      {items.map((item, index) => (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <div
                              className="mx-auto relative"
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
              <span className={items.length !== 0 ? 'hidden ' : 'text-red-500'}>
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
  )
}

export default ArtistSubmission
