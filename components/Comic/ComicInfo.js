import { Tab, TabList, Tabs } from 'components/Common/Tabs'
import { useRouter } from 'next/router'
import { parseDate } from 'utils/dateHelper'
import { parseImgUrl } from 'utils/common'
import { linkDiscordVote } from 'constants/discordvote'

const ComicInfo = ({
  data = {
    comic_id: 'naruto',
    title: 'Naruto',
    description: 'Lorum ipsum dolor amet',
    author_ids: ['afiq.testnet'],
    issued_at: '',
    media: 'bafybeiahl55gjwifng26oya77sw5nvtiqevc5jcxai3u7atupyiyyry2ji',
    media_cover: 'bafybeiahl55gjwifng26oya77sw5nvtiqevc5jcxai3u7atupyiyyry2ji',
  },
  defaultIndex = 0,
}) => {
  const router = useRouter()
  const chapterImage = {
    backgroundImage: `url(${parseImgUrl(data.media)})`,
  }

  const onTabsChange = (v) => {
    const mapTabs = {
      0: 'chapter',
      1: 'collectibles',
    }
    router.push(`/comics/${router.query.id}/${mapTabs[v]}`, '', {
      scroll: false,
      shallow: true,
    })
  }

  return (
    <div>
      <div className="flex items-center bg-no-repeat bg-center bg-cover w-full relative">
        <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-40 backdrop-filter backdrop-blur-lg backdrop-saturate-200 z-10" />
        <div
          className="absolute top-0 left-0 w-full h-full bg-cover bg-white"
          style={{ backgroundImage: `url(${parseImgUrl(data.media_cover)})` }}
        />
        <div className="flex w-full items-center sm:items-start flex-col sm:flex-row sm:px-6 py-12 sm:py-24 max-w-5xl mx-auto relative z-20">
          <div
            className=" w-40 h-60 sm:w-52 sm:h-72 lg:w-72 lg:h-96 flex-none rounded-2xl bg-no-repeat bg-center bg-cover shadow-2xl"
            style={chapterImage}
          />
          <div className="p-4 sm:ml-6 lg:ml-12 w-full">
            <h3 className="text-white text-center sm:text-left font-semibold text-2xl sm:text-4xl lg:text-5xl mb-4">
              {data.title}
            </h3>
            {/* <p className="text-white text-center font-bold mb-8 sm:mb-4 md:text-left">
              {nFormatter(data.totalLikes) || 0} Likes
            </p> */}
            <div className="grid grid-cols-2">
              <div>
                <h4 className="text-white mb-1 font-semibold ">Author</h4>
                {data.author_ids.map((author) => (
                  <p key={author} className="text-blueGray-200 mb-4">
                    {author}
                  </p>
                ))}
              </div>
              <div>
                <h4 className="text-white mb-1 font-semibold ">Published</h4>
                <p className="text-blueGray-200 mb-4">
                  {parseDate(data.issued_at)}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2">
              <div>
                <h4 className="text-white mb-1 font-semibold ">Genre</h4>
                <p className="text-blueGray-200 mb-4">
                  {data.genre} {data.subgenre ? `- ${data.subgenre}` : ''}
                </p>
              </div>
            </div>
            <h4 className="text-white mb-1 font-semibold ">Synopsis:</h4>
            <p className="text-blueGray-200">{data.description}</p>
            {linkDiscordVote[data.comic_id] && (
              // eslint-disable-next-line react/jsx-no-target-blank
              <a
                href={linkDiscordVote[data.comic_id]}
                target="_blank"
                className="mt-4 font-semibold bg-primary rounded-full tracking-wider px-8 py-3 text-white inline-block"
              >
                Vote in Discord
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto mt-9 mb-4">
        <Tabs defaultIndex={defaultIndex} onTabsChange={onTabsChange}>
          <TabList>
            <Tab>Chapter</Tab>
            <Tab>{data.type !== 'championship' ? 'Collectibles' : ''}</Tab>
          </TabList>
        </Tabs>
      </div>
    </div>
  )
}

export default ComicInfo
