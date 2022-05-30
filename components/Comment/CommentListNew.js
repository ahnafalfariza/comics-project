import axios from 'axios'
import Button from 'components/Common/Button'
import { InputTextarea } from 'components/Common/form'
import useStore from 'lib/store'
import React, { useEffect, useState } from 'react'
import Scrollbars from 'react-custom-scrollbars-2'
import InfiniteScroll from 'react-infinite-scroll-component'
import CommentsLoader from './CommentsLoader'
import { useRouter } from 'next/router'
import Avatar from 'components/Common/Avatar'
import { parseImgUrl } from 'utils/common'
import { formatTimeAgo } from 'utils/dateHelper'
import near from 'lib/near'
import { IconThumbDown, IconThumbUp } from 'components/Icons'
import CommentDeleteModal from './CommentDeleteModal'

const CommentListNew = () => {
  const [commentText, setCommentText] = useState('')

  const [sortedBy, setSortedBy] = useState('newest')
  const [showSortByModal, setShowSortByModal] = useState(false)
  const commentData = useStore((state) => state.commentData)
  const fetchCommentData = useStore((state) => state.fetchCommentData)
  const postComment = useStore((state) => state.postComment)
  const clearCommentData = useStore((state) => state.clearCommentData)
  const currentUser = useStore((state) => state.currentUser)

  const router = useRouter()
  const { comicId, chapterId } = router.query

  useEffect(() => {
    fetchCommentData(comicId, chapterId, sortedBy)
  }, [chapterId, comicId, fetchCommentData, sortedBy])

  useEffect(() => {
    return () => clearCommentData()
  }, [clearCommentData])

  return (
    <div className="max-w-2xl flex flex-col mx-auto">
      <div className="my-2">
        <p className="text-xl font-semibold text-black">Comments</p>
      </div>
      <div className="my-2">
        <div className="flex flex-col justify-center space-y-2">
          <InputTextarea
            className="h-15 w-full mx-1"
            placeholder="Write a comment..."
            value={commentText}
            maxLength={100}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <Button
            size="sm"
            className="float-right w-2/12 mx-1"
            isDisabled={
              commentText === '' || currentUser?.accountId === undefined
            }
            onClick={() => postComment(commentText, () => setCommentText(''))}
          >
            Post
          </Button>
        </div>
      </div>
      <div className="h-1 w-full bg-gray-300 my-2"></div>
      <div className="my-2 h-72">
        <div className="flex items-center justify-end mb-2 relative">
          <div
            className="px-2 py-1 border rounded-md border-black flex items-center justify-center space-x-1 hover:bg-gray-100 cursor-pointer"
            onClick={() => setShowSortByModal(!showSortByModal)}
          >
            <p className="font-semibold text-sm">
              {sortedBy === 'newest' ? 'Newest' : 'Top'}
            </p>
            <svg
              viewBox="0 0 11 7"
              fill="black"
              width="12"
              height="12"
              xlmns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M5.00146 6.41431L9.70857 1.7072C10.0991 1.31668 10.0991 0.683511 9.70857 0.292986C9.31805 -0.097538 8.68488 -0.097538 8.29436 0.292986L5.00146 3.58588L1.70857 0.292986C1.31805 -0.097538 0.684882 -0.097538 0.294358 0.292986C-0.0961662 0.68351 -0.0961662 1.31668 0.294358 1.7072L5.00146 6.41431Z"
                fill="black"
              ></path>
            </svg>
          </div>
          {showSortByModal && (
            <div className="absolute bg-white rounded-md border border-black z-10 bottom-1 -mb-16 md:-mb-20 w-20 max-w-full flex flex-col">
              <div
                className="p-1 rounded-t-md md:p-2 hover:bg-gray-200 transition-all cursor-pointer text-sm font-semibold"
                onClick={() => {
                  setSortedBy('newest')
                  setShowSortByModal(false)
                }}
              >
                Newest
              </div>
              <div
                className="p-1 rounded-b-md md:p-2 hover:bg-gray-200 transition-all cursor-pointer text-sm font-semibold"
                onClick={() => {
                  setSortedBy('top')
                  setShowSortByModal(false)
                }}
              >
                Top
              </div>
            </div>
          )}
        </div>
        <Scrollbars
          className="h-full"
          universal={true}
          renderView={(props) => <div {...props} id="activityListScroll"></div>}
        >
          {commentData.length !== 0 ? (
            <InfiniteScroll
              dataLength={commentData.length}
              next={() => fetchCommentData(comicId, chapterId, sortedBy)}
              hasMore={false}
              loader={<CommentsLoader />}
            >
              {commentData.map((data) => (
                <CommentNew
                  key={data.comment_id}
                  data={data}
                  commentData={commentData}
                />
              ))}
            </InfiniteScroll>
          ) : (
            <div className="p-4 text-black text-center">
              Be the first to comment
            </div>
          )}
        </Scrollbars>
      </div>
    </div>
  )
}

