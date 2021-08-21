import Modal from 'components/Common/Modal'
import useStore from 'lib/store'

const ToastProvider = ({ children }) => {
  const toastReveal = useStore((state) => state.toastReveal)
  const toastConfig = useStore((state) => state.toastConfig)
  const setToastReveal = useStore((state) => state.setToastReveal)

  const _backgroundStyle = () => {
    if (toastConfig.type === 'error') {
      return `text-red-600 bg-red-300 border border-red-500 rounded-md`
    } else if (toastConfig.type === 'success') {
      return `text-green-600 bg-green-300 border border-green-500 rounded-md`
    } else {
      return `bg-gray-100 rounded-md`
    }
  }

  return (
    <div>
      {toastReveal && (
        <Modal
          close={(_) => setToastReveal(false)}
          style={{
            zIndex: 100,
          }}
        >
          <div className="hidden text-red-600 bg-red-300 border border-red-500"></div>
          <div className="hidden text-green-600 bg-green-300 border border-green-500"></div>
          <div className="hidden bg-gray-100 rounded-md"></div>
          <div className="w-full max-w-xs m-auto overflow-y-auto max-h-screen">
            <div className={_backgroundStyle()}>
              <div className="p-4">{toastConfig.text}</div>
            </div>
          </div>
        </Modal>
      )}
      <div>{children}</div>
    </div>
  )
}

export default ToastProvider
