import Button from 'components/Common/Button'
import Modal from 'components/Common/Modal'
import { IconX, IconXCircle } from 'components/Icons'
import near from 'lib/near'
import useStore from 'lib/store'
import { formatNearAmount } from 'near-api-js/lib/utils/format'
import { useRouter } from 'next/router'
import { parseImgUrl } from 'utils/common'

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
  onShowLogin,
}) => {
  const router = useRouter()
  const buyChapter = useStore((state) => state.buyChapter)

  const onClickMarket = () => {
    router.push('/market')
  }

  const onClickReadNow = () => {
    router.push({
      pathname: `/viewer/${data.comic_id}`,
      query: { chapterId: data.chapter_id },
    })
  }

  const onBuyChapter = () => {
    if (!near.currentUser) {
      onShowLogin()
      return
    }
    buyChapter(data.token_type, data.price)
  }

  if (!data) return null

  return (
    <>
      <Modal closeOnBgClick closeOnEscape isShow={active} close={onClose}>
        <div className="relative m-auto">
          <div className="max-w-2xl md:flex bg-blueGray-800 rounded-lg m-4 md:m-auto overflow-hidden relative">
            <div
              className="md:block md:w-64 h-64 md:h-auto overflow-hidden"
              style={{
                backgroundImage: `url(${parseImgUrl(data.metadata.media)})`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'top',
              }}
            >
              <div className="w-full h-full bg-gradient-to-b from-transparent via-transparent to-blueGray-800 md:to-transparent" />
            </div>
            <div className="-mt-16 md:mt-0 md:w-96 w-full relative p-6 md:p-8 flex flex-col justify-between md:h-96 overflow-y-scroll">
              <div className="w-full">
                <p className="text-blueGray-400 text-lg">
                  Chapter {data.chapter_id}
                </p>
                <p className="text-2xl text-gray-50">
                  {data.metadata.subtitle}
                </p>
                <p className="text-gray-200 mt-4 text-sm mb-6">
                  {data.metadata.description}
                </p>
              </div>
              {data.status === 'read' ? (
                <Button size="md" isFullWidth onClick={onClickReadNow}>
                  Read Now
                </Button>
              ) : (
                <div>
                  <Button size="md" isFullWidth onClick={onBuyChapter}>
                    Buy for {formatNearAmount(data.price)} Ⓝ
                  </Button>
                  <p className="text-blueGray-400 text-xs my-3 text-center">
                    Looking for other?
                  </p>
                  <Button
                    size="md"
                    isFullWidth
                    variant="ghost"
                    onClick={onClickMarket}
                  >
                    Go to Marketplace
                  </Button>
                </div>
              )}
              <div
                className="absolute top-0 right-0 m-4 cursor-pointer hidden md:block"
                onClick={onClose}
              >
                <IconX size={24} />
              </div>
            </div>
          </div>
          <div
            className="absolute top-0 right-0 cursor-pointer md:hidden"
            onClick={onClose}
          >
            <IconXCircle size={32} />
          </div>
        </div>
      </Modal>
    </>
  )
}

export default BuyChapterModal
