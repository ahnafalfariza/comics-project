import { InputText, InputTextarea } from 'components/Common/form'
import Layout from 'components/Common/Layout'
import useStore from 'lib/store'
import React, { useEffect, useRef, useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { FormProvider, useForm } from 'react-hook-form'
import { readFileAsUrl } from 'utils/common'

const Submission = () => {
  const [coverComic, setCoverComic] = useState('')
  const [coverComicPreview, setCoverComicPreview] = useState('')
  const [items, setItems] = useState([])
  const [modalGenre, setModalGenre] = useState(false)
  const methods = useForm()
  const genreList = ['Romance', 'Superhero', 'Horror', 'Non-Fiction']
  const [errorMessage, setErrorMessage] = useState(false)
  const genreModalRef = useRef()
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

  useEffect(() => {
    const onClickEv = (e) => {
      if (genreModalRef && !genreModalRef?.current?.contains(e.target))
        setModalGenre(false)
      else setModalGenre(false)
    }
    if (modalGenre) document.body.addEventListener('click', onClickEv)

    return () => document.body.removeEventListener('click', onClickEv)
  }, [modalGenre])

  const onSubmit = (data) => {
    data.comicContent = items

    Promise.resolve('Success')
      .then(() => {
        console.log('data submission: ', data)
        _showToast('success', "Thank you for your interest, We'll be in touch!")
      })
      .catch(_showToast('error', 'Something wrong happened, please try again!'))
  }

  const addImages = async (e) => {
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
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'grey',

    width: 400,
    right: 340,
    left: 0,

    // styles we need to apply on draggables
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
    // dropped outside the list
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
    items.forEach((item, index) => {
      if (item.id == _item.id) {
        delete items[index]
      }
    })
    let filteredList = items.filter((item) => item)
    setItems(filteredList)
  }

  const inputFileCoverComic = (event) => {
    const img = event.target.files[0]

    if (typeof img !== 'undefined') {
      let size = img.size / (1024 * 1024).toFixed(10)
      if (size < 10) {
        let binaryData = []
        binaryData.push(img)
        setCoverComicPreview(
          window.URL.createObjectURL(new Blob(binaryData, { type: 'image/*' }))
        )
        setErrorMessage(false)
        return setCoverComic(img)
      } else {
        setErrorMessage(true)
      }
    }
  }

  return (
    <Layout>
      <div className="max-w-6xl m-auto p-4 py-8">
        <h1 className="text-center font-bold text-3xl mb-9">Submission</h1>
        <div className="max-w-3xl m-auto p-4 py-8">
          <FormProvider {...methods}>
            {/* <form action="https://formspree.io/f/myyokkgo" method="post"> */}
            <form
              id="form-submission"
              onSubmit={methods.handleSubmit(onSubmit)}
              method="post"
            >
              <div className="md:flex justify-between">
                <div>
                  <label className="font-bold text-md">Cover Comic</label>
                  <div
                    className={`relative cursor-pointer ${
                      coverComicPreview === '' ? 'w-40 h-40 ' : 'w-60 h-80'
                    } overflow-hidden rounded-md mt-2 hover:opacity-80`}
                  >
                    <input
                      {...methods.register('coverComic', { required: true })}
                      className="cursor-pointer w-full opacity-0 absolute inset-0 z-20"
                      onChange={(event) => inputFileCoverComic(event)}
                      type="file"
                      accept="image/*"
                    />
                    <div
                      className={`${
                        coverComicPreview === ''
                          ? 'w-40 h-40 '
                          : 'w-full h-full'
                      } overflow-hidden bg-comic-gray-secondary shadow-inner relative input-text`}
                    >
                      <img
                        src={
                          coverComicPreview === '' || coverComic === undefined
                            ? null
                            : coverComicPreview
                        }
                        className="w-full h-full object-cover cover-comic"
                        style={{ textIndent: '-10000px' }}
                      />
                      {coverComicPreview === '' || coverComic === undefined ? (
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
                      ) : (
                        ''
                      )}
                    </div>
                  </div>
                  {methods.formState.errors.coverComic && (
                    <span
                      className={`${coverComic ? 'hidden ' : 'text-red-500'}`}
                    >
                      This field is required
                    </span>
                  )}
                  {errorMessage && (
                    <span
                      className={`${
                        !errorMessage ? 'hidden ' : 'text-red-500'
                      }`}
                    >
                      Image must be less than 10mb
                    </span>
                  )}
                  <div>
                    <p className="text-comic-gray-tertiary text-sm font-normal mt-4 mb-8">
                      Image size must be 1000x1000, <br /> Image must be less
                      than 10mb
                    </p>
                  </div>
                </div>
              </div>
              <div className="md:flex justify-between gap-8">
                <div className="mt-8 mb-2">
                  <label className="font-bold text-md">Comic Title</label>
                  <InputText
                    type="text"
                    placeholder="Paradigm"
                    className="mt-3 mr-64"
                    {...methods.register('comicTitle', { required: true })}
                  />
                  {methods.formState.errors.comicTitle && (
                    <span className="text-red-500">This field is required</span>
                  )}
                </div>
                <div className="mt-8 mb-2">
                  <label className="font-bold text-md">Genre</label>
                  <div>
                    <select
                      className="flex justify-between items-center relative w-full md:w-64 mt-3 px-2 py-2 rounded-lg bg-comic-gray-secondary cursor-pointer input-text"
                      {...methods.register('genreComic', {
                        required: true,
                      })}
                    >
                      {genreList.map((item, index) => {
                        return (
                          <option
                            key={index}
                            className="bg-blue-600"
                            value={item}
                          >
                            {item}
                          </option>
                        )
                      })}
                    </select>
                  </div>
                </div>
              </div>
              <div className="mt-8 mb-2">
                <label className="font-bold text-md">Premise</label>
                <InputTextarea
                  className="resize-none h-40 mt-3"
                  type="text"
                  placeholder="Synoosis of your comic"
                  {...methods.register('premise', { required: true })}
                />
                {methods.formState.errors.premise && (
                  <span className="text-red-500">This field is required</span>
                )}
              </div>
              <div className="mt-8 mb-2">
                <label className="font-bold text-md">Email</label>
                <InputText
                  className="mt-3"
                  type="email"
                  placeholder="paradigm@paras.id"
                  width="80"
                  {...methods.register('email', { required: true })}
                />
                {methods.formState.errors.email && (
                  <span className="text-red-500">This field is required</span>
                )}
              </div>
              <div>
                <div className="flex justify-between items-center mb-1">
                  <div className="mt-8 mb-2">
                    <label className="font-bold text-md">Upload File</label>
                  </div>
                  <div>
                    <label>
                      <input
                        multiple
                        type="file"
                        {...methods.register('comicContent', {
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
                                    d="M6 18L18 6M6 6l12 12"
                                  ></path>
                                </svg>
                                {/* <svg
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
                                </svg> */}
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
                {methods.formState.errors.comicContent && (
                  <span
                    className={`${
                      items.length !== 0 ? 'hidden ' : 'text-red-500'
                    }`}
                  >
                    This field is required
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-500 text-justify mt-16 mb-6 md:w-3/4">
                *Submission results will be sent by Paras Editor Team within 14
                working days after the submission is received.
              </p>
              <input
                type="submit"
                value="Submit"
                className="py-3 px-12 md:px-14 mt-4 text-sm text-white bg-primary font-thin rounded-full hover:opacity-80 cursor-pointer"
                onClick={() => window.scrollTo(0, 0)}
              />
            </form>
          </FormProvider>
        </div>
      </div>
    </Layout>
  )
}

export default Submission
