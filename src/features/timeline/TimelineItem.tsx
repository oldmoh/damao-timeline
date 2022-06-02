import { Link as RouterLink, useNavigate } from 'react-router-dom'
import {
  Card,
  CardActionArea,
  CardContent,
  Chip,
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
import { FormattedDate, FormattedMessage } from 'react-intl'

import { useAppSelector } from '../../common/hooks'
import { selectById } from './timelineSlice'
import { selectAll } from '../tag/tagSlice'

export default ({ storyId }: { storyId: number }) => {
  const story = useAppSelector((state) => selectById(state, storyId))
  const tags = useAppSelector(selectAll)
  const navigate = useNavigate()

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
      <TimelineOppositeContent
        color="text.secondary"
        sx={{ display: { xs: 'none', md: 'block' }, margin: 'auto 0' }}
      >
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
        <Card>
          <CardActionArea
            onClick={() => {
              navigate(`/stories/${storyId}`)
            }}
          >
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="body1">{story.title}</Typography>
                <Typography
                  sx={{ fontSize: 12, display: { xs: 'block', md: 'none' } }}
                  variant="body2"
                  color="text.secondary"
                >
                  <FormattedDate
                    value={new Date(story.happenedAt)}
                    year="numeric"
                    month="long"
                    day="2-digit"
                  />
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {story.detail}
                </Typography>
                <Stack direction="row" alignItems="flex-start" spacing={1}>
                  {storyTags}
                </Stack>
              </Stack>
            </CardContent>
          </CardActionArea>
        </Card>
      </TimelineContent>
    </TimelineItem>
  )
}