const CommentNew = ({ data }) => {
  const [userLikes, setUserLikes] = useState(data?.user_likes)
  const [numLikes, setNumLikes] = useState(data?.likes)
  const [numDislikes, setNumDislikes] = useState(data?.dislikes)
  const [userData, setUserData] = useState({})
  const [showDeleteCommentModal, setShowDeleteCommentModal] = useState(false)

  const likeComment = useStore((state) => state.likeComment)
  const dislikeComment = useStore((state) => state.dislikeComment)
  const deleteComment = useStore((state) => state.deleteComment)
  const router = useRouter()
  const { comicId, chapterId } = router.query

  useEffect(() => {
    const fetchUser = async () => {
      const response = await axios.get(
        `${process.env.PARAS_API_URL}/profiles?accountId=${data?.account_id}`
      )
      setUserData(response.data.data.results[0])
    }
    fetchUser()
  }, [data?.account_id])

  const _likeAction = () => {
    setUserLikes(userLikes === 'likes' ? null : 'likes')
    setNumLikes(userLikes === 'likes' ? numLikes - 1 : numLikes + 1)
    setNumDislikes(userLikes === 'dislikes' ? numDislikes - 1 : numDislikes)
    likeComment(data?.comment_id, userLikes === 'likes')
  }

  const _dislikeAction = () => {
    setUserLikes(userLikes === 'dislikes' ? null : 'dislikes')
    setNumDislikes(userLikes === 'dislikes' ? numDislikes - 1 : numDislikes + 1)
    setNumLikes(userLikes === 'likes' ? numLikes - 1 : numLikes)
    dislikeComment(data?.comment_id, userLikes === 'dislikes')
  }

  const redirectToProfile = () => {
    router.push(`/${data?.account_id}`)
  }

  return (
    <div className="p-4">
      <div className="flex items-center">
        <Avatar
          size="md"
          src={parseImgUrl(userData?.imgUrl || '')}
          onClick={redirectToProfile}
          entityName={data.account_id}
          className="cursor-pointer"
        />
        <p
          className="font-bold mx-3 text-black cursor-pointer hidden md:block"
          onClick={redirectToProfile}
        >
          {data?.account_id}
        </p>
        <p className="text-gray-500 text-xs hidden md:block">
          {formatTimeAgo(new Date(data?.issued_at))}
        </p>
        <div className="block md:hidden">
          <p
            className="font-bold mx-3 text-black cursor-pointer"
            onClick={redirectToProfile}
          >
            {data?.account_id}
          </p>
          <p className="text-gray-500 text-xs mx-3">
            {formatTimeAgo(new Date(data?.issued_at))}
          </p>
        </div>
      </div>
      <p className="my-3 text-gray-600">{data?.body}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <IconThumbUp
            className="cursor-pointer"
            onClick={_likeAction}
            {...(userLikes === 'likes' && { color: '#60A5FA' })}
          />
          <p className="text-xs text-black">{numLikes}</p>
          <IconThumbDown
            onClick={_dislikeAction}
            className="ml-3 cursor-pointer"
            {...(userLikes === 'dislikes' && { color: '#60A5FA' })}
          />
          <p className="text-xs text-black">{numDislikes}</p>
          {data?.account_id === near.currentUser?.accountId && (
            <svg
              id="trashIcon"
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-trash cursor-pointer ml-3"
              width={20}
              height={20}
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="#ff2825"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              onClick={() => setShowDeleteCommentModal(true)}
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <line x1={4} y1={7} x2={20} y2={7} />
              <line x1={10} y1={11} x2={10} y2={17} />
              <line x1={14} y1={11} x2={14} y2={17} />
              <path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" />
              <path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" />
            </svg>
          )}
        </div>
      </div>
      <CommentDeleteModal
        showDeleteCommentConfirm={showDeleteCommentModal}
        onClick={() => deleteComment(data?.comment_id, comicId, chapterId)}
        onClose={() => setShowDeleteCommentModal(false)}
      />
    </div>
  )
}

export default CommentListNew
