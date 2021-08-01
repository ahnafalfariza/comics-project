import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import near from '../lib/near'
import Loading from 'components/common/Loading'

import * as gtag from '../lib/gtag'

import '../styles/globals.css'
import 'tailwindcss/tailwind.css'

const App = ({ Component, pageProps }) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  useEffect(() => {
    const init = async () => {
      setIsLoading(true)
      await near.init()
      setIsLoading(false)
    }
    init()
  }, [])

  if (isLoading) {
    return (
      <Loading className="w-screen h-screen m-auto flex justify-center items-center" />
    )
  }

  return <Component {...pageProps} />
}

export default App
