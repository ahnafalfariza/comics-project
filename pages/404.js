import Head from 'components/Common/Head'
import Link from 'next/link'

const Custom404 = () => {
  return (
    <div className="h-screen bg-white">
      <Head title="Page Not Found" />
      <div className="h-full w-full max-w-6xl m-auto relative">
        <div className="h-full w-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-40 m-auto mt-8">
              <img src="/carddrop.png" className="opacity-75" />
            </div>
            <div className="mt-8">
              <div className="px-4">
                <h1 className="text-primary mt-4 text-6xl">404</h1>
                <h4 className="text-lg text-gray-500">Page Not Found</h4>
                <div className="mt-16">
                  <Link href="/">
                    <a className="flex items-center text-gray-500">
                      <svg
                        className="pr-2"
                        width="24"
                        height="24"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          className="fill-current"
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M5.41412 7.00001H13.9999V9.00001H5.41412L8.70701 12.2929L7.2928 13.7071L1.58569 8.00001L7.2928 2.29291L8.70701 3.70712L5.41412 7.00001Z"
                        />
                      </svg>
                      Back to Home
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Custom404
