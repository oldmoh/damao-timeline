import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material'
import { Timeline } from '@mui/lab'
import useInfiniteScroll from 'react-infinite-scroll-hook'

import { useAppDispatch, useAppSelector } from '../../common/hooks'
import { selectAll, fetchStories, clear } from './timelineSlice'
import { FormattedMessage } from 'react-intl'
import TimelineItem from './TimelineItem'
import { IStoryQueryCriteria } from '../../app/types'
import useLoadStories from './useLoadStories'
import TimelineItemSkeleton from './TimelineItemSkeleton'

const pageSize = 5

export default () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const { isLoading, hasNext, isDisabled, onLoadMore, stories } =
    useLoadStories()

  const [sentryRef] = useInfiniteScroll({
    loading: isLoading,
    hasNextPage: hasNext,
    onLoadMore,
    disabled: isDisabled,
    rootMargin: '0px 0px 40px 0px',
  })

  useEffect(() => {
    dispatch(clear)
  }, [])

  return (
    <Stack spacing={4}>
      <Typography variant="h5">
        <FormattedMessage id="timeline.title" defaultMessage={'Timeline'} />
      </Typography>
      <Box>
        <ButtonGroup variant="contained">
          <Button onClick={() => navigate('/stories/create')}>
            <FormattedMessage defaultMessage="Add" id="button.add" />
          </Button>
        </ButtonGroup>
      </Box>
      <Box>
        <Timeline>
          {stories.map((story) => (
            <TimelineItem
              storyId={story.id!}
              key={`TimelineStory-${story.id}`}
            />
          ))}
          {hasNext && <TimelineItemSkeleton ref={sentryRef} />}
        </Timeline>
      </Box>
    </Stack>
  )
}
