let timeout
const createCommonSlice = (set, get) => ({
  toastReveal: false,
  toastConfig: {
    text: '',
    type: 'info',
    duration: 2500,
  },
  setToastReveal: (reveal) => set(() => ({ toastReveal: reveal })),
  setToastConfig: (newConfig) => {
    clearTimeout(timeout)
    const updateConfig = { ...get().toastConfig, ...newConfig }
    set(() => ({ toastConfig: updateConfig }))
    set(() => ({ toastReveal: true }))

    if (updateConfig.duration) {
      timeout = setTimeout(() => {
        set(() => ({ toastReveal: false }))
      }, updateConfig.duration)
    }
  },
})

export default createCommonSlice
