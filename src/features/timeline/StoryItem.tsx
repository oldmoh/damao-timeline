import { Link as RouterLink } from 'react-router-dom'
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Link,
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

export const StroyItem = ({ storyId }: { storyId: number }) => {
  const story = useAppSelector((state) => selectById(state, storyId))

  if (story === undefined) return <div></div>

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
            <Link component={RouterLink} to={`/story/${story.id}`}>
              <FormattedMessage defaultMessage="更新" id="updateStory" />
            </Link>
          </AccordionActions>
        </Accordion>
      </TimelineContent>
    </TimelineItem>
  )
}
