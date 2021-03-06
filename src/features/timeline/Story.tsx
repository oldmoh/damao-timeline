import {
  Button,
  ButtonGroup,
  Chip,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material'
import { useEffect } from 'react'
import { FormattedDate, FormattedMessage } from 'react-intl'
import { useNavigate } from 'react-router-dom'

import { useAppDispatch, useAppSelector } from '../../common/hooks'
import { push } from '../notification/notificationSlice'
import { selectAll } from '../tag/tagSlice'
import useLoadStory from './useLoadStory'

export default () => {
  const dispatch = useAppDispatch()
  const tags = useAppSelector(selectAll)
  const navigate = useNavigate()

  const { isLoading, story, error } = useLoadStory()

  useEffect(() => {
    if (isLoading) return
    if (story === undefined) {
      if (error !== null) {
        dispatch(push(error))
      }
      navigate('/')
      return
    }
  }, [isLoading, story, error])

  if (!isLoading && story === undefined) return <div></div>

  return (
    <Stack direction="column" spacing={4}>
      <Typography variant="h4">
        {isLoading ? <Skeleton variant="text" width={200} /> : story!.title}
      </Typography>
      <Typography variant="body1" color="text.secondary">
        {isLoading ? (
          <Skeleton variant="text" width={200} />
        ) : (
          <FormattedDate
            value={new Date(story!.happenedAt)}
            year="numeric"
            month="long"
            day="2-digit"
          />
        )}
      </Typography>
      <Typography variant="body1">
        {isLoading ? <Skeleton variant="text" height={80} /> : story!.detail}
      </Typography>
      {!isLoading && (
        <>
          <Stack direction="row" spacing={1}>
            {tags
              .filter((tag) => story!.tagIds.includes(tag.id!))
              .map((tag) => (
                <Chip
                  key={`tag-${tag.id}`}
                  label={tag.name}
                  sx={{ backgroundColor: tag.color }}
                />
              ))}
          </Stack>

          <ButtonGroup>
            <Button
              onClick={() => {
                navigate(`/stories/${story!.id}/update`)
              }}
            >
              <FormattedMessage defaultMessage="Update" id="button.update" />
            </Button>
            <Button onClick={() => navigate('/')}>
              <FormattedMessage defaultMessage="Back" id="button.back" />
            </Button>
          </ButtonGroup>
        </>
      )}
    </Stack>
  )
}
