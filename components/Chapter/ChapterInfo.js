import { Tab, TabList, Tabs } from 'components/common/Tabs'
import { Blurhash } from 'react-blurhash'
import { useRouter } from 'next/router'
import { parseDate } from 'utils/dateHelper'

const ChapterInfo = ({
  data = {
    title: '',
    authors: '',
    published: '',
    summary: '',
    cover: '',
    imgBlur: '',
  },
  defaultIndex = 0,
}) => {
  const router = useRouter()
  const chapterImage = {
    backgroundImage: `url(${data.cover})`,
  }

  const onTabsChange = (v) => {
    const mapTabs = {
      0: 'chapter',
      1: 'collectibles',
    }
    router.push(`/overview/${router.query.id}/${mapTabs[v]}`)
  }

  return (
    <div>
      <div className="flex items-center bg-no-repeat bg-center bg-cover w-screen relative">
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-30 backdrop-filter backdrop-blur-lg backdrop-saturate-200 z-10" />
        <div className="absolute top-0 left-0 w-full h-full">
          <Blurhash
            hash={data.imgBlur || 'UZ9ZtPzmpHv;R]ONJ6bKQ-l7Z.S_bow5$-nh'}
            width="100%"
            height="100%"
            resolutionX={32}
            resolutionY={32}
            punch={1}
          />
        </div>

        <div className="flex w-full items-center sm:items-start flex-col sm:flex-row sm:px-6 py-12 sm:py-24 max-w-5xl mx-auto relative z-20">
          <div
            className=" w-40 h-60 sm:w-52 sm:h-72 lg:w-72 lg:h-96 flex-none rounded-2xl bg-no-repeat bg-center bg-cover shadow-2xl"
            style={chapterImage}
          />
          <div className="p-4 sm:ml-6 lg:ml-12">
            <h3 className="text-white text-center sm:text-left font-semibold text-2xl sm:text-4xl lg:text-5xl mb-8 sm:mb-4">
              {data.title}
            </h3>
            <h4 className="text-white mb-1 font-semibold ">Author: </h4>
            <p className="text-blueGray-200 mb-4">{data.authors}</p>
            <h4 className="text-white mb-1 font-semibold ">Published:</h4>
            <p className="text-blueGray-200 mb-4">
              {parseDate(data.published)}
            </p>
            <p className="text-blueGray-200">{data.summary}</p>
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto mt-9 mb-4">
        <Tabs defaultIndex={defaultIndex} onTabsChange={onTabsChange}>
          <TabList>
            <Tab>Chapter</Tab>
            <Tab>Collectibles</Tab>
          </TabList>
        </Tabs>
      </div>
    </div>
  )
}

export default ChapterInfo
