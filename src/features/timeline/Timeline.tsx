import { useEffect } from 'react'
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

import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { selectAll, getTimelineStatus, selectAllStories } from './timelineSlice'
import { FormattedMessage } from 'react-intl'
import { StroyItem } from './StoryItem'

export default () => {
  const dispatch = useAppDispatch()
  const stories = useAppSelector(selectAll)
  const status = useAppSelector(getTimelineStatus)
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(selectAllStories())
  }, [])

  const timelineItems = stories.map((story) => (
    <StroyItem storyId={story.id!} key={`TimelineStory-${story.id}`} />
  ))

  return (
    <Stack spacing={4}>
      <Typography variant="h5">時間軸</Typography>
      <Box>
        <ButtonGroup variant="contained">
          <Button onClick={() => navigate('/stories/create')}>
            <FormattedMessage defaultMessage="新增" id="addStory" />
          </Button>
        </ButtonGroup>
      </Box>
      <Box sx={{ display: 'flex' }}>
        {status === 'loading' && <CircularProgress />}
        {status === 'succeeded' && <Timeline>{timelineItems}</Timeline>}
      </Box>
    </Stack>
  )
}
