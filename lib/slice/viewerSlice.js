import axios from 'axios'
import { sentryCaptureException } from 'lib/sentry'

const createViewerSlice = (set, get) => ({
  comicId: '',
  chapterId: '',
  showComment: false,
  loadingComment: false,
  setLoadingComment: (state) => set(() => ({ loadingComment: state })),
  loadingResetComment: false,
  setLoadingResetComment: (state) =>
    set(() => ({ loadingResetComment: state })),
  setShowComment: () => set((prev) => ({ showComment: !prev.showComment })),
  commentData: [],
  setResetCommentData: () => set(() => ({ commentData: [] })),
  commentDataPage: 0,
  commentDataHasMore: true,
  setResetCommentDataHasMore: () => set(() => ({ commentDataHasMore: true })),
  fetchCommentData: async (
    comicId,
    chapterId,
    sortedBy = 'newest',
    limit,
    skip
  ) => {
    if (comicId && chapterId) {
      set(() => ({ comicId, chapterId }))
    }
    try {
      skip ? get().setLoadingComment(true) : get().setLoadingResetComment(true)
      const response = await axios.get(
        `${process.env.COMIC_API_URL}/comments`,
        {
          params: {
            comic_id: comicId,
            chapter_id: chapterId,
            __limit: limit || 4,
            __skip: skip || 0,
            __sort: sortedBy === 'newest' ? `_id::-1` : `likes::-1`,
          },
        }
      )
      const respComment = response.data.data.results
      const UnifiedCommentData = skip
        ? get().commentData.concat(respComment)
        : respComment
      set(() => ({
        commentDataHasMore: respComment.length < limit ? false : true,
        commentData: skip ? UnifiedCommentData : respComment,
      }))
      skip
        ? get().setLoadingComment(false)
        : get().setLoadingResetComment(false)
    } catch (error) {
      sentryCaptureException(error)
      skip
        ? get().setLoadingComment(false)
        : get().setLoadingResetComment(false)
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
