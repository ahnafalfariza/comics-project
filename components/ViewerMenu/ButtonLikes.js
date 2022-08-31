import axios from 'axios'
import Button from 'components/Common/Button'
import IconLove from 'components/Icons/component/IconLove'
import LoginModal from 'components/Modal/LoginModal'
import useStore from 'lib/store'
import { useEffect, useState } from 'react'

const ButtonLikes = ({ comicId, chapterId, isLoading }) => {
  const [isLiked, setIsLiked] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const { currentUser } = useStore()

  useEffect(() => {
    const fetchLiked = async () => {
      const response = await axios.get(
        `${process.env.COMIC_API_URL}/like-chapter`,
        {
          params: {
            comic_id: comicId,
            chapter_id: chapterId,
          },
        }
      )
      setIsLiked(response.data.result)
    }
    if (chapterId && comicId && !isLoading && currentUser?.accountId) {
      fetchLiked()
    }
  }, [chapterId, comicId, currentUser?.accountId, isLoading])

  const onClickLikes = async () => {
    if (!currentUser) {
      setShowLogin(true)
      return
    }

    setIsLiked(!isLiked)

    const body = new FormData()
    body.append('comic_id', comicId)
    body.append('chapter_id', chapterId)
    body.append('user_action', !isLiked)

    await axios.put(`${process.env.COMIC_API_URL}/like-chapter`, body, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
  }

  return (
    <>
      <LoginModal
        title="Login to like this chapter"
        show={showLogin}
        onClose={() => setShowLogin(false)}
      />
      <Button
        className="flex items-center mr-8"
        size="md"
        onClick={onClickLikes}
      >
        <IconLove color={isLiked ? 'white' : 'none'} />
        <div className="ml-3 text-white text-xl">
          {isLiked ? 'Liked' : 'Like'}
        </div>
      </Button>
    </>
  )
}

export default ButtonLikes
