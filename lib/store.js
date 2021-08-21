import create from 'zustand'
import createChapterSlice from './slice/chapterSlice'
import createCommonSlice from './slice/commonSlice'
import createViewerSlice from './slice/viewerSlice'

const useStore = create((set, get) => ({
  currentUser: null,
  setCurrentUser: (user) => set(() => ({ currentUser: user })),
  ...createViewerSlice(set, get),
  ...createChapterSlice(set, get),
  ...createCommonSlice(set, get),
}))

export default useStore
