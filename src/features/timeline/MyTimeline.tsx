import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CircularProgress,
  Typography,
} from '@mui/material'
import { Timeline } from '@mui/lab'

import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { selectAll, getTimelineStatus, selectAllStories } from './timelineSlice'
import { FormattedMessage } from 'react-intl'
import { StroyItem } from './StoryItem'

export const MyTimeline = () => {
  const dispatch = useAppDispatch()
  const stories = useAppSelector(selectAll)
  const status = useAppSelector(getTimelineStatus)
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(selectAllStories())
  }, [])

  return (
    <Box>
      <Box>
        <ButtonGroup variant="contained">
          <Button onClick={() => navigate('/story/create')}>
            <FormattedMessage defaultMessage="新增" id="addStory" />
          </Button>
        </ButtonGroup>
      </Box>
      <Box>
        <Card>
          {status === 'loading' && <CircularProgress sx={{}} />}
          <Timeline>
            {stories.map((story) => (
              <StroyItem
                storyId={story.id!}
                key={`TimelineStory-${story.id}`}
              />
            ))}
          </Timeline>
        </Card>
      </Box>
    </Box>
  )
}
