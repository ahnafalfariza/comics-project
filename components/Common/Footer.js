import Link from 'next/link'

const Footer = () => {
  return (
    <div className="max-w-6xl w-full m-auto px-4 flex flex-row justify-center mt-20 text-sm text-black z-10 relative pb-4">
      <div className="py-2">
        <div className="flex flex-wrap justify-center -mx-2">
          <div className="flex items-center pt-2 px-4">
            <a
              href="https://twitter.com/ParasComic"
              target="_blank"
              className="flex cursor-pointer "
              rel="noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="30"
                height="30"
                viewBox="0 0 30 30"
                style={{ fill: '#00BBDB' }}
              >
                <path d="M28,6.937c-0.957,0.425-1.985,0.711-3.064,0.84c1.102-0.66,1.947-1.705,2.345-2.951c-1.03,0.611-2.172,1.055-3.388,1.295 c-0.973-1.037-2.359-1.685-3.893-1.685c-2.946,0-5.334,2.389-5.334,5.334c0,0.418,0.048,0.826,0.138,1.215 c-4.433-0.222-8.363-2.346-10.995-5.574C3.351,6.199,3.088,7.115,3.088,8.094c0,1.85,0.941,3.483,2.372,4.439 c-0.874-0.028-1.697-0.268-2.416-0.667c0,0.023,0,0.044,0,0.067c0,2.585,1.838,4.741,4.279,5.23 c-0.447,0.122-0.919,0.187-1.406,0.187c-0.343,0-0.678-0.034-1.003-0.095c0.679,2.119,2.649,3.662,4.983,3.705 c-1.825,1.431-4.125,2.284-6.625,2.284c-0.43,0-0.855-0.025-1.273-0.075c2.361,1.513,5.164,2.396,8.177,2.396 c9.812,0,15.176-8.128,15.176-15.177c0-0.231-0.005-0.461-0.015-0.69C26.38,8.945,27.285,8.006,28,6.937z"></path>
              </svg>
            </a>
          </div>
          <div className="flex items-center pt-2 px-4">
            <a
              href="https://instagram.com/paras.comic"
              target="_blank"
              className="flex cursor-pointer "
              rel="noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="30"
                height="30"
                viewBox="0 0 50 50"
                style={{ fill: '#00BBDB' }}
              >
                <path d="M 16 3 C 8.83 3 3 8.83 3 16 L 3 34 C 3 41.17 8.83 47 16 47 L 34 47 C 41.17 47 47 41.17 47 34 L 47 16 C 47 8.83 41.17 3 34 3 L 16 3 z M 37 11 C 38.1 11 39 11.9 39 13 C 39 14.1 38.1 15 37 15 C 35.9 15 35 14.1 35 13 C 35 11.9 35.9 11 37 11 z M 25 14 C 31.07 14 36 18.93 36 25 C 36 31.07 31.07 36 25 36 C 18.93 36 14 31.07 14 25 C 14 18.93 18.93 14 25 14 z M 25 16 C 20.04 16 16 20.04 16 25 C 16 29.96 20.04 34 25 34 C 29.96 34 34 29.96 34 25 C 34 20.04 29.96 16 25 16 z"></path>
              </svg>
            </a>
          </div>
          <div className="flex items-center pt-2 px-4">
            <a
              href="https://discord.gg/sHGbPBp2bB"
              target="_blank"
              className="flex cursor-pointer "
              rel="noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="30"
                height="30"
                viewBox="0 0 30 30"
                style={{ fill: '#00BBDB' }}
              >
                <path d="M25.12,6.946c-2.424-1.948-6.257-2.278-6.419-2.292c-0.256-0.022-0.499,0.123-0.604,0.357 c-0.004,0.008-0.218,0.629-0.425,1.228c2.817,0.493,4.731,1.587,4.833,1.647c0.478,0.278,0.638,0.891,0.359,1.368 C22.679,9.572,22.344,9.75,22,9.75c-0.171,0-0.343-0.043-0.501-0.135C21.471,9.598,18.663,8,15.002,8 C11.34,8,8.531,9.599,8.503,9.615C8.026,9.892,7.414,9.729,7.137,9.251C6.86,8.775,7.021,8.164,7.497,7.886 c0.102-0.06,2.023-1.158,4.848-1.65c-0.218-0.606-0.438-1.217-0.442-1.225c-0.105-0.235-0.348-0.383-0.604-0.357 c-0.162,0.013-3.995,0.343-6.451,2.318C3.564,8.158,1,15.092,1,21.087c0,0.106,0.027,0.209,0.08,0.301 c1.771,3.11,6.599,3.924,7.699,3.959c0.007,0.001,0.013,0.001,0.019,0.001c0.194,0,0.377-0.093,0.492-0.25l1.19-1.612 c-2.61-0.629-3.99-1.618-4.073-1.679c-0.444-0.327-0.54-0.953-0.213-1.398c0.326-0.443,0.95-0.541,1.394-0.216 C7.625,20.217,10.172,22,15,22c4.847,0,7.387-1.79,7.412-1.808c0.444-0.322,1.07-0.225,1.395,0.221 c0.324,0.444,0.23,1.066-0.212,1.392c-0.083,0.061-1.456,1.048-4.06,1.677l1.175,1.615c0.115,0.158,0.298,0.25,0.492,0.25 c0.007,0,0.013,0,0.019-0.001c1.101-0.035,5.929-0.849,7.699-3.959c0.053-0.092,0.08-0.195,0.08-0.301 C29,15.092,26.436,8.158,25.12,6.946z M11,19c-1.105,0-2-1.119-2-2.5S9.895,14,11,14s2,1.119,2,2.5S12.105,19,11,19z M19,19 c-1.105,0-2-1.119-2-2.5s0.895-2.5,2-2.5s2,1.119,2,2.5S20.105,19,19,19z"></path>
              </svg>
            </a>
          </div>
          <div className="flex items-center pt-2 px-4">
            <a
              href="mailto:dev@paras.id"
              target="_blank"
              className="flex cursor-pointer "
              rel="noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="30"
                viewBox="0 0 30 30"
                width="30"
                style={{ fill: '#00BBDB' }}
              >
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
            </a>
          </div>
        </div>
        <div className="flex flex-row flex-wrap justify-center mt-2 -mx-2">
          <div className="flex items-center pt-2 px-4">
            <Link href="/comics">
              <a className="flex cursor-pointer hover:text-primary">Comics</a>
            </Link>
          </div>
          <div className="flex items-center pt-2 px-4">
            <Link href="/market">
              <a className="flex cursor-pointer hover:text-primary">Market</a>
            </Link>
          </div>
          <div className="flex items-center pt-2 px-4">
            <Link href="/faq">
              <a className="flex cursor-pointer hover:text-primary">FAQ</a>
            </Link>
          </div>
        </div>
        <div className="mt-2 flex flex-row justify-center text-black text-opacity-40">
          <p>2022 Paras</p>
          <p className="mx-2">|</p>
          <Link href="/privacy">
            <a>Privacy</a>
          </Link>
          <p className="mx-2">|</p>
          <div className="flex items-center text-sm">
            <p>Powered by</p>
            <a href="https://near.org" target="_blank" rel="noreferrer">
              <svg
                className="mx-2"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0)">
                  <path
                    className="fill-current"
                    d="M19.1736 1.21319L14.2154 8.57143C13.8725 9.07253 14.5318 9.67912 15.0066 9.25714L19.8857 5.01099C20.0175 4.90549 20.2022 4.98462 20.2022 5.16923V18.4352C20.2022 18.6198 19.9648 18.6989 19.8593 18.567L5.09008 0.896703C4.61535 0.316484 3.92964 0 3.1648 0H2.63733C1.2659 0 0.131836 1.13407 0.131836 2.53187V21.2044C0.131836 22.6022 1.2659 23.7363 2.6637 23.7363C3.53403 23.7363 4.35162 23.2879 4.82634 22.5231L9.78458 15.1648C10.1274 14.6637 9.4681 14.0571 8.99337 14.4791L4.11425 18.6989C3.98239 18.8044 3.79777 18.7253 3.79777 18.5407V5.3011C3.79777 5.11648 4.03513 5.03736 4.14063 5.16923L18.9099 22.8396C19.3846 23.4198 20.0967 23.7363 20.8351 23.7363H21.3626C22.7604 23.7363 23.8945 22.6022 23.8945 21.2044V2.53187C23.8945 1.13407 22.7604 0 21.3626 0C20.4659 0 19.6483 0.448352 19.1736 1.21319V1.21319Z"
                  />
                </g>
                <defs>
                  <clipPath id="clip0">
                    <rect width="24" height="23.7363" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </a>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M13 11H22V13H13V22H11V13H2V11H11V2H13V11Z"
                fill="#cbd5e0"
              />
            </svg>
            <a href="https://ipfs.io" target="_blank" rel="noreferrer">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                className="mx-2"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1.60779 18L12 24L22.3922 18V6.00002L12 0.000488281L1.60779 6.00049V18Z"
                  fill="transparent"
                />
                <path
                  d="M10.9272 1.4458L3.39254 5.79608C3.4076 5.92988 3.4076 6.06492 3.39254 6.19871L10.9277 10.549C11.563 10.0802 12.4297 10.0802 13.0651 10.549L20.6002 6.19866C20.5852 6.06487 20.5851 5.92989 20.6002 5.7961L13.0655 1.44582C12.4301 1.91462 11.5634 1.91462 10.928 1.44582L10.9272 1.4458ZM21.3236 7.40033L13.7805 11.7991C13.8688 12.5837 13.4355 13.3343 12.7118 13.6501L12.7203 22.3023C12.8437 22.3562 12.9606 22.4237 13.0689 22.5036L20.6041 18.1534C20.5158 17.3687 20.9491 16.6181 21.6728 16.3023V7.6018C21.5494 7.54795 21.4324 7.48046 21.3241 7.40052L21.3236 7.40033ZM2.67629 7.44868C2.56796 7.52862 2.45104 7.59618 2.32764 7.65003V16.3505C3.05129 16.6663 3.48465 17.4169 3.39634 18.2015L10.931 22.5518C11.0394 22.4719 11.1564 22.4043 11.2797 22.3505V13.65C10.5561 13.3342 10.1227 12.5836 10.211 11.799L2.67636 7.4485L2.67629 7.44868Z"
                  className="fill-current"
                />
                <path
                  d="M12 24L22.3922 18V6L12 12V24Z"
                  fill="black"
                  fillOpacity="0.25098"
                />
                <path
                  d="M12.0001 24V12L1.60791 6V18L12.0001 24Z"
                  fill="black"
                  fillOpacity="0.039216"
                />
                <path
                  d="M1.60779 6L12 12L22.3922 6L12 0L1.60779 6Z"
                  fill="black"
                  fillOpacity="0.13018"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer
