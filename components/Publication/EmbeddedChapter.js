import { Fragment, useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'

import { parseImgUrl, prettyBalance } from 'utils/common'
import { useRouter } from 'next/router'
import { parseDate } from 'utils/dateHelper'
import BuyChapterModal from 'components/Modal/BuyChapterModal'

const EmbeddedChapter = ({ tokenId }) => {
  const router = useRouter()
  const [token, setToken] = useState(null)
  const [chapterOpen, setChapterOpen] = useState(null)
  const price = token && (token.lowest_price || token.price)

  useEffect(() => {
    fetchToken()
  }, [])

  const fetchToken = async () => {
    const [contractTokenId, token_id] = tokenId.split('/')
    const [contractId, tokenSeriesId] = contractTokenId.split('::')

    const url = process.env.COMIC_API_URL
    const res = await axios({
      url: url + (token_id ? `/tokens` : `/token-series`),
      method: 'GET',
      params: token_id
        ? {
            token_id: token_id,
            contract_id: contractId,
          }
        : {
            contract_id: contractId,
            token_series_id: tokenSeriesId,
          },
    })

    const _token = (await res.data.data.results[0]) || null
    setToken(_token)
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
          chapterId: data.metadata?.chapter_id,
          comicId: data.metadata?.comic_id,
        },
      },
      '',
      {
        scroll: false,
        shalllow: true,
      }
    )
  }

  if (!token) return null

  return (
    <Fragment>
      <h4 className="text-center uppercase">Chapter 1</h4>
      <Link
        href={`/token/${token.contract_id}::${token.token_series_id}/${
          token.token_id || ''
        }`}
      >
        <a
          onClick={(e) => {
            e.preventDefault()
          }}
        >
          <div className="w-full m-auto">
            <div
              className="mx-auto w-48 h-64 lg:w-48 lg:h-64 flex-none rounded-2xl bg-no-repeat bg-center bg-cover shadow-xl"
              style={{
                backgroundImage: `url(${parseImgUrl(
                  token.metadata.media,
                  null,
                  { width: `600` }
                )})`,
              }}
              onClick={() => onClickChapter(token)}
            />
          </div>
        </a>
      </Link>
      <div>
        <div className="w-48 mx-auto">
          <div className="p-2 pb-4">
            <p className="text-black text-sm font-bold mb-2">
              {token.metadata.title}
            </p>
            <div className="flex justify-between">
              <div className="text-xs">
                {parseDate('2021-11-12T08:14:59.915Z')}
              </div>
              <div className="text-primary font-bold -mt-1 mr-1">
                {price ? (
                  <div>
                    <div>{prettyBalance(price, 24, 4)} Ⓝ</div>
                  </div>
                ) : (
                  <div className="line-through text-red-600">
                    <span className="text-black">SALE</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <BuyChapterModal
        active={true}
        data={chapterOpen}
        onClose={onCloseChapterDetail}
        isPreview
      />
    </Fragment>
  )
}

export default EmbeddedChapter
