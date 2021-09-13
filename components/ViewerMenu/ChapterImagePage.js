import axios from 'axios'
import { useEffect, useState } from 'react'
import { BounceLoader } from 'react-spinners'

const ChapterImagePage = ({ url }) => {
  const [imageCh, setImageCh] = useState('')
  const [unauthorized, setUnauthorized] = useState(null)

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get(url, {
          responseType: 'blob',
        })
        const objectUrl = URL.createObjectURL(response.data)
        setImageCh([objectUrl])
      } catch (error) {
        setUnauthorized(true)
      }
    }
    fetchImage()
  }, [url])

  if (unauthorized) return null

  return imageCh !== '' ? (
    <div className="">
      <img src={imageCh} />
      <div className="absolute inset-0 bg-transparent z-0" />
    </div>
  ) : (
    <div className="h-96 flex justify-center items-center gray">
      <BounceLoader loading={true} color={'rgb(107, 114, 128)'} size={24} />
    </div>
  )
}

export default ChapterImagePage
