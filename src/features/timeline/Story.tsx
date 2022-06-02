import { useEffect, useState } from 'react'
import { Button, ButtonGroup, Chip, Stack, Typography } from '@mui/material'
import { FormattedDate, FormattedMessage } from 'react-intl'
import { useNavigate, useParams } from 'react-router-dom'

import { IStory } from '../../app/types'
import { useAppDispatch, useAppSelector } from '../../common/hooks'
import { selectAll } from '../tag/tagSlice'
import { fetchStoryById } from './timelineSlice'

export default () => {
  const appDispatch = useAppDispatch()
  const tags = useAppSelector(selectAll)
  const navigate = useNavigate()
  const parameters = useParams()
  const hasStoryId = parameters.storyId ? true : false
  const [story, setStory] = useState<IStory | null>(null)

  useEffect(() => {
    if (!hasStoryId) return
    const fetchStory = async () => {
      const storyId = parseInt(parameters.storyId ?? '0')
      const data = await appDispatch(fetchStoryById(storyId)).unwrap()
      if (data) setStory(data)
    }
    fetchStory()
  }, [parameters.storyId])

  if (story === null) return <div></div>

  return (
    <Stack direction="column" spacing={4}>
      <Typography variant="h4">{story.title}</Typography>
      <Typography variant="body1" color="text.secondary">
        <FormattedDate
          value={new Date(story.happenedAt)}
          year="numeric"
          month="long"
          day="2-digit"
        />
      </Typography>
      <Typography variant="body1">{story.detail}</Typography>
      <Stack direction="row" spacing={1}>
        {tags.map((tag) => (
          <Chip label={tag.name} sx={{ backgroundColor: tag.color }} />
        ))}
      </Stack>
      <ButtonGroup>
        <Button
          onClick={() => {
            navigate(`/stories/${story.id}/update`)
          }}
        >
          <FormattedMessage defaultMessage="Update" id="button.update" />
        </Button>
        <Button onClick={() => navigate('/')}>
          <FormattedMessage defaultMessage="Back" id="button.back" />
        </Button>
      </ButtonGroup>
    </Stack>
  )
}
