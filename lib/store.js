import create from 'zustand'
import createChapterSlice from './slice/chapterSlice'
import createCommonSlice from './slice/commonSlice'
import createTokenSeriesSlice from './slice/tokenSeriesSlice'
import createViewerSlice from './slice/viewerSlice'

const useStore = create((set, get) => ({
  currentUser: null,
  setCurrentUser: (user) => set(() => ({ currentUser: user })),
  ...createViewerSlice(set, get),
  ...createChapterSlice(set, get),
  ...createCommonSlice(set, get),
  ...createTokenSeriesSlice(set, get),

  // news page
  newsList: [],
  setNewsList: (val) => set(() => ({ newsList: val })),
  newsListPage: 0,
  setNewsListPage: (val) => set(() => ({ newsListPage: val })),
  newsListHasMore: true,
  setNewsListHasMore: (val) => set(() => ({ newsListHasMore: val })),
}))

export default useStore
