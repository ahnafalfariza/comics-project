import axios from 'axios'
import Button from 'components/Common/Button'
import IconLove from 'components/Icons/component/IconLove'
import { useEffect, useState } from 'react'

const ButtonLikes = ({ comicId, chapterId, isLoading }) => {
  const [isLiked, setIsLiked] = useState(false)

  useEffect(() => {
    const fetchLiked = async () => {
      const response = await axios.get(
        `${process.env.COMIC_API_URL}/like-chapter`,
        {
          params: {
            comic_id: comicId,
            chapter_id: chapterId,
            //temp
            account_id: 'johncena.testnet',
          },
        }
      )
      setIsLiked(response.data.result)
    }
    if (chapterId && comicId && !isLoading) {
      fetchLiked()
    }
  }, [chapterId, comicId, isLoading])

  const onClickLikes = async () => {
    setIsLiked(!isLiked)
    await axios.put(`${process.env.COMIC_API_URL}/like-chapter`, null, {
      params: {
        comic_id: comicId,
        chapter_id: chapterId,
        user_action: !isLiked,
        //temp
        account_id: 'johncena.testnet',
      },
    })
  }

  return (
    <Button className="flex items-center mr-8" size="md" onClick={onClickLikes}>
      <IconLove color={isLiked ? 'white' : 'none'} />
      <div className="ml-3 text-white text-xl">Like</div>
    </Button>
  )
}

export default ButtonLikes
