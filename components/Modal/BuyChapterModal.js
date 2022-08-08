import { useRouter } from 'next/router'
import { useState } from 'react'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import { BounceLoader } from 'react-spinners'

import near from 'lib/near'
import useStore from 'lib/store'

import Button from 'components/Common/Button'
import Modal from 'components/Common/Modal'
import ShareComponent from 'components/Common/ShareComponent'
import { IconXCircle } from 'components/Icons'
import { parseImgUrl } from 'utils/common'
import LoginModal from 'components/Modal/LoginModal'
import Link from 'next/link'
import ExplicitContentModal from './ExplicitContentModal'

const BuyChapterModal = ({
  data = {
    token_id: 'naruto-9:1',
    comic_id: 'naruto',
    chapter_id: 9,
    edition_id: 1,
    metadata: {
      title: 'Naruto Ch.9 : Beginning of the End #1',
      description: 'welcome to the world of naruto!',
      media: 'bafybeiahl55gjwifng26oya77sw5nvtiqevc5jcxai3u7atupyiyyry2ji',
      media_hash: null,
      copies: null,
      issued_at: '2021-08-21T07:56:50.893Z',
      expires_at: null,
      starts_at: null,
      updated_at: null,
      extra: null,
      reference: 'bafybeihmcchkcrpj5eqk5no4thhrhhwpw373idpxdrwp3qbabdl54d6v4a',
      reference_hash: null,
      blurhash: 'U36t:x-50JOY~V-;E1NG4,N{sHs9J:9FV@%L',
      author_ids: ['rng.testnet'],
      page_count: 1,
      collection: 'naruto',
      subtitle: 'Beginning of the End',
    },
    owner_id: 'rng.testnet',
  },
  active,
  onClose,
  isLoading,
  tokenId,
  hideCloseButton,
  hideActionButton,
  isPreview,
}) => {
  const router = useRouter()
  const buyChapter = useStore((state) => state.buyChapter)
  const [showLogin, setShowLogin] = useState(false)
  const [showExpWarning, setShowExpWarning] = useState(false)

  const onClickPreview = () => {
    router.push({
      pathname: `/preview/${router.query.id}/${router.query.chapterId}`,
    })
  }

  const onClickReadNow = () => {
    router.push({
      pathname: `/viewer/${data.metadata.comic_id}/${data.metadata.chapter_id}`,
    })
  }

  const onBuyChapter = () => {
    if (!near.currentUser) {
      setShowLogin(true)
      return
    }
    buyChapter(data.token_series_id, data.price)
  }

  if (!data) return null

  const tokenCta = tokenId
    ? {
        link: `/token/${data.token_series_id}/${tokenId}`,
        text: `See Token Edition`,
      }
    : {
        link: `/token/${data.token_series_id}`,
        text: `See Token Details`,
      }

  return (
    <>
      <Modal closeOnBgClick closeOnEscape isShow={active} close={onClose}>
        <div className="relative max-w-2xl w-full my-auto mx-4 md:mx-auto">
          <div className="w-full md:flex bg-white rounded-lg overflow-hidden">
            {isLoading ? (
              <div className="mx-auto w-full h-96 flex items-center justify-center">
                <BounceLoader
                  loading={true}
                  color={'rgb(107, 114, 128)'}
                  size={24}
                />
              </div>
            ) : (
              <>
                <div
                  className="md:block md:w-64 h-80 md:h-auto overflow-hidden flex-shrink-0"
                  style={{
                    backgroundImage: `url(${parseImgUrl(data.metadata.media)})`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="w-full h-full bg-gradient-to-t from-white to-transparent md:bg-none flex items-end">
                    {!isPreview && data.preview_limit && (
                      <div
                        className="absolute md:relative right-0 m-4 px-3 py-1 text-sm rounded-full text-black bg-white cursor-pointer hover:bg-opacity-95"
                        onClick={onClickPreview}
                      >
                        Preview
                      </div>
                    )}
                  </div>
                </div>
                <div className="-mt-16 md:mt-0 w-full relative p-4 md:p-6 flex flex-col justify-between md:h-96 overflow-y-auto">
                  <div className="w-full">
                    <p className="text-black text-lg">
                      Chapter {parseInt(data.metadata.chapter_id)}
                    </p>
                    <p className="text-2xl text-black">
                      {data.metadata.subtitle}
                    </p>
                    {data.is_explicit && (
                      <p className="absolute right-0 top-0 p-4 text-xs text-red-500 mt-2">
                        Explicit Content
                      </p>
                    )}
                    <p className="text-black mt-4 text-sm mb-6">
                      {data.metadata.description}
                    </p>
                  </div>
                  <div>
                    {!hideActionButton && (
                      <>
                        {data.status === 'read' ? (
                          <div>
                            <Button
                              size="md"
                              isFullWidth
                              onClick={() =>
                                data.is_explicit
                                  ? setShowExpWarning(true)
                                  : onClickReadNow()
                              }
                            >
                              Read Now
                            </Button>
                          </div>
                        ) : (
                          <div>
                            <p className="text-black text-xs mb-2 text-center">
                              Small transaction fee is applied of 0.01832 Ⓝ
                            </p>
                            <Button
                              size="md"
                              isFullWidth
                              onClick={onBuyChapter}
                              isDisabled={!data.price}
                            >
                              {data.price
                                ? data.price === '0'
                                  ? 'Free'
                                  : `Buy for ${formatNearAmount(data.price)} Ⓝ`
                                : data.is_non_mintable
                                ? 'Sold Out'
                                : 'Coming Soon'}
                            </Button>
                          </div>
                        )}
                        {data.is_locked !== undefined && data.is_locked && (
                          <div className="mt-2">
                            <div className="mt-2 w-full text-center">
                              <Link href={tokenCta.link}>
                                <a className="font-semibold text-black text-sm">
                                  {tokenCta.text}
                                </a>
                              </Link>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                    <div className="flex flex-wrap items-center justify-between -mb-2 md:-mb-4">
                      <div className="mt-4 w-full">
                        <ShareComponent
                          title="Read this comic"
                          shareUrl={window.location.href}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          <div
            className="absolute z-10 top-0 right-0 cursor-pointer"
            onClick={onClose}
          >
            <div className="-mt-4 -mr-4">
              {!hideCloseButton && <IconXCircle size={40} />}
            </div>
          </div>
        </div>
      </Modal>
      <ExplicitContentModal
        onClickYes={onClickReadNow}
        onClose={() => setShowExpWarning(false)}
        show={showExpWarning}
      />
      <LoginModal onClose={() => setShowLogin(false)} show={showLogin} />
    </>
  )
}

export default BuyChapterModal
