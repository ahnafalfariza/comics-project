import React, { useEffect, useRef, useState } from 'react'

const InputDropdown = ({ title, label, ref, data, selectItem, submit }) => {
  const genreModalRef = useRef()
  const subGenreModalRef = useRef()
  const [modal, setModal] = useState(false)
  const [select, setSelect] = useState('')

  useEffect(() => {
    let dataItem = []
    data.map((item) => {
      dataItem.push(item[label])
    })
    const initial = dataItem.filter((item) => item === dataItem[0])
    setSelect(initial.toString())
  }, [label, data, submit])

  useEffect(() => {
    const onClickEv = (e) => {
      if (
        (genreModalRef && !genreModalRef?.current?.contains(e.target)) ||
        (subGenreModalRef && !subGenreModalRef?.current?.contains(e.target))
      ) {
        setModal(false)
      } else {
        setModal(false)
      }
    }
    if (modal) document.body.addEventListener('click', onClickEv)

    return () => document.body.removeEventListener('click', onClickEv)
  }, [modal])

  return (
    <div className="mt-8 mb-2">
      <label className="font-bold text-md capitalize">{title}</label>
      <div>
        <div
          className="flex justify-between items-center relative w-full md:w-64 mt-3 px-3 py-2 rounded-lg bg-comic-gray-secondary cursor-pointer input-text"
          onClick={() => setModal(true)}
          ref={ref}
        >
          <p className="truncate">{select}</p>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            ></path>
          </svg>
        </div>
      </div>
      {modal && (
        <div className="justify-between items-center w-80 md:w-64 py-2 mt-2 bg-white shadow-lg rounded-lg absolute z-20 max-h-60 overflow-y-scroll">
          <div>
            <ul className="text-black w-full">
              {data.map((item, index) => {
                return (
                  <li
                    key={index}
                    className={`${
                      item[label] === select
                        ? 'text-white bg-primary hover:bg-primary'
                        : 'hover:bg-opacity-5 hover:bg-black'
                    } px-3 py-2 cursor-pointer`}
                    onClick={() => {
                      setSelect(item[label])
                      selectItem(item[label])
                    }}
                  >
                    {item[label]}
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}

export default InputDropdown
