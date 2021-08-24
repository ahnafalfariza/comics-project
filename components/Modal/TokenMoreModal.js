import { useState } from 'react'
import ListModal from './ListModal'

const TokenMoreModal = ({ show, onClose, onClickShare, onClickUpdate }) => {
  const [copyLink, setCopyLink] = useState(false)

  const onClickCopy = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopyLink(true)
    setTimeout(() => {
      setCopyLink(false)
    }, 3000)
  }

  const listModalItem = [
    { name: copyLink ? 'Copied' : 'Copy Link', onClick: onClickCopy },
    { name: 'Share to...', onClick: onClickShare },
    // { name: 'Update Listing', onClick: onClickUpdate },
    // { name: 'Transfer Card', onClick: () => {} },
    // { name: 'Burn Card', onClick: () => {} },
  ]

  return <ListModal list={listModalItem} show={show} onClose={onClose} />
}

export default TokenMoreModal
