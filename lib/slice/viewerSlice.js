import axios from 'axios'

const createViewerSlice = (set, get) => ({
  comicId: 'paradigm',
  chapterId: '1',
  showComment: false,
  setShowComment: () => set((prev) => ({ showComment: !prev.showComment })),
  commentData: [],
  commentDataPage: 0,
  commentDataHasMore: true,
  fetchCommentData: async () => {
    try {
      const response = await axios.get(
        `${process.env.COMIC_API_URL}/comments`,
        { comic_id: get().comidId, chapter_id: get().chapterId }
      )
      set(() => ({ commentData: response.data.data }))
    } catch (error) {
      console.log(error)
    }
  },
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
      console.log(error)
    }
  },
  likeComment: async (commentId, unlike) => {
    const url = `${process.env.COMIC_API_URL}/comments/${
      unlike ? 'unlikes' : 'likes'
    }`
    try {
      await axios.put(url, { comment_id: commentId })
    } catch (error) {
      console.log(error)
    }
  },
  dislikeComment: async (commentId, undislike) => {
    const url = `${process.env.COMIC_API_URL}/comments/${
      undislike ? 'undislikes' : 'dislikes'
    }`
    try {
      await axios.put(url, { comment_id: commentId })
    } catch (error) {
      console.log(error)
    }
  },
  deleteComment: async (commentId) => {
    try {
      await axios.delete(`${process.env.COMIC_API_URL}/comments/${commentId}`)
      set(() => ({
        commentData: get().commentData.filter(({ _id }) => _id !== commentId),
      }))
      get().fetchCommentData()
    } catch (error) {
      console.log(error)
    }
  },
})

export default createViewerSlice