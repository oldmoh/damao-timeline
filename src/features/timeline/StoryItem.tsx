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
import { FormattedDate, FormattedMessage } from 'react-intl'

import { useAppSelector } from '../../common/hooks'
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
        <FormattedDate
          value={new Date(story.happenedAt)}
          year="numeric"
          month="long"
          day="2-digit"
        />
      </TimelineOppositeContent>
      <TimelineSeparator>
        <TimelineConnector />
        <TimelineDot sx={{ backgroundColor: story.color }} />
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
              <FormattedMessage defaultMessage="Edit" id="button.edit" />
            </Button>
          </AccordionActions>
        </Accordion>
      </TimelineContent>
    </TimelineItem>
  )
}
