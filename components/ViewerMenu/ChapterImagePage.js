import axios from 'axios'
import { sentryCaptureException } from 'lib/sentry'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { BounceLoader } from 'react-spinners'

const ChapterImagePage = ({ url }) => {
  const [imageCh, setImageCh] = useState('')
  const [unauthorized, setUnauthorized] = useState(null)
  const [isLandscape, setIsLandscape] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const controller = new AbortController()

    const fetchImage = async () => {
      try {
        const img = new Image()
        const response = await axios.get(url + '?web_only=true', {
          responseType: 'blob',
          signal: controller.signal,
        })
        const objectUrl = URL.createObjectURL(response.data)
        img.src = [objectUrl]
        img.onload = () => {
          setImageCh([objectUrl])
          setIsLandscape(img.width > img.height)
        }
      } catch (error) {
        setUnauthorized(true)
        sentryCaptureException(error)
      }
    }

    const handleRouteChange = () => {
      controller.abort()
    }

    router.events.on('routeChangeStart', handleRouteChange)
    fetchImage()

    return () => {
      router.events.off('routeChangeStart', handleRouteChange)
    }
    // eslint-disable-next-line
  }, [url])

  if (unauthorized) return null

  return imageCh !== '' ? (
    <div
      className={isLandscape ? 'max-w-6xl m-auto' : 'max-w-4xl m-auto relative'}
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
