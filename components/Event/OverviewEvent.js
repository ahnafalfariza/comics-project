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
          Faq
        </p>
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
