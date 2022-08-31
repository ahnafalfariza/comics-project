import { SyncLoader } from 'react-spinners'

const Loading = ({
  loading = true,
  color = '#00BBDB',
  size = 12,
  className = '',
}) => {
  return (
    <div className={'' + className}>
      <SyncLoader loading={loading} color={color} size={size} />
    </div>
  )
}

export default Loading
