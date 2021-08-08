import Avatar from 'components/Common/Avatar'
import Button from 'components/Common/Button'
import { InputTextarea } from 'components/Common/form'
import { IconThumbDown, IconThumbUp, IconX } from 'components/Icons'
import { PROFILE_IMAGE } from 'constants/dummy'
import { useState } from 'react'
import Scrollbars from 'react-custom-scrollbars-2'
import InfiniteScroll from 'react-infinite-scroll-component'
import { parseDate } from 'utils/dateHelper'
import CommentsLoader from './CommentsLoader'

const CommentList = ({ chapterId, commentData = [] }) => {
  const [localCommentData, setLocalCommentData] = useState(Array(5).fill(''))

  const fetchData = () => {}

  return (
    <div className="max-w-lg bg-blueGray-800 p-3 h-full flex flex-col">
      <div className="flex items-center justify-between p-3">
        <p className="text-xl font-medium text-white">Comments (4)</p>
        <IconX />
      </div>
      <hr className="my-2 -mx-3 opacity-20" />
      <Scrollbars
        className="h-full"
        universal={true}
        renderView={(props) => <div {...props} id="activityListScroll" />}
      >
        {localCommentData.length !== 0 ? (
          <InfiniteScroll
            dataLength={localCommentData.length}
            next={fetchData}
            hasMore={false}
            loader={<CommentsLoader />}
          >
            {localCommentData.map((item, index) => (
              <Comment key={index} />
            ))}
          </InfiniteScroll>
        ) : (
          <div className="p-4 text-white text-center">
            Be the first to comment
          </div>
        )}
      </Scrollbars>
      <div className="p-3">
        <InputTextarea className="mb-4 h-20" placeholder="Write a comment..." />
        <Button size="sm" className="float-right">
          Post comment
        </Button>
      </div>
    </div>
  )
}

const Comment = ({
  profile = {
    username: 'ahnaf.near',
    avatar: PROFILE_IMAGE,
  },
  createdAt = 1628320698899,
  comment = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer elementum sem sed diam fringilla, ut efficitur urna congue.',
}) => {
  return (
    <div className="p-4">
      <div className="flex items-center">
        <Avatar size="md" src={profile.avatar} />
        <p className="font-bold mx-3 text-white">{profile.username}</p>
        <p className="text-blueGray-400 text-xs">{parseDate(createdAt)}</p>
      </div>
      <p className="text-blueGray-200 my-3">{comment}</p>
      <div className="flex items-center">
        <IconThumbUp onClick={() => console.log('thumbsUp')} />
        <p className="text-xs text-blueGray-200">5</p>
        <IconThumbDown
          onClick={() => console.log('thumbsDown')}
          className="ml-3"
        />
      </div>
    </div>
  )
}

export default CommentList
