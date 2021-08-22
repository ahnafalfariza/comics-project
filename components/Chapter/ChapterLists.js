import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import InfiniteScroll from 'react-infinite-scroll-component'
import axios from 'axios'

import ChapterList from 'components/Chapter/ChapterList'
import ChapterListLoader from 'components/Chapter/ChapterListLoader'
import BuyChapterModal from 'components/Modal/BuyChapterModal'

const Overview = ({ chapters, hasMore, fetchData }) => {
  const [chapterOpen, setChapterOpen] = useState(null)

  const router = useRouter()

  useEffect(() => {
    if (!router.query.chapterId) {
      setChapterOpen(null)
    } else if (router.query.chapterId && chapterOpen === null) {
      getChapter(router.query.id, router.query.chapterId)
    }
    // eslint-disable-next-line
  }, [router.query.chapterId])

  const getChapter = async (comicId, chapterId) => {
    const response = await axios.get(`${process.env.COMIC_API_URL}/chapters`, {
      params: {
        comic_id: comicId,
        chapter_id: chapterId,
      },
    })
    setChapterOpen(response.data.data.results[0] || null)
  }

  const onCloseChapterDetail = () => {
    setChapterOpen(null)
    router.replace(router.asPath.split('?')[0], '', {
      scroll: false,
      shalllow: true,
    })
  }

  const onClickChapter = (data) => {
    setChapterOpen(data)
    router.push(
      {
        query: {
          ...router.query,
          chapterId: data.chapter_id,
        },
      },
      '',
      {
        scroll: false,
        shalllow: true,
      }
    )
  }

  return (
    <div className="max-w-5xl mx-auto my-9 px-4">
      {chapters.length === 0 && !hasMore && (
        <div className="w-full">
          <div className="m-auto text-2xl text-gray-600 font-semibold py-32 text-center">
            <div className="w-40 m-auto">
              <img src="/cardstack.png" className="opacity-75" />
            </div>
            <p className="mt-4">No Chapter</p>
          </div>
        </div>
      )}
      <InfiniteScroll
        dataLength={chapters.length}
        next={fetchData}
        hasMore={hasMore}
        loader={<ChapterListLoader />}
      >
        {chapters.map((data, i) => {
          return (
            <ChapterList
              key={i}
              data={data}
              onClick={() => onClickChapter(data)}
            />
          )
        })}
      </InfiniteScroll>
      <BuyChapterModal
        active={chapterOpen !== null}
        data={chapterOpen}
        onClose={onCloseChapterDetail}
      />
    </div>
  )
}

export default Overview
