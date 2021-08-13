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
        { comicId: get().comidId, chapterId: get().chapterId }
      )
      set(() => ({ commentData: response.data.data }))
    } catch (error) {
      console.log(error)
    }
  },
  postComment: async (body, callback) => {
    try {
      await axios.post(`${process.env.COMIC_API_URL}/comments`, {
        comicId: get().comidId,
        chapterId: get().chapterId,
        body,
      })
      await get().fetchCommentData()
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
      await axios.put(url, { commentId })
      get().fetchCommentData()
    } catch (error) {
      console.log(error)
    }
  },
  dislikeComment: async (commentId, undislike) => {
    const url = `${process.env.COMIC_API_URL}/comments/${
      undislike ? 'undislikes' : 'dislikes'
    }`
    try {
      await axios.put(url, { commentId })
      get().fetchCommentData()
    } catch (error) {
      console.log(error)
    }
  },
  deleteComment: async (commentId) => {
    try {
      await axios.delete(`${process.env.COMIC_API_URL}/comments/${commentId}`)
      get().fetchCommentData()
    } catch (error) {
      console.log(error)
    }
  },
})

export default createViewerSlice
