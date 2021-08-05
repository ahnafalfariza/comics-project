import * as React from 'react'
import { parseDate } from 'utils/dateHelper'

const ChapterList = ({
  className = '',
  data = { chapter: '', cover: '', title: '', date: '', label: '' },
  rest = {},
}) => {
  const chapterImage = {
    backgroundImage: `url(${data.cover})`,
  }

  const listWrapperBaseStyle =
    'bg-blueGray-800 border border-blueGray-700  relative rounded-lg w-full cursor-pointer'
  const listCoverBaseStyle =
    'bg-no-repeat bg-center bg-cover rounded-lg absolute'
  const listBadgeBaseStyle =
    'text-sm font-semibold text-white py-1 px-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full uppercase tracking-wider leading-none'

  const listWrapperResponsiveStyle = 'flex items-center sm:py-4 sm:pr-6 py-3'
  const listCoverResponsiveStyle =
    'w-20 h-32 sm:w-28 sm:h-36 bottom-3 sm:left-3 left-2'
  const listBadgeResponsiveStyle = 'mt-3 sm:mt-0'

  const listWrapperStyle = `${listWrapperBaseStyle} ${listWrapperResponsiveStyle}`
  const listCoverStyle = `${listCoverBaseStyle} ${listCoverResponsiveStyle}`
  const listBadgeStyle = `${listBadgeBaseStyle} ${listBadgeResponsiveStyle}`

  return (
    <div className={`sm:h-40 h-36 flex mb-4 items-end ${className}`} {...rest}>
      <div className={listWrapperStyle}>
        <div className={listCoverStyle} style={chapterImage} />
        <div className="sm:ml-36 ml-24 pl-1 w-full flex flex-col sm:flex-row sm:items-center items-start justify-between">
          <div className="mr-4">
            <h5 className="sm:text-sm text-xs  text-blueGray-400 mb-1 uppercase">
              {data.chapter}
            </h5>
            <h3 className="text-white text-sm sm:text-xl">{data.title}</h3>
            <h5 className="text-blueGray-300 sm:text-sm text-xs">
              {parseDate(data.date)}
            </h5>
          </div>
          <h4 className={listBadgeStyle}>{data.label}</h4>
        </div>
      </div>
    </div>
  )
}

ChapterList.displayName = 'ChapterList'

export default ChapterList
