import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import near from '../lib/near'

import * as gtag from '../lib/gtag'

import 'tailwindcss/tailwind.css'
import '../styles/globals.css'

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
    return null
  }

  return <Component {...pageProps} />
}

export default App
