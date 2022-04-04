import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CircularProgress,
  Typography,
} from '@mui/material'
import { Timeline } from '@mui/lab'
import { css } from '@emotion/react'

import { useAppDispatch, useAppSelector } from '../../app/hooks'
import {
  selectAll,
  getTimelineStatus,
  selectAllStories,
  insertStory,
  IStory,
  updateStory,
} from './timelineSlice'
import { FormattedMessage } from 'react-intl'
import { TimelineForm } from './TimelineForm'
import { StroyItem } from './StoryItem'

export const MyTimeline = () => {
  const dispatch = useAppDispatch()
  const stories = useAppSelector(selectAll)
  const status = useAppSelector(getTimelineStatus)

  const [isDialogOpened, setIsDialogOpened] = useState(false)
  const [storyId, setStoryId] = useState<number | undefined>(undefined)

  useEffect(() => {
    dispatch(selectAllStories())
  }, [])

  return (
    <Box>
      <Box>
        <ButtonGroup variant="contained">
          <Button
            variant="contained"
            onClick={(event) => setIsDialogOpened(true)}
          >
            <FormattedMessage defaultMessage="新增" id="addStory" />
          </Button>
        </ButtonGroup>
      </Box>
      <Box>
        <Card>
          <ButtonGroup>
            <Button>asdf</Button>
            <Button>asdf</Button>
            <Button>asdf</Button>
          </ButtonGroup>
          {status === 'loading' && <CircularProgress sx={{}} />}
          <Timeline>
            {stories.map((story) => (
              <StroyItem
                storyId={story.id!}
                key={`TimelineStory-${story.id}`}
                onUpdate={(storyId: number) => {
                  setStoryId(storyId)
                  setIsDialogOpened(true)
                }}
              />
            ))}
          </Timeline>
        </Card>
      </Box>
      <TimelineForm
        openDialog={isDialogOpened}
        onDialogClose={() => {
          setIsDialogOpened(false)
          setStoryId(undefined)
        }}
        onSubmit={(story: IStory) => {
          if (storyId === undefined) dispatch(insertStory(story))
          else dispatch(updateStory(story))
          setIsDialogOpened(false)
        }}
        storyId={storyId}
      />
    </Box>
  )
}
