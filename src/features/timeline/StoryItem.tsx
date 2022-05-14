import { Link as RouterLink } from 'react-router-dom'
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  Chip,
  Divider,
  Stack,
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
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import { FormattedMessage } from 'react-intl'

import { useAppSelector } from '../../app/hooks'
import { selectById } from './timelineSlice'
import { selectAll } from '../tag/tagSlice'
import { useState } from 'react'

export const StroyItem = ({ storyId }: { storyId: number }) => {
  const story = useAppSelector((state) => selectById(state, storyId))
  const tags = useAppSelector(selectAll)
  const [isExpanded, toggleIsExpanded] = useState(false)

  if (story === undefined) return <div></div>

  const storyTags = tags
    .filter((tag) => story.tagIds.includes(tag.id!))
    .map((tag) => (
      <Chip
        key={`TagId-${tag.id}`}
        label={tag.name}
        size="small"
        sx={{ backgroundColor: tag.color }}
      />
    ))

  return (
    <TimelineItem>
      <TimelineOppositeContent color="text.secondary">
        <p>{new Date(story.happenedAt).toISOString()}</p>
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineConnector />
        <TimelineDot />
        <TimelineConnector />
      </TimelineSeparator>
      <TimelineContent>
        <Accordion
          expanded={isExpanded}
          onChange={() => toggleIsExpanded(!isExpanded)}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3a-content"
            id="panel3a-header"
          >
            <Typography variant={isExpanded ? 'h6' : 'body1'}>
              {story.title}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Stack spacing={2}>
              <Typography color="text.secondary">{story.detail}</Typography>
              <Divider />
              <Stack direction="row" spacing={1}>
                {storyTags}
              </Stack>
            </Stack>
          </AccordionDetails>
          <AccordionActions>
            <Button
              variant="contained"
              component={RouterLink}
              to={`/stories/${story.id}`}
            >
              <FormattedMessage defaultMessage="更新" id="updateStory" />
            </Button>
          </AccordionActions>
        </Accordion>
      </TimelineContent>
    </TimelineItem>
  )
}
