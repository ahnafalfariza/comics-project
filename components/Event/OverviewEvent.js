import { useState } from 'react'

const data = {
  roadmap: {
    en: 'bafybeih3dhszjjvsyq2erghlmezdq5i7jfpz2h6den55iwn4odin4mrenu',
    id: 'bafybeig2rqxazbgnvsrgexxy3bsexfjv65xp76wsw4hl4i2gvlwqrfrtvy',
  },
  guideline: {
    en: [
      'bafybeih7q4t3yn3wnoooefvho36ljsd773umyuw5ysvtagaawcvbegyn3m',
      'bafybeif2vsua4ana7eq2p2c23g3aqvo5in7wkmxkskzgkh2odvgm2biahi',
      'bafybeicqmgtzz37yfsosr6olbshtljjh5txj5bpujkgew2f6lngo5t5cg4',
      'bafybeicvm22shbfqfdlhml4nz3m6bf5cc46i3shfapsk6av7jeweuv7kme',
      'bafybeicezvktyr776k73e4p5gdgcarphp7low3qt2a7xlaeuqcjgoqswsm',
    ],
    id: [
      'bafybeihhowbpl5llans77sdecdnxoo5llco65zxqhsbagss6zbbezutofy',
      'bafybeihdhvfgz7olxn7oymsrpw3rbtdhsqnh4ppgnwvzgqfcdmdjjyclo4',
      'bafybeicc42hlu5xzzkl2zv4z64ijszxmlmsb3ya6t3kar4h6v6ddwucm6y',
      'bafybeid33axgp37d37pbz6hrs6mgjwca5ihhob2puqnxwcyyrppsoulxnq',
      'bafybeidlbi6fgw5lxfph2skducgqf57ptcuimo7yvr2hwekvmrp5gkuwfi',
    ],
  },
}

const OverviewEvent = () => {
  const [activeTab, setActiveTab] = useState('roadmap')
  const [activeLang, setActiveLang] = useState('en')

  const contentTab = () => {
    if (activeTab === 'roadmap') {
      return (
        <img src={`https://paras-cdn.imgix.net/${data.roadmap[activeLang]}`} />
      )
    } else if (activeTab === 'guideline') {
      return data.guideline[activeLang].map((item) => (
        <img key={item} src={`https://paras-cdn.imgix.net/${item}`} />
      ))
    }
  }

  return (
    <div className="max-w-3xl -mx-4 md:m-auto">
      <div className="flex justify-center items-center gap-8 p-2 bg-primary text-sm font-medium md:mb-2">
        <p
          className={`${
            activeTab === 'roadmap' ? 'text-white' : ''
          } cursor-pointer`}
          onClick={() => setActiveTab('roadmap')}
        >
          Roadmap
        </p>
        <p
          className={`${
            activeTab === 'guideline' ? 'text-white' : ''
          } cursor-pointer`}
          onClick={() => setActiveTab('guideline')}
        >
          Guideline
        </p>
        <p
          className={`${
            activeTab === 'faq' ? 'text-white' : ''
          } cursor-pointer`}
          onClick={() => setActiveTab('faq')}
        >
          FAQ
        </p>
        <div className="flex items-center ml-4">
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
              style={{ fill: '#ffffff' }}
            >
              <path d="M25.12,6.946c-2.424-1.948-6.257-2.278-6.419-2.292c-0.256-0.022-0.499,0.123-0.604,0.357 c-0.004,0.008-0.218,0.629-0.425,1.228c2.817,0.493,4.731,1.587,4.833,1.647c0.478,0.278,0.638,0.891,0.359,1.368 C22.679,9.572,22.344,9.75,22,9.75c-0.171,0-0.343-0.043-0.501-0.135C21.471,9.598,18.663,8,15.002,8 C11.34,8,8.531,9.599,8.503,9.615C8.026,9.892,7.414,9.729,7.137,9.251C6.86,8.775,7.021,8.164,7.497,7.886 c0.102-0.06,2.023-1.158,4.848-1.65c-0.218-0.606-0.438-1.217-0.442-1.225c-0.105-0.235-0.348-0.383-0.604-0.357 c-0.162,0.013-3.995,0.343-6.451,2.318C3.564,8.158,1,15.092,1,21.087c0,0.106,0.027,0.209,0.08,0.301 c1.771,3.11,6.599,3.924,7.699,3.959c0.007,0.001,0.013,0.001,0.019,0.001c0.194,0,0.377-0.093,0.492-0.25l1.19-1.612 c-2.61-0.629-3.99-1.618-4.073-1.679c-0.444-0.327-0.54-0.953-0.213-1.398c0.326-0.443,0.95-0.541,1.394-0.216 C7.625,20.217,10.172,22,15,22c4.847,0,7.387-1.79,7.412-1.808c0.444-0.322,1.07-0.225,1.395,0.221 c0.324,0.444,0.23,1.066-0.212,1.392c-0.083,0.061-1.456,1.048-4.06,1.677l1.175,1.615c0.115,0.158,0.298,0.25,0.492,0.25 c0.007,0,0.013,0,0.019-0.001c1.101-0.035,5.929-0.849,7.699-3.959c0.053-0.092,0.08-0.195,0.08-0.301 C29,15.092,26.436,8.158,25.12,6.946z M11,19c-1.105,0-2-1.119-2-2.5S9.895,14,11,14s2,1.119,2,2.5S12.105,19,11,19z M19,19 c-1.105,0-2-1.119-2-2.5s0.895-2.5,2-2.5s2,1.119,2,2.5S20.105,19,19,19z"></path>
            </svg>
          </a>
        </div>
      </div>
      <div className="mb-12 relative">
        <>{contentTab()}</>
        <div className="absolute top-0 right-0 flex items-center gap-1 font-bold text-primary p-2">
          <p
            className={`px-2 py-1 rounded-md cursor-pointer ${
              activeLang === 'en'
                ? 'bg-primary text-white'
                : 'bg-transparent text-primary'
            }`}
            onClick={() => setActiveLang('en')}
          >
            EN
          </p>
          <p>/</p>
          <p
            className={`px-2 py-1 rounded-md  cursor-pointer ${
              activeLang === 'id'
                ? 'bg-primary text-white'
                : 'bg-transparent text-primary'
            }`}
            onClick={() => setActiveLang('id')}
          >
            ID
          </p>
        </div>
      </div>
    </div>
  )
}

export default OverviewEvent
