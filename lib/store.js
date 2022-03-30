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

  // publication page
  publicationList: [],
  setPublicationList: (val) => set(() => ({ publicationList: val })),
  publicationListPage: 0,
  setPublicationListPage: (val) => set(() => ({ publicationListPage: val })),
  publicationListHasMore: true,
  setPublicationListHasMore: (val) =>
    set(() => ({ publicationListHasMore: val })),
}))

export default useStore
