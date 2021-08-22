import Head from 'components/Common/Head'
import { Tab, TabList, Tabs } from 'components/Common/Tabs'
import Layout from 'components/Layout'
import TokenList from 'components/Token/TokenList'
import { COMIC_COLLECTIBLES_DATA } from 'constants/dummy'
import { useState } from 'react'

const Market = () => {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <Layout>
      <Head title="Market - Comics by Paras" />
      <div className="max-w-6xl m-auto p-4 py-8">
        <p className="text-white font-bold text-4xl mb-4 ml-4 md:ml-16">
          Market
        </p>
        <Tabs
          className="md:mx-12"
          onTabsChange={(idx) => setActiveTab(idx)}
          defaultIndex={0}
        >
          <TabList>
            <Tab>Chapter</Tab>
            <Tab>Collectibles</Tab>
          </TabList>
        </Tabs>
        <div className="mt-4">
          <TokenList tokens={COMIC_COLLECTIBLES_DATA.results} />
        </div>
      </div>
    </Layout>
  )
}

export default Market
