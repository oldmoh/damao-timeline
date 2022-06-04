import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { IStory } from '../../app/types'
import { useAppDispatch } from '../../common/hooks'
import { fetchStoryById } from './timelineSlice'

export type useLoadStoryHook = () => {
  isLoading: boolean
  story: IStory | undefined
  hasStoryId: boolean
}

const useLoadStory: useLoadStoryHook = () => {
  const { storyId } = useParams<{ storyId: string }>()
  const appDispatch = useAppDispatch()
  const [story, setStory] = useState<IStory | undefined>(undefined)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    if (storyId === undefined) return
    const fetchStory = async () => {
      const id = parseInt(storyId)
      if (id === NaN) return
      setIsLoading(true)
      const data = await appDispatch(fetchStoryById(id)).unwrap()
      if (data) setStory(data)
      setIsLoading(false)
    }
    fetchStory()
  }, [storyId])

  return { isLoading, story, hasStoryId: storyId !== undefined }
}

export default useLoadStory
