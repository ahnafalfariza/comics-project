import Modal from 'components/Common/Modal'
import { IconArrow } from 'components/Icons'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import CardDetail from './TokenDetail'

const TokenDetailModal = ({ tokens = [] }) => {
  const router = useRouter()

  const [activeToken, setActiveToken] = useState(null)

  const closeTokenDetail = () => {
    const prevUrl = window.sessionStorage.getItem('prevPath')
    if (prevUrl && prevUrl[0] === '/') {
      router.push(prevUrl, prevUrl, { shallow: true })
    } else {
      router.back()
    }
  }

  useEffect(() => {
    if (router.query.tokenId) {
      const token = tokens.find(
        (token) => token?.tokenId === router.query.tokenId
      )
      setActiveToken(token)
    } else {
      setActiveToken(tokens[0])
      // setActiveToken(null)
    }
  }, [router.query, tokens])

  if (!activeToken) return null

  return (
    <Modal close={() => closeTokenDetail(null)}>
      <div className="max-w-5xl m-auto w-full relative">
        <div className="absolute top-0 left-0 p-4 z-50">
          <div
            className="cursor-pointer flex items-center select-none"
            onClick={() => closeTokenDetail(null)}
          >
            <IconArrow size={16} transform="scale(-1,1)" />
            <p className="pl-2 text-gray-100 cursor-pointer">Back</p>
          </div>
        </div>
        <CardDetail localToken={activeToken} />
      </div>
    </Modal>
  )
}

export default TokenDetailModal
