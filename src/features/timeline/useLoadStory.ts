import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { NotificationMessage, Story } from '../../app/types'
import { useAppDispatch } from '../../common/hooks'
import { fetchStoryById } from './timelineSlice'

export type useLoadStoryHook = () => {
  isLoading: boolean
  story: Story | undefined
  error: NotificationMessage | null
}

const useLoadStory: useLoadStoryHook = () => {
  const { storyId } = useParams<{ storyId: string }>()
  const appDispatch = useAppDispatch()
  const [story, setStory] = useState<Story | undefined>(undefined)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<NotificationMessage | null>(null)

  useEffect(() => {
    if (storyId === undefined) return
    const fetchStory = async () => {
      setIsLoading(true)
      const id = parseInt(storyId)
      if (isNaN(id)) {
        setIsLoading(false)
        setError({ message: 'invalid story id', type: 'error' })
        return
      }
      const data = await appDispatch(fetchStoryById(id)).unwrap()
      if (data) setStory(data)
      setIsLoading(false)
    }
    fetchStory()
  }, [storyId])

  return { isLoading, story, error }
}

export default useLoadStory
