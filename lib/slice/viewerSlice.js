import axios from 'axios'
import { sentryCaptureException } from 'lib/sentry'

const createViewerSlice = (set, get) => ({
  comicId: '',
  chapterId: '',
  showComment: false,
  setShowComment: () => set((prev) => ({ showComment: !prev.showComment })),
  commentData: [],
  commentDataPage: 0,
  commentDataHasMore: true,
  fetchCommentData: async (comicId, chapterId, sortedBy = 'newest') => {
    if (comicId && chapterId) {
      set(() => ({ comicId, chapterId }))
    }
    try {
      const response = await axios.get(
        `${process.env.COMIC_API_URL}/comments`,
        {
          params: { comic_id: comicId, chapter_id: chapterId },
        }
      )
      const respComment = response.data.data.results
      let sortedComment
      if (sortedBy === 'newest') {
        sortedComment = respComment?.sort(
          (x, y) => new Date(y.issued_at) - new Date(x.issued_at)
        )
      } else {
        sortedComment = respComment?.sort((x, y) => y.likes - x.likes)
      }
      set(() => ({ commentData: sortedComment }))
    } catch (error) {
      sentryCaptureException(error)
    }
  },
  clearCommentData: () => set(() => ({ commentData: [] })),
  postComment: async (body, callback) => {
    try {
      const response = await axios.post(
        `${process.env.COMIC_API_URL}/comments`,
        {
          comic_id: get().comicId,
          chapter_id: get().chapterId,
          body,
        }
      )
      const newComment = {
        ...response.data.data,
        issued_at: new Date(),
      }
      set(() => ({ commentData: [newComment, ...get().commentData] }))
      callback()
    } catch (error) {
      sentryCaptureException(error)
    }
  },
  likeComment: async (commentId, unlike) => {
    const url = `${process.env.COMIC_API_URL}/comments/${
      unlike ? 'unlikes' : 'likes'
    }`
    try {
      await axios.put(url, { comment_id: commentId })
    } catch (error) {
      sentryCaptureException(error)
    }
  },
  dislikeComment: async (commentId, undislike) => {
    const url = `${process.env.COMIC_API_URL}/comments/${
      undislike ? 'undislikes' : 'dislikes'
    }`
    try {
      await axios.put(url, { comment_id: commentId })
    } catch (error) {
      sentryCaptureException(error)
    }
  },
  deleteComment: async (commentId, comicId, chapterId) => {
    try {
      await axios.delete(`${process.env.COMIC_API_URL}/comments/${commentId}`)
      set(() => ({
        commentData: get().commentData.filter(
          ({ comment_id }) => comment_id !== commentId
        ),
      }))
      get().fetchCommentData(comicId, chapterId)
    } catch (error) {
      sentryCaptureException(error)
    }
  },
})

export default createViewerSlice
