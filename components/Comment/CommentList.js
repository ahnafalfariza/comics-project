import { useEffect, useState } from 'react'
import Scrollbars from 'react-custom-scrollbars-2'
import InfiniteScroll from 'react-infinite-scroll-component'
import useStore from 'lib/store'
import near from 'lib/near'

import Avatar from 'components/Common/Avatar'
import Button from 'components/Common/Button'
import { InputTextarea } from 'components/Common/form'
import { IconThumbDown, IconThumbUp, IconX } from 'components/Icons'
import CommentsLoader from './CommentsLoader'

import { PROFILE_IMAGE } from 'constants/dummy'
import { formatTimeAgo } from 'utils/dateHelper'
import { useRouter } from 'next/router'
import axios from 'axios'
import { parseImgUrl } from 'utils/common'

const CommentList = () => {
  const [commentText, setCommentText] = useState('')

  const commentData = useStore((state) => state.commentData)
  const setShowComment = useStore((state) => state.setShowComment)
  const fetchCommentData = useStore((state) => state.fetchCommentData)
  const postComment = useStore((state) => state.postComment)

  const router = useRouter()

  const { comicId, chapterId } = router.query

  useEffect(() => {
    fetchCommentData(comicId, chapterId)
  }, [chapterId, comicId, fetchCommentData])

  return (
    <div className="w-full md:max-w-lg bg-blueGray-800 p-3 h-2/3 flex flex-col m-auto">
      <div className="flex items-center justify-between p-3">
        <p className="text-xl font-medium text-white">Comments</p>
        <IconX onClick={setShowComment} className="cursor-pointer" />
      </div>
      <hr className="my-2 -mx-3 opacity-20" />
      <Scrollbars
        className="h-full"
        universal={true}
        renderView={(props) => <div {...props} id="activityListScroll" />}
      >
        {commentData.length !== 0 ? (
          <InfiniteScroll
            dataLength={commentData.length}
            next={fetchCommentData}
            hasMore={false}
            loader={<CommentsLoader />}
          >
            {commentData.map((data, index) => (
              <Comment key={index} data={data} />
            ))}
          </InfiniteScroll>
        ) : (
          <div className="p-4 text-white text-center">
            Be the first to comment
          </div>
        )}
      </Scrollbars>
      <div className="p-3">
        <InputTextarea
          className="mb-4 h-20"
          placeholder="Write a comment..."
          value={commentText}
          maxLength={100}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <Button
          size="sm"
          className="float-right"
          isDisabled={commentText === ''}
          onClick={() => postComment(commentText, () => setCommentText(''))}
        >
          Post comment
        </Button>
      </div>
    </div>
  )
}

const Comment = ({
  data = {
    _id: '6114bb0dbac918f0a4f2c8eb',
    account_id: 'p123.testnet',
    body: 'hello 23',
    chapter_id: '1',
    comic_id: 'paradigm',
    issued_at: '2021-08-17T06:43:00.486Z',
    user_likes: null,
    likes: 0,
  },
}) => {
  const [userLikes, setUserLikes] = useState(userLikes)
  const [numLikes, setNumLikes] = useState(data.likes)

  const [userData, setUserData] = useState({})

  const likeComment = useStore((state) => state.likeComment)
  const dislikeComment = useStore((state) => state.dislikeComment)
  const deleteComment = useStore((state) => state.deleteComment)

  useEffect(() => {
    const fetchUser = async () => {
      const response = await axios.get(
        `${process.env.PARAS_API_URL}/profiles?accountId=${data.account_id}`
      )
      setUserData(response.data.data.results[0])
    }
    fetchUser()
  }, [])

  const _likeAction = () => {
    setUserLikes(userLikes === 'likes' ? null : 'likes')
    setNumLikes(userLikes === 'likes' ? numLikes - 1 : numLikes + 1)
    likeComment(data._id, userLikes === 'likes')
  }

  const _unlikeAction = () => {
    setUserLikes(userLikes === 'dislikes' ? null : 'dislikes')
    setNumLikes(userLikes === 'likes' ? numLikes - 1 : numLikes)
    dislikeComment(data._id, userLikes === 'dislikes')
  }

  return (
    <div className="p-4">
      <div className="flex items-center">
        <Avatar
          size="md"
          src={parseImgUrl(userData?.imgUrl || '')}
          entityName={data.account_id}
        />
        <p className="font-bold mx-3 text-white">{data.account_id}</p>
        <p className="text-blueGray-400 text-xs">
          {formatTimeAgo(new Date(data.issued_at))}
        </p>
      </div>
      <p className="text-blueGray-200 my-3">{data.body}</p>
      <div className="flex items-center">
        <IconThumbUp
          className="cursor-pointer"
          onClick={_likeAction}
          {...(userLikes === 'likes' && { color: '#60A5FA' })}
        />
        <p className="text-xs text-blueGray-200">{numLikes}</p>
        <IconThumbDown
          onClick={_unlikeAction}
          className="ml-3 cursor-pointer"
          {...(userLikes === 'dislikes' && { color: '#60A5FA' })}
        />
        {data.account_id === near.currentUser.accountId && (
          <p
            className="text-white ml-2 text-xs cursor-pointer"
            onClick={() => deleteComment(data._id)}
          >
            Delete
          </p>
        )}
      </div>
    </div>
  )
}

export default CommentList
