import axios from 'axios'
import { useEffect, useState } from 'react'
import { BounceLoader } from 'react-spinners'

const ChapterImagePage = ({ url }) => {
  const [imageCh, setImageCh] = useState('')
  const [unauthorized, setUnauthorized] = useState(null)
  const [isLandscape, setIsLandscape] = useState(false)

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const img = new Image()
        const response = await axios.get(url, {
          responseType: 'blob',
        })
        const objectUrl = URL.createObjectURL(response.data)
        img.src = [objectUrl]
        img.onload = () => {
          setImageCh([objectUrl])
          setIsLandscape(img.width > img.height)
        }
      } catch (error) {
        setUnauthorized(true)
      }
    }
    fetchImage()
  }, [url])

  if (unauthorized) return null

  return imageCh !== '' ? (
    <div
      className={isLandscape ? 'max-w-5xl m-auto' : 'max-w-6xl m-auto relative'}
    >
      <img src={imageCh} className="m-auto" />
      <div className="absolute inset-0 bg-transparent z-0" />
    </div>
  ) : (
    <div className="h-96 flex justify-center items-center gray">
      <BounceLoader loading={true} color={'rgb(107, 114, 128)'} size={24} />
    </div>
  )
}

export default ChapterImagePage
