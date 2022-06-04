import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Fab, Stack, Typography } from '@mui/material'
import { Timeline } from '@mui/lab'
import useInfiniteScroll from 'react-infinite-scroll-hook'
import AddIcon from '@mui/icons-material/Add'

import { useAppDispatch } from '../../common/hooks'
import { clear } from './timelineSlice'
import { FormattedMessage } from 'react-intl'
import TimelineItem from './TimelineItem'
import useLoadStories from './useLoadStories'
import TimelineItemSkeleton from './TimelineItemSkeleton'

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
    <>
      <Stack spacing={4}>
        <Typography variant="h5">
          <FormattedMessage id="timeline.title" defaultMessage={'Timeline'} />
        </Typography>
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
      <Fab
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        color="primary"
        onClick={() => navigate('/stories/create')}
      >
        <AddIcon />
      </Fab>
    </>
  )
}
