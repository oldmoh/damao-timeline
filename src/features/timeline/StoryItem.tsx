import { useEffect, useState } from 'react'
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  Typography,
} from '@mui/material'
import {
  TimelineConnector,
  TimelineContent,
  TimelineDot,
  TimelineItem,
  TimelineOppositeContent,
  TimelineSeparator,
} from '@mui/lab'
import { css } from '@emotion/react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { FormattedMessage } from 'react-intl'

import { useAppSelector } from '../../app/hooks'
import { selectById } from './timelineSlice'

export const StroyItem = ({
  storyId,
  onUpdate,
}: {
  storyId: number
  key: string
  onUpdate: (storyId: number) => void
}) => {
  const story = useAppSelector((state) => selectById(state, storyId))
  if (story === undefined) return <div></div>
  else
    return (
      <TimelineItem>
        <TimelineOppositeContent color="text.secondary">
          <p>{new Date(story.happenedAt).toISOString()}</p>
        </TimelineOppositeContent>
        <TimelineSeparator>
          <TimelineDot />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
          <Accordion>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel3a-content"
              id="panel3a-header"
            >
              <Typography>{story.title}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>{story.detail}</Typography>
            </AccordionDetails>
            <AccordionActions>
              <Button variant="text" onClick={() => onUpdate(storyId)}>
                <FormattedMessage defaultMessage="更新" id="updateStory" />
              </Button>
            </AccordionActions>
          </Accordion>
        </TimelineContent>
      </TimelineItem>
    )
}
