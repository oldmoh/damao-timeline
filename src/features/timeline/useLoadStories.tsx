import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../common/hooks'
import {
  countStories,
  fetchStories,
  getQueryCriteria,
  getTotalCount,
  selectAll,
} from './timelineSlice'

export default () => {
  const dispatch = useAppDispatch()
  const stories = useAppSelector(selectAll)
  const totalCount = useAppSelector(getTotalCount)
  const criteria = useAppSelector(getQueryCriteria)
  const [isLoading, setIsLoading] = useState(false)
  const [isDisabled, setIsDisabled] = useState(false)

  const updateTotalCount = async () => {
    setIsDisabled(true)
    await dispatch(countStories())
    setIsDisabled(false)
  }

  useEffect(() => {
    updateTotalCount()
  }, [criteria])

  const onLoadMore = async () => {
    setIsLoading(true)
    await dispatch(fetchStories())
    setIsLoading(false)
  }

  return {
    isLoading,
    hasNext: totalCount !== stories.length,
    isDisabled,
    onLoadMore,
    stories,
  }
}
